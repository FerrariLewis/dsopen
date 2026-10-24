import { test, expect } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'

const baseSettings = { enabled:true, sound:false, volume:0.7, fit:'cover', shuffle:false, selectedId:'brand', endScreen:'logo', endImageId:null, logoVariant:'silver', endFit:'contain' }
const headers = { 'x-dsh-boot-studio':'1' }
const videoFile = fileURLToPath(new URL('../assets/deepseek-brand-intro.mp4',import.meta.url))
// A tiny real PNG fixture, distinct from the candidate design artwork.
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAEElEQVQImWPQTTkBRwzEcQAnQhWRpfZICQAAAABJRU5ErkJggg==','base64')
async function settings(request,patch) {
  const response=await request.post('/dsh-boot-studio/settings',{headers,data:patch})
  expect(response.ok()).toBeTruthy();return response.json()
}
async function endPhase(page) {
  await expect(page.getByTestId('player')).toHaveAttribute('data-phase','end')
  await expect(page.getByTestId('player').getByText('按任意键进入',{exact:true})).toBeVisible()
  await expect(page.getByTestId('boot-video')).toHaveCount(0)
}
async function finishVideoNaturally(page) {
  const video=page.getByTestId('boot-video')
  await expect.poll(()=>video.evaluate(element=>Number.isFinite(element.duration)&&element.duration>0&&element.readyState>=2)).toBeTruthy()
  expect(await video.evaluate(element=>element.loop)).toBeFalsy()
  // Seek near the original end and let the browser emit its real ended event.
  await video.evaluate(async element=>{element.currentTime=Math.max(0,element.duration-0.1);element.playbackRate=16;await element.play()})
  await endPhase(page)
}
async function enterWorkspace(page,key='Enter') {
  // These are intentionally separate inputs outside the 250ms debounce guard.
  await page.waitForTimeout(280);await page.keyboard.press(key)
  await expect(page.getByTestId('player')).toHaveCount(0)
}
async function assertFullscreen(page,selector='.bs-player') {
  const value=await page.evaluate(selector=>{
    const rect=document.querySelector(selector).getBoundingClientRect()
    const points=[[2,2],[innerWidth-3,2],[innerWidth-3,innerHeight-3],[2,innerHeight-3],[innerWidth/2,innerHeight/2]]
    return {x:rect.x,y:rect.y,width:rect.width,height:rect.height,vw:innerWidth,vh:innerHeight,hits:points.map(([x,y])=>Boolean(document.elementFromPoint(x,y)?.closest('.bs-player')))}
  },selector)
  expect(value.x).toBeCloseTo(0,0);expect(value.y).toBeCloseTo(0,0)
  expect(value.width).toBeCloseTo(value.vw,0);expect(value.height).toBeCloseTo(value.vh,0)
  expect(value.hits).toEqual([true,true,true,true,true])
}
async function openSettingsPage(page,request) {
  await settings(request,{enabled:false});await page.goto('/?page=settings')
  await expect(page.getByRole('heading',{name:'动画片库',exact:true})).toBeVisible()
}
test.beforeEach(async({request})=>{await settings(request,baseSettings)})

test('启动视频铺满窗口，点击跳标题，再次操作进入；刷新重新播放',async({page})=>{
  await page.goto('/')
  const player=page.getByTestId('player')
  await expect(player).toHaveAttribute('data-phase','intro')
  await expect(page.getByText('按任意键跳过动画',{exact:true})).toBeVisible()
  await expect(page.getByRole('button',{name:/跳过动画/})).toHaveCount(0)
  await expect.poll(()=>page.getByTestId('boot-video').evaluate(video=>video.currentTime)).toBeGreaterThan(0)
  await assertFullscreen(page,'[data-testid="boot-video"]')
  await player.click({position:{x:50,y:50}});await endPhase(page)
  await assertFullscreen(page,'.bs-player [data-testid="end-screen"]')
  await page.waitForTimeout(500);await expect(player).toBeVisible()
  await enterWorkspace(page);await page.reload();await expect(player).toHaveAttribute('data-phase','intro')
})

for(const key of ['a','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','Enter','Escape']) {
  test(key+' 可独立完成动画、标题、进入两个阶段',async({page})=>{
    await page.goto('/');await expect(page.getByTestId('player')).toHaveAttribute('data-phase','intro')
    await page.keyboard.press(key);await endPhase(page);await enterWorkspace(page,key)
  })
}

