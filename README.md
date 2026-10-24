`github:FerrariLewis/dsh-open-beauty#release-bundles`

# DSH Open Beauty · 开场美学

让每一次打开 DeepSeek Harness，都像启动一款喜欢的游戏。

原片完整开场、三款 DeepSeek 标题封面，以及“按任意键进入”的仪式感。你可以使用内置动画，也可以上传自己的视频与图片。

![Open Beauty 白色远山封面](assets/end-covers/silver.png)

## 安装

在 Harness 的 **插件 → 添加插件** 中粘贴 README 第一行的接入代码，按提示安装并启用。需要时完全退出后重新打开 Harness。

```sh
dsh plugin --profile desktop add "github:FerrariLewis/dsh-open-beauty#release-bundles"
```

Web 版将 `desktop` 换成 `web`。`release-bundles` 是自动维护的预构建分支，使用者无需编译。首次发布工作流完成后，该接入代码生效。

## 像游戏一样开启

**开场动画 → 标题停留页 → 按任意键进入 Harness。**

- 内置与导入视频按原长度、原速自然播放，不截断、不循环补时。
- 技术档案播放完整程序序列，约15秒。设置中不提供时长调整。
- 动画中按一下任意键或点击画面，先到标题页；松开后再按一次才进入。长按不会连跳。
- 标题页停止开场声音，主图保持静止，等候输入。
- 播放层覆盖整个 Harness 窗口，包括侧栏与设置弹窗。

## 自定义你的开场

| 功能 | 内容 |
| --- | --- |
| 五个内置开场 | 品牌序章、霓虹脉冲、数字苏醒、启动问候、技术档案 |
| 自己的视频 | MP4 / M4V / WebM，最大200 MB，推荐H.264 / AAC |
| 三款标题封面 | 白色远山、黑金烟雾、深蓝数字海面，默认白色远山 |
| 自己的结束图片 | PNG / JPEG / WebP，最大20 MB，可切换与移除 |
| 声音和显示 | 静音、音量、铺满窗口或完整显示 |
| 随机与预览 | 每次随机开场，随时预览动画或标题页 |

在 **设置 → 开机动画** 中修改，选择自动保存。浏览器若拦截有声自动播放，动画会静音开始，提供“开启声音”按钮。播放失败时仍能进入可操作的标题页。

这里覆盖的是 Harness 客户端窗口，不会替换系统开机过程或隐藏系统任务栏。关闭到托盘后重新显示同一窗口，不算重新启动。

## 一次安装，持续更新

进入 **设置 → 开机动画 → 版本与更新**，点“检查更新”，有新版本时点“更新到…”。更新包先核对大小、SHA-256、包名与版本，再由 Harness 官方插件管理器原位更新。完成后按提示重新打开 Harness。

**不用先卸载，不用重新导入个人素材。** 视频、结束图片和偏好默认保存在用户目录 `.dsh/boot-studio/`，正常更新不会清除。导入保留原文件，个人媒体不会上传云端。检查更新只连接本项目的 GitHub 发布通道，未发布或网络不可达时本地版本继续使用。

升级会忽略旧版的时长设置，下一次保存时移除该旧字段，其他偏好保留。

## 维护与发布

首次在仓库 **Actions → Publish Open Beauty → Run workflow** 运行发布。绿色完成后，工作流会生成 `release-bundles` 分支、具体版本 Release 和固定维护通道。后续修改代码或素材，同时提高 `package.json.version` 再提交，工作流会自动构建、检查和发布。

内部包ID `dsh-boot-studio` 和用户数据目录保持不变，保证同一插件原位升级。不要用同版本号替换不同的包。

Harness“发现”的索引源地址：

```text
https://github.com/FerrariLewis/dsh-open-beauty/releases/download/channel-stable/plugin-index.json
```

添加后搜索 Open Beauty 或“开机动画”。索引和维护通道在首次发布成功后生效。

## 开发与检查

```sh
pnpm install
pnpm run build
pnpm pack
pnpm test
pnpm exec playwright install chrome
pnpm exec playwright test
```

构建会生成 `lib/` 和独立预览，不需要手工上传生成文件。开发预览可用 `pnpm preview`，打开 `http://127.0.0.1:4179`。独立预览不安装或更新 Harness 插件。

## 来源与许可

四段视频来自 [dsh-boot-animation](https://github.com/NativeDog1/dsh-boot-animation)，按BSD-3-Clause复用。技术档案使用 [dsh-startup-screen](https://github.com/6shenhonghong9/dsh-startup-screen) 的MIT视觉代码与合成音效。三款标题封面由本项目生成并选定。

本项目是社区插件。完整版权与来源见 [第三方说明](THIRD_PARTY_NOTICES.md) 和 [LICENSE](LICENSE)。
