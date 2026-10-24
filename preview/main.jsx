import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { SettingsPanel, BootRoot } from '../src/client.jsx'

function Preview() {
  const [page, setPage] = useState(new URLSearchParams(location.search).get('page') === 'settings' ? 'settings' : 'chat')
  function navigate(next) {
    setPage(next)
    const url = new URL(location.href)
    if (next === 'settings') url.searchParams.set('page', 'settings')
    else url.searchParams.delete('page')
    history.replaceState(null, '', url)
  }
  return <div className="demo-shell">
    <aside className="demo-nav">
      <div className="demo-brand">DSH Open Beauty<span>YOUR CINEMATIC START</span></div>
      <button aria-current={page === 'chat' ? 'page' : undefined} onClick={() => navigate('chat')}>◌　预览工作区</button>
      <button aria-current={page === 'settings' ? 'page' : undefined} onClick={() => navigate('settings')}>⚙　开机动画设置</button>
      <footer>独立本地预览<br/>设置与视频只保存在预览目录<br/>无需 DeepSeek 账号或 API Key</footer>
    </aside>
    <main className="demo-content">
      <div className="demo-banner"><span>开机动画工作室 / {page === 'settings' ? '设置' : '启动效果'}</span><strong>● 本地预览 · {location.host}</strong></div>
      {page === 'settings' ? <SettingsPanel standalone /> : <section className="demo-chat">
        <span className="demo-pill">DSH OPEN BEAUTY · V1.2</span>
        <h1>每次打开，从喜欢的画面开始。</h1>
        <p>开场动画 → 标志或图片停留页 → 按任意键进入。<br/>动画中按键会先跳到标题页，再按一次进入工作区。</p>
        <button onClick={() => { location.reload() }}>模拟重新打开 Harness</button>
        <div className="demo-compose">这是预览工作区，试试左侧的「开机动画设置」<small>所有预览都使用插件的真实播放器。</small></div>
      </section>}
    </main>
    <BootRoot />
  </div>
}
createRoot(document.getElementById('root')).render(<Preview />)