test('长按重复键和快速双击不会连续穿过两个阶段',async({page})=>{
  await page.goto('/');await expect(page.getByTestId('player')).toHaveAttribute('data-phase','intro')
  await page.keyboard.down('a');await endPhase(page)
  await page.waitForTimeout(300);await page.keyboard.down('a');await page.waitForTimeout(300)
  await expect(page.getByTestId('player')).toHaveAttribute('data-phase','end')
  await page.keyboard.up('a');await enterWorkspace(page)
  await page.reload();await expect(page.getByTestId('player')).toHaveAttribute('data-phase','intro')
  await page.mouse.dblclick(100,100,{delay:20});await endPhase(page);await enterWorkspace(page)
})

test('原片自然结束后停在标题，页面内切换不重复播放',async({page})=>{
  await page.goto('/')
  await expect(page.getByTestId('player')).toHaveAttribute('data-phase','intro');await finishVideoNaturally(page)
  await page.waitForTimeout(700);await expect(page.getByTestId('player')).toHaveAttribute('data-phase','end')
  await enterWorkspace(page);await page.reload()
  await expect.poll(()=>page.getByTestId('boot-video').evaluate(video=>video.currentTime)).toBeGreaterThan(0)
  expect(await page.getByTestId('boot-video').evaluate(video=>video.loop)).toBeFalsy()
  await page.getByTestId('boot-video').evaluate(video=>{video.playbackRate=16});await endPhase(page)
  await enterWorkspace(page);await page.getByRole('button',{name:'⚙　开机动画设置'}).click()
  await expect(page.getByTestId('settings')).toBeVisible();await expect(page.getByTestId('player')).toHaveCount(0)
})

test('关闭自动播放后刷新不遮挡',async({page,request})=>{
  await settings(request,{enabled:false});await page.goto('/')
  await expect(page.getByRole('heading',{name:'每次打开，从喜欢的画面开始。'})).toBeVisible()
  await page.waitForTimeout(500);await expect(page.getByTestId('player')).toHaveCount(0)
})

test('声音、画面适配、片源和结束设置跨刷新保留，界面没有时长控件',async({page,request})=>{
  await openSettingsPage(page,request)
  await expect(page.getByRole('spinbutton',{name:'播放时长（秒）'})).toHaveCount(0)
  await expect(page.getByRole('button',{name:'恢复10秒默认',exact:true})).toHaveCount(0)
  await page.getByRole('switch',{name:/^播放声音/}).click();await expect(page.getByRole('switch',{name:/^播放声音/})).toBeChecked()
  await expect(page.getByRole('slider',{name:'音量',exact:true})).toBeVisible()
  await page.getByRole('combobox',{name:'画面显示',exact:true}).selectOption('contain')
  const cyberpunk=page.locator('article').filter({has:page.getByRole('heading',{name:'DeepSeek · 霓虹脉冲'})})
  await cyberpunk.getByRole('button',{name:'使用此动画'}).click();await expect(cyberpunk.getByRole('button',{name:'✓ 当前动画'})).toBeVisible()
  await page.reload();await expect(page.getByRole('spinbutton',{name:'播放时长（秒）'})).toHaveCount(0)
  await expect(page.getByRole('switch',{name:/^播放声音/})).toBeChecked()
  await expect(page.getByRole('combobox',{name:'画面显示',exact:true})).toHaveValue('contain')
  await expect(cyberpunk.getByRole('button',{name:'✓ 当前动画'})).toBeVisible()
  await expect(page.getByRole('combobox',{name:'结束画面类型'})).toHaveValue('logo')
})

test('移动端无横向溢出，560px 宿主面板保持两列与完整标题',async({page,request})=>{
  await openSettingsPage(page,request);await page.setViewportSize({width:390,height:844})
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy()
  if(process.env.CAPTURE_MOBILE_PREVIEW==='1'){
    await expect.poll(()=>page.locator('.bs-thumbnail video').evaluateAll(videos=>videos.every(video=>video.readyState>=2))).toBeTruthy()
    await page.screenshot({path:'docs/screenshots/settings-mobile.png',fullPage:true})
  }
  await page.setViewportSize({width:1440,height:1000});await page.getByTestId('settings').evaluate(panel=>{panel.style.width='560px'})
  const layout=await page.getByTestId('settings').evaluate(panel=>({columns:getComputedStyle(panel.querySelector('.bs-library')).gridTemplateColumns.split(/\s+/).length,cardWidths:Array.from(panel.querySelectorAll('.bs-clip'),card=>card.getBoundingClientRect().width),headingClipped:panel.querySelector('h1').scrollWidth>panel.querySelector('h1').clientWidth+1,overflow:panel.scrollWidth>panel.clientWidth+1}))
  expect(layout.columns).toBe(2);expect(Math.min(...layout.cardWidths)).toBeGreaterThanOrEqual(200)
  expect(layout.headingClipped).toBeFalsy();expect(layout.overflow).toBeFalsy()
})

test('片库缩略图视频填满其预览区域',async({page,request})=>{
  await openSettingsPage(page,request)
  const offset=await page.locator('.bs-thumbnail').first().evaluate(button=>{
    const a=button.getBoundingClientRect(),b=button.querySelector('video').getBoundingClientRect()
    return Math.max(Math.abs(a.top-b.top),Math.abs(a.left-b.left),Math.abs(a.width-b.width),Math.abs(a.height-b.height))
  });expect(offset).toBeLessThanOrEqual(1)
})

test('两个阶段都在宿主原生对话框上方并铺满，进入后原对话框保留',async({page,request})=>{
  await openSettingsPage(page,request)
  await page.evaluate(async()=>{
    const state=await fetch('/dsh-boot-studio/state').then(response=>response.json())
    const dialog=document.createElement('dialog');dialog.dataset.hostModal='1';dialog.textContent='Host modal';document.body.appendChild(dialog);dialog.showModal()
    window.dispatchEvent(new CustomEvent('dsh-boot-studio:play',{detail:{clip:state.clips.find(clip=>clip.id===state.settings.selectedId),settings:state.settings}}))
  })
  await expect(page.getByTestId('player')).toHaveAttribute('data-phase','intro');await assertFullscreen(page,'[data-testid="boot-video"]')
  await page.mouse.click(100,100);await endPhase(page);await assertFullscreen(page,'.bs-player [data-testid="end-screen"]')
  await page.waitForTimeout(280);await page.mouse.click(100,100);await expect(page.getByTestId('player')).toHaveCount(0)
  await expect.poll(()=>page.locator('dialog[data-host-modal="1"]').evaluate(dialog=>dialog.open)).toBeTruthy()
  await expect(page.getByText('Host modal',{exact:true})).toBeVisible()
})

test('视频上传、预览、两阶段进入、取消和确认移除',async({page,request})=>{
  await openSettingsPage(page,request)
  await page.getByLabel('上传开机视频').setInputFiles({name:'我的开场.mp4',mimeType:'video/mp4',buffer:await readFile(videoFile)})
  const card=page.locator('article').filter({has:page.getByRole('heading',{name:'我的开场',exact:true})})
  await expect(card).toBeVisible({timeout:15000});await expect(card.getByRole('button',{name:'✓ 当前动画'})).toBeVisible()
  await card.getByRole('button',{name:'预览 我的开场',exact:true}).click()
  await expect.poll(()=>page.getByTestId('boot-video').evaluate(video=>video.currentTime)).toBeGreaterThan(0)
  await page.keyboard.press('q');await endPhase(page);await enterWorkspace(page)
  await card.getByRole('button',{name:'删除 我的开场',exact:true}).click();await card.getByRole('button',{name:'取消',exact:true}).click();await expect(card).toBeVisible()
  await card.getByRole('button',{name:'删除 我的开场',exact:true}).click();await card.getByRole('button',{name:'确认移除',exact:true}).click();await expect(card).toHaveCount(0)
})

test('上传前明确拒绝损坏视频',async({page,request})=>{
  await openSettingsPage(page,request)
  await page.getByLabel('上传开机视频').setInputFiles({name:'无法播放.mp4',mimeType:'video/mp4',buffer:Buffer.from('not a video')})
  await expect(page.getByRole('alert')).toContainText('浏览器无法读取此视频');await expect(page.getByRole('heading',{name:'无法播放'})).toHaveCount(0)
})

test('有声策略拒绝时静音回退，开启声音不推进，进入标题立即停掉声音',async({page,request})=>{
  await settings(request,{sound:true})
  await page.addInitScript(()=>{
    const native=HTMLMediaElement.prototype.play;let rejected=false
    HTMLMediaElement.prototype.play=function(){if(!this.muted&&!rejected){rejected=true;return Promise.reject(new DOMException('Test autoplay policy','NotAllowedError'))}return native.call(this)}
  })
  await page.goto('/');const sound=page.getByRole('button',{name:'♪ 开启声音'})
  await expect(sound).toBeVisible();await sound.click();await expect(page.getByTestId('player')).toHaveAttribute('data-phase','intro')
  await expect.poll(()=>page.getByTestId('boot-video').evaluate(video=>video.muted)).toBeFalsy()
  await page.getByTestId('boot-video').evaluate(video=>{window.__heldVideo=video})
  await page.keyboard.press('a');await endPhase(page)
  expect(await page.evaluate(()=>({paused:window.__heldVideo.paused,src:window.__heldVideo.getAttribute('src'),connected:window.__heldVideo.isConnected}))).toEqual({paused:true,src:null,connected:false})
  await enterWorkspace(page)
})

test('视频加载错误进入可操作标题页，不阻塞工作区',async({page})=>{
  await page.route('**/dsh-boot-studio/media/**',route=>route.fulfill({status:404,body:'missing'}))
  await page.goto('/');await endPhase(page);await enterWorkspace(page)
  await expect(page.getByRole('heading',{name:'每次打开，从喜欢的画面开始。'})).toBeVisible()
})

test('结束图片上传自动选用且持久化，旧播放设置保留，删除回到标志',async({page,request})=>{
  await openSettingsPage(page,request);await settings(request,{volume:0.43,fit:'contain'});await page.reload()
  await page.getByLabel('上传结束图片',{exact:true}).setInputFiles({name:'我的封面.png',mimeType:'image/png',buffer:png})
  const card=page.locator('.bs-end-card').filter({has:page.getByRole('button',{name:'使用结束图片 我的封面',exact:true})})
  await expect(card).toBeVisible();await expect(page.getByRole('combobox',{name:'结束画面类型'})).toHaveValue('image')
  await page.getByRole('combobox',{name:'结束图片显示'}).selectOption('cover');await page.reload()
  await expect(page.getByRole('combobox',{name:'结束画面类型'})).toHaveValue('image');await expect(page.getByRole('combobox',{name:'结束图片显示'})).toHaveValue('cover')
  await expect(page.getByRole('spinbutton',{name:'播放时长（秒）'})).toHaveCount(0)
  const state=await request.get('/dsh-boot-studio/state').then(response=>response.json());expect(state.settings.volume).toBe(0.43);expect(state.settings.fit).toBe('contain')
  await page.getByRole('button',{name:'预览结束画面',exact:true}).click();await endPhase(page)
  await expect.poll(()=>page.getByTestId('player').getByTestId('end-image').evaluate(image=>image.complete&&image.naturalWidth>0)).toBeTruthy()
  await assertFullscreen(page,'.bs-player [data-testid="end-image"]');await enterWorkspace(page)
  await card.getByRole('button',{name:'移除结束图片 我的封面',exact:true}).click();await card.getByRole('button',{name:'取消',exact:true}).click();await expect(card).toBeVisible()
  await card.getByRole('button',{name:'移除结束图片 我的封面',exact:true}).click();await card.getByRole('button',{name:'确认移除',exact:true}).click();await expect(card).toHaveCount(0)
  await expect(page.getByRole('combobox',{name:'结束画面类型'})).toHaveValue('logo')
})

test('结束图片片库可切换和切回标志，坏图片不会入库',async({page,request})=>{
  await openSettingsPage(page,request)
  await page.getByLabel('上传结束图片',{exact:true}).setInputFiles({name:'第一张.png',mimeType:'image/png',buffer:png})
  await expect(page.getByRole('button',{name:'使用结束图片 第一张',exact:true})).toBeVisible()
  await page.getByLabel('上传结束图片',{exact:true}).setInputFiles({name:'第二张.png',mimeType:'image/png',buffer:png})
  await expect(page.getByRole('button',{name:'使用结束图片 第二张',exact:true})).toBeVisible()
  await page.getByRole('button',{name:'使用结束图片 第一张',exact:true}).click();await expect(page.locator('.bs-end-card.is-selected').getByText('第一张',{exact:true})).toBeVisible()
  await page.getByRole('combobox',{name:'结束画面类型'}).selectOption('logo');await expect(page.getByRole('combobox',{name:'结束画面类型'})).toHaveValue('logo')
  await page.getByLabel('上传结束图片',{exact:true}).setInputFiles({name:'坏图片.png',mimeType:'image/png',buffer:Buffer.from('not an image')})
  await expect(page.getByRole('alert')).toContainText('无法读取这张图片');await expect(page.getByRole('button',{name:'使用结束图片 坏图片',exact:true})).toHaveCount(0)
})

test('三张内置结束封面可直接切换、真实解码并跨刷新保留',async({page,request})=>{
  await openSettingsPage(page,request)
  const choices=[['silver','白色远山'],['gold','黑金烟雾'],['ice','深蓝数字海面']]
  for(const [id,name] of choices){
    const choice=page.getByRole('button',{name:'使用内置结束画面 '+name,exact:true})
    await choice.click();await expect(choice).toHaveClass(/is-selected/)
    const mini=page.locator('.bs-ending-mini').getByTestId('end-logo-image')
    await expect(mini).toHaveAttribute('src','/dsh-boot-studio/logo/'+id)
    await expect.poll(()=>mini.evaluate(image=>image.complete&&image.naturalWidth>0)).toBeTruthy()
    await page.reload();await expect(choice).toHaveClass(/is-selected/)
    await expect(page.getByRole('combobox',{name:'结束画面类型'})).toHaveValue('logo')
    const state=await request.get('/dsh-boot-studio/state').then(response=>response.json())
    expect(state.settings.logoVariant).toBe(id)
  }
})

test('三张内置封面在真实动画结束后解码、铺满五点命中并停留',async({page,request})=>{
  for(const id of ['silver','gold','ice']){
    await settings(request,{logoVariant:id});await page.goto('/')
    await expect(page.getByTestId('player')).toHaveAttribute('data-phase','intro');await finishVideoNaturally(page)
    const image=page.getByTestId('player').getByTestId('end-logo-image')
    await expect(image).toHaveAttribute('src','/dsh-boot-studio/logo/'+id)
    await expect.poll(()=>image.evaluate(image=>image.complete&&image.naturalWidth>0)).toBeTruthy()
    await assertFullscreen(page,'.bs-player [data-testid="end-logo-image"]')
    await enterWorkspace(page)
  }
})

test('从用户结束图片切回内置封面会保留上传片库并记住选择',async({page,request})=>{
  await openSettingsPage(page,request)
  await page.getByLabel('上传结束图片',{exact:true}).setInputFiles({name:'切换测试.png',mimeType:'image/png',buffer:png})
  const userChoice=page.getByRole('button',{name:'使用结束图片 切换测试',exact:true})
  await expect(userChoice).toBeVisible();await expect(page.getByRole('combobox',{name:'结束画面类型'})).toHaveValue('image')
  await page.getByRole('button',{name:'使用内置结束画面 黑金烟雾',exact:true}).click()
  await expect(page.getByRole('combobox',{name:'结束画面类型'})).toHaveValue('logo')
  await expect(userChoice).toBeVisible();await page.reload()
  await expect(page.getByRole('button',{name:'使用内置结束画面 黑金烟雾',exact:true})).toHaveClass(/is-selected/)
  await page.getByRole('button',{name:'预览结束画面',exact:true}).click();await endPhase(page)
  await expect(page.getByTestId('player').getByTestId('end-image')).toHaveCount(0)
  const image=page.getByTestId('player').getByTestId('end-logo-image')
  await expect(image).toHaveAttribute('src','/dsh-boot-studio/logo/gold')
  await expect.poll(()=>image.evaluate(image=>image.complete&&image.naturalWidth>0)).toBeTruthy()
  await enterWorkspace(page)
})

test('内置封面缺失时回退可操作的矢量标志',async({page,request})=>{
  await settings(request,{logoVariant:'silver'})
  await page.route('**/dsh-boot-studio/logo/silver',route=>route.fulfill({status:404,body:'missing'}))
  await page.goto('/');await finishVideoNaturally(page)
  await expect(page.getByTestId('player').getByRole('img',{name:'DeepSeek 标志'})).toBeVisible()
  await expect(page.getByTestId('player').getByTestId('end-logo-image')).toHaveCount(0)
  await enterWorkspace(page)
})

test('技术档案完整自然播放约15秒后停在标题，选择时无时长设置',async({page,request})=>{
  test.setTimeout(45000)
  await openSettingsPage(page,request)
  const card=page.locator('article').filter({has:page.getByRole('heading',{name:'DeepSeek · 技术档案',exact:true})})
  await card.getByRole('button',{name:'使用此动画',exact:true}).click();await expect(page.getByRole('spinbutton',{name:'播放时长（秒）'})).toHaveCount(0)
  await page.getByRole('button',{name:'▶ 预览当前动画',exact:true}).click();await expect(page.getByTestId('startup-sequence')).toBeVisible()
  await assertFullscreen(page,'[data-testid="startup-sequence"]')
  await expect(page.getByTestId('startup-sequence').locator('#dsh-startup-root')).toBeVisible()
  const startedAt=Date.now()
  await expect(page.getByTestId('player')).toHaveAttribute('data-phase','end',{timeout:30000})
  expect(Date.now()-startedAt).toBeGreaterThan(10000)
  await endPhase(page);await expect(page.getByTestId('startup-sequence')).toHaveCount(0);await enterWorkspace(page)
})

test('程序动画中途按键跳过会销毁其DOM和声音作用域',async({page,request})=>{
  await page.addInitScript(()=>{
    const NativeContext=window.AudioContext||window.webkitAudioContext
    window.__sequenceContexts=[]
    function TrackedContext(...args){const context=new NativeContext(...args);window.__sequenceContexts.push(context);return context}
    TrackedContext.prototype=NativeContext.prototype
    window.AudioContext=TrackedContext;window.webkitAudioContext=TrackedContext
  })
  await settings(request,{selectedId:'startup-screen',sound:true});await page.goto('/')
  await expect(page.getByTestId('startup-sequence')).toBeVisible()
  await expect(page.getByTestId('startup-sequence').locator('#dsh-startup-root')).toBeVisible()
  await expect.poll(()=>page.evaluate(()=>window.__sequenceContexts.length)).toBeGreaterThan(0)
  await page.keyboard.press('ArrowRight');await endPhase(page);await expect(page.getByTestId('startup-sequence')).toHaveCount(0)
  await expect.poll(()=>page.evaluate(()=>window.__sequenceContexts.every(context=>context.state==='closed'))).toBeTruthy()
  await page.waitForTimeout(400);await expect(page.getByTestId('player')).toHaveAttribute('data-phase','end');await enterWorkspace(page)
})

for (const id of ['brand','cyberpunk','awakening','startup']) {
  test(id+' 按原视频长度播放，不循环且不受旧10秒上限控制',async({page,request})=>{
    await settings(request,{selectedId:id})
    await page.clock.install()
    await page.goto('/')
    await expect(page.getByTestId('player')).toHaveAttribute('data-phase','intro')
    await expect.poll(()=>page.getByTestId('boot-video').evaluate(video=>video.currentTime)).toBeGreaterThan(0)
    expect(await page.getByTestId('boot-video').evaluate(video=>video.loop)).toBeFalsy()
    await page.clock.fastForward(11000)
    await expect(page.getByTestId('player')).toHaveAttribute('data-phase','intro')
    await finishVideoNaturally(page)
  })
}

test('短内置原视频真实播放结束即进入标题，不循环补到10秒',async({page})=>{
  test.setTimeout(20000)
  await page.goto('/')
  const video=page.getByTestId('boot-video')
  await expect.poll(()=>video.evaluate(element=>element.currentTime)).toBeGreaterThan(0)
  const originalDuration=await video.evaluate(element=>{
    window.__naturalLoopCount=0;let previous=element.currentTime
    element.addEventListener('timeupdate',()=>{if(element.isConnected&&element.hasAttribute('src')&&element.readyState>=2&&!element.paused&&element.currentTime+0.2<previous)window.__naturalLoopCount++;previous=element.currentTime})
    return element.duration
  })
  expect(originalDuration).toBeLessThan(10)
  const startedAt=Date.now()
  await expect(page.getByTestId('player')).toHaveAttribute('data-phase','end',{timeout:Math.ceil((originalDuration+2)*1000)})
  const elapsed=(Date.now()-startedAt)/1000
  expect(elapsed).toBeGreaterThan(originalDuration-0.6)
  expect(elapsed).toBeLessThan(originalDuration+1)
  expect(elapsed).toBeLessThan(10)
  expect(await page.evaluate(()=>window.__naturalLoopCount)).toBe(0)
})

test('时长功能已完全移除，切换全部片源保留其余偏好',async({page,request})=>{
  await openSettingsPage(page,request)
  await settings(request,{volume:0.36,fit:'contain',logoVariant:'gold'})
  await page.reload()
  await expect(page.getByRole('spinbutton',{name:'播放时长（秒）'})).toHaveCount(0)
  await expect(page.getByRole('button',{name:'应用',exact:true})).toHaveCount(0)
  await expect(page.getByRole('button',{name:'恢复10秒默认',exact:true})).toHaveCount(0)
  for (const name of ['DeepSeek · 霓虹脉冲','DeepSeek · 数字苏醒','DeepSeek · 启动问候','DeepSeek · 技术档案','DeepSeek · 品牌序章']) {
    const card=page.locator('article').filter({has:page.getByRole('heading',{name,exact:true})})
    await card.getByRole('button',{name:'使用此动画',exact:true}).click()
    await expect(card.getByRole('button',{name:'✓ 当前动画',exact:true})).toBeVisible()
    const state=await request.get('/dsh-boot-studio/state').then(response=>response.json())
    expect(state.settings).not.toHaveProperty('duration')
    expect(state.settings.volume).toBe(0.36)
    expect(state.settings.fit).toBe('contain')
    expect(state.settings.logoVariant).toBe('gold')
  }
})

test('用户导入视频不循环，真实ended事件转入标题',async({page,request})=>{
  const uploaded=await request.post('/dsh-boot-studio/upload',{headers:{...headers,'x-file-name':encodeURIComponent('保留原长度.mp4'),'content-type':'video/mp4'},data:await readFile(videoFile)})
  expect(uploaded.status()).toBe(201)
  const {clip}=await uploaded.json()
  await page.goto('/')
  await expect(page.getByTestId('boot-video')).toHaveAttribute('src',clip.url)
  await finishVideoNaturally(page)
  await enterWorkspace(page)
  expect((await request.delete('/dsh-boot-studio/clips/'+clip.id,{headers})).ok()).toBeTruthy()
})

// Maintenance calls are mocked here. These tests never contact GitHub or install
// a real package; the authenticated official Host upgrade was verified separately.
async function mockMaintenance(page,{channelReady=true,prepareError=null,rpcStatus=200,rpcApplication='restart-required'}={}) {
  const calls={check:[],prepare:[],rpc:[]}
  await page.route('**/dsh-boot-studio/updates/**',async route=>{
    const req=route.request(),path=new URL(req.url()).pathname
    if(path.endsWith('/status'))return route.fulfill({json:{packageName:'dsh-boot-studio',currentVersion:'1.2.0'}})
    if(path.endsWith('/check')){
      calls.check.push({method:req.method(),body:req.postDataJSON()})
      return route.fulfill({json:channelReady?{currentVersion:'1.2.0',available:true,channelReady:true,latestVersion:'1.3.0',manifest:{releaseNotesUrl:'https://github.com/FerrariLewis/dsh-open-beauty/releases/tag/v1.3.0'},message:'有新版本可用。'}:{currentVersion:'1.2.0',available:false,channelReady:false,message:'维护通道尚未发布，当前版本可以继续使用。'}})
    }
    if(path.endsWith('/prepare')){
      calls.prepare.push({method:req.method(),body:req.postDataJSON()})
      return prepareError?route.fulfill({status:400,json:{error:prepareError}}):route.fulfill({json:{version:'1.3.0',spec:'C:/example/dsh-boot-studio-1.3.0-verified.tgz',sha256:'a'.repeat(64),requiresRestart:true}})
    }
    return route.fulfill({status:404,json:{error:'Unexpected mocked maintenance route'}})
  })
  await page.route('**/api/pluginManager/installBundle',async route=>{
    const req=route.request(),body=req.postDataJSON()
    calls.rpc.push({method:req.method(),path:new URL(req.url()).pathname,body})
    if(rpcStatus!==200)return route.fulfill({status:rpcStatus,json:{error:'owner permission required'}})
    const value=rpcApplication==='failed'?{application:'failed',stage:'install',error:{code:'operation-error',diagnostic:'模拟安装失败：官方管理器拒绝此次更新。'}}:{application:rpcApplication,changed:true,stage:'enable',bundle:'dsh-boot-studio',version:'1.3.0'}
    return route.fulfill({json:{type:'server-response',rpcId:body.rpcId,result:{ok:true,value}}})
  })
  return calls
}

async function maintenancePanel(page,request,{standalone=false}={}) {
  await settings(request,{enabled:false})
  await page.goto(standalone?'/?page=settings':'/')
  if(!standalone)await page.evaluate(()=>window.dispatchEvent(new Event('dsh-boot-studio:open')))
  const panel=page.getByTestId('update-panel')
  await expect(panel).toContainText('v1.2.0')
  return panel
}

test.describe('更新维护',()=>{
  test('未发布维护通道时保留当前功能，不请求暂存或安装',async({page,request})=>{
    const calls=await mockMaintenance(page,{channelReady:false})
    const panel=await maintenancePanel(page,request)
    await panel.getByRole('button',{name:'检查更新',exact:true}).click()
    await expect(panel.getByRole('status')).toContainText('维护通道尚未发布')
    await expect(panel.getByRole('button',{name:/更新到/})).toHaveCount(0)
    await expect(page.getByRole('heading',{name:'动画片库',exact:true})).toBeVisible()
    expect(calls.check).toEqual([{method:'POST',body:{}}])
    expect(calls.prepare).toEqual([]);expect(calls.rpc).toEqual([])
  })

  test('检查仅展示版本，显式点击后才校验并调用官方拥有者 RPC',async({page,request})=>{
    const calls=await mockMaintenance(page)
    const panel=await maintenancePanel(page,request)
    await panel.getByRole('button',{name:'检查更新',exact:true}).click()
    const update=panel.getByRole('button',{name:'更新到 1.3.0',exact:true})
    await expect(update).toBeEnabled()
    expect(calls.prepare).toEqual([]);expect(calls.rpc).toEqual([])
    await update.click()
    await expect(panel.getByRole('status')).toContainText('更新完成。请完全退出并重启 Harness')
    await expect(panel).toContainText('v1.3.0')
    expect(calls.prepare).toEqual([{method:'POST',body:{version:'1.3.0'}}])
    expect(calls.rpc).toHaveLength(1)
    const rpc=calls.rpc[0]
    expect(rpc.method).toBe('POST');expect(rpc.path).toBe('/api/pluginManager/installBundle')
    expect(rpc.body.type).toBe('client-request');expect(typeof rpc.body.rpcId).toBe('string')
    expect(rpc.body.method).toBe('pluginManager/installBundle')
    expect(rpc.body.payload).toEqual({args:{spec:'C:/example/dsh-boot-studio-1.3.0-verified.tgz',options:{enabled:true,saveExact:true,requestId:rpc.body.rpcId}}})
  })

  test('SHA 校验失败不会调用官方安装，也不显示成功',async({page,request})=>{
    const calls=await mockMaintenance(page,{prepareError:'更新包 SHA-256 校验失败，未执行更新。'})
    const panel=await maintenancePanel(page,request)
    await panel.getByRole('button',{name:'检查更新',exact:true}).click()
    await panel.getByRole('button',{name:'更新到 1.3.0',exact:true}).click()
    await expect(panel.getByRole('alert')).toContainText('SHA-256 校验失败')
    await expect(panel).toContainText('v1.2.0')
    await expect(panel.getByText(/更新完成|新版本已应用/)).toHaveCount(0)
    expect(calls.prepare).toHaveLength(1);expect(calls.rpc).toEqual([])
  })

  test('官方 RPC 业务失败不把 HTTP 200 当成成功',async({page,request})=>{
    const calls=await mockMaintenance(page,{rpcApplication:'failed'})
    const panel=await maintenancePanel(page,request)
    await panel.getByRole('button',{name:'检查更新',exact:true}).click()
    await panel.getByRole('button',{name:'更新到 1.3.0',exact:true}).click()
    await expect(panel.getByRole('alert')).toContainText('官方管理器拒绝此次更新')
    await expect(panel).toContainText('v1.2.0')
    await expect(panel.getByText(/更新完成|新版本已应用/)).toHaveCount(0)
    expect(calls.rpc).toHaveLength(1)
  })

  test('401 明确提示拥有者权限，未伪报版本更新',async({page,request})=>{
    const calls=await mockMaintenance(page,{rpcStatus:401})
    const panel=await maintenancePanel(page,request)
    await panel.getByRole('button',{name:'检查更新',exact:true}).click()
    await panel.getByRole('button',{name:'更新到 1.3.0',exact:true}).click()
    await expect(panel.getByRole('alert')).toContainText('没有管理插件的权限')
    await expect(panel.getByRole('alert')).toContainText('拥有者连接')
    await expect(panel).toContainText('v1.2.0')
    expect(calls.rpc).toHaveLength(1)
  })

  test('独立预览可检查但禁用安装，播放设置仍可使用',async({page,request})=>{
    const calls=await mockMaintenance(page)
    const panel=await maintenancePanel(page,request,{standalone:true})
    await expect(panel).toContainText('当前为独立预览')
    await panel.getByRole('button',{name:'检查更新',exact:true}).click()
    await expect(panel.getByRole('button',{name:'更新到 1.3.0',exact:true})).toBeDisabled()
    await expect(page.getByRole('spinbutton',{name:'播放时长（秒）'})).toHaveCount(0)
    await expect(page.getByRole('button',{name:'恢复10秒默认',exact:true})).toHaveCount(0)
    await expect(page.getByRole('switch',{name:/^播放声音/})).toBeVisible()
    expect(calls.prepare).toEqual([]);expect(calls.rpc).toEqual([])
  })
})
