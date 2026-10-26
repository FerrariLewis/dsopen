import { readHostLocale } from './host-locale.js';

export function translate(zh, en) { return readHostLocale() === 'en' ? en : zh; }

const BUILTIN_NAMES = Object.freeze({
  brand: 'Beginning', cyberpunk: 'Digital Life', awakening: 'Punk', startup: 'Half Face',
  'whale-girl': 'Whale Girl', 'deepseek-title': 'DeepSeek', 'deepseek-dance': 'Dance',
  'deepseek-sea': 'Sea', 'startup-screen': 'Rhine Lab', silver: 'Distant Mountains',
  gold: 'Black and Gold', ice: 'Blue Mist', 'assassins-creed': "Assassin’s Creed",
  'cyberpunk-2077': 'Cyberpunk 2077', gta6: 'GTA6', horizon6: 'Forza Horizon 6',
  horizon5: 'Forza Horizon 5', horizon4: 'Forza Horizon 4', classic: 'Classic',
});

/** Uploaded names are user content and must remain exactly as supplied. */
export function localizedName(item) {
  if (!item) return '';
  const builtin = item.source === 'builtin' || (!item.source && Object.hasOwn(BUILTIN_NAMES, item.id));
  return readHostLocale() === 'en' && builtin ? BUILTIN_NAMES[item.id] || item.name : item.name;
}

const MESSAGES = Object.freeze({
  '设置已保存，下次启动生效': 'Settings saved. Changes take effect on the next launch.',
  '已恢复默认，全部上传的视频和图片已删除。': 'Defaults restored. All uploaded videos and images have been deleted.',
  '视频已移除': 'Video removed.',
  '结束画面已移除': 'End screen removed.',
  '请选择不超过20 MB的PNG、JPEG或WebP图片。': 'Choose a PNG, JPEG or WebP image up to 20 MB.',
  '正在检查结束画面…': 'Checking the end screen…',
  '无法读取这张图片，请更换有效的PNG、JPEG或WebP。': 'Could not read this image. Choose a valid PNG, JPEG or WebP image.',
  '上传失败': 'Upload failed.',
  '图片已上传并设为结束画面': 'Image uploaded and set as the end screen.',
  '图片上传中断，请重试。': 'The image upload was interrupted. Please try again.',
  '正在上传图片…': 'Uploading the image…',
  '请选择 MP4、M4V 或 WebM 视频。推荐 MP4（H.264 / AAC）。': 'Choose an MP4, M4V or WebM video. MP4 (H.264 / AAC) is recommended.',
  '视频应大于 0 字节，且不超过 200 MB。': 'The video must be larger than 0 bytes and no larger than 200 MB.',
  '正在检查视频…': 'Checking the video…',
  '浏览器无法读取此视频。请转换为 MP4（H.264 / AAC）后重试。': 'The browser could not read this video. Convert it to MP4 (H.264 / AAC) and try again.',
  '视频已导入并设为开机动画': 'Video imported and set as the startup animation.',
  '上传中断，请重试。': 'The upload was interrupted. Please try again.',
  '正在上传…': 'Uploading…',
  '设置必须是 JSON 对象。': 'Settings must be a JSON object.',
  '已取消播放时长设置，动画按原始长度完整播放。': 'Playback duration settings have been removed. Animations play at their full original length.',
  '已取消画面显示设置，开机动画始终铺满当前窗口。': 'Display settings have been removed. Startup animations always fill the current window.',
  '更新提醒使用统一外观，已取消单独调节。': 'Update prompts use the shared appearance and no longer have separate controls.',
  '音量须在 0 到 1 之间。': 'Volume must be between 0 and 1.',
  '所选动画不存在，请刷新片库。': 'The selected animation is unavailable. Refresh the library.',
  '结束封面须为 logo 或 image。': 'The end cover must be logo or image.',
  '所选封面图片不存在，请重新上传。': 'The selected cover image is unavailable. Upload it again.',
  '不支持此结束画面。': 'This end screen is not supported.',
  '封面适配须为 cover 或 contain。': 'Cover fit must be cover or contain.',
  '请先上传一张结束封面图片。': 'Upload an end cover image first.',
  '写入请求缺少插件标识。': 'The write request is missing the plugin identifier.',
  '无效来源。': 'Invalid request origin.',
  '不允许跨站修改设置。': 'Settings cannot be changed from another site.',
  '请使用 application/json。': 'Use application/json.',
  '设置内容过大。': 'The settings payload is too large.',
  'JSON 格式不正确。': 'Invalid JSON format.',
  '文件上传已中断。': 'The upload was interrupted.',
  '上传等待超时，请重试。': 'The upload timed out. Please try again.',
  '请求内容超过大小限制。': 'The request exceeds the size limit.',
  '无效的视频字节范围。': 'Invalid video byte range.',
  '设置文件无法读取。请备份并检查 boot-studio/settings.json。': 'Could not read the settings file. Back up and check boot-studio/settings.json.',
  '设置文件版本或片库格式不正确。': 'The settings file version or library format is invalid.',
  '结束封面片库格式不正确。': 'The end cover library format is invalid.',
  '已保存的设置格式不正确，请备份并检查 settings.json。': 'The saved settings are invalid. Back up and check settings.json.',
  '重置清理路径超出数据目录。': 'The reset cleanup path is outside the data directory.',
  '内置素材目录与自定义数据清理范围重叠，未修改设置或素材。': 'Built-in assets overlap the custom data cleanup path. Settings and assets were left unchanged.',
  '重置隔离目录不是安全的本地文件夹，未修改设置或素材。': 'The reset quarantine directory is not a safe local folder. Settings and assets were left unchanged.',
  '重置隔离目录超出数据目录，未修改设置或素材。': 'The reset quarantine directory is outside the data directory. Settings and assets were left unchanged.',
  '文件名编码无效。': 'Invalid filename encoding.',
  '支持 PNG、JPEG 和 WebP 图片，不接受 SVG。': 'PNG, JPEG and WebP images are supported. SVG is not supported.',
  '支持 MP4、M4V 和 WebM 视频。': 'MP4, M4V and WebM videos are supported.',
  '图片格式无效，请上传 PNG、JPEG 或 WebP 图片。': 'Invalid image format. Upload a PNG, JPEG or WebP image.',
  '文件不是有效的 MP4 / WebM 容器。请优先使用 H.264 + AAC 的 MP4。': 'The file is not a valid MP4 / WebM container. An MP4 with H.264 + AAC is recommended.',
  '封面图片不存在或文件已被移走。': 'The cover image is unavailable or its file has been moved.',
  '动画不存在或文件已被移走。': 'The animation is unavailable or its file has been moved.',
  '接口不存在。': 'This endpoint does not exist.',
  '请先检查并选择更新版本。': 'Check for updates and select a version first.',
  '更新包准备失败。': 'Could not prepare the update package.',
  '动画不存在。': 'The animation does not exist.',
  '封面图片不存在。': 'The cover image does not exist.',
  '内置结束封面不存在。': 'The built-in end cover does not exist.',
  '不支持此请求方法。': 'This request method is not supported.',
  '请先确认删除全部自定义视频、图片和偏好。': 'Confirm deletion of all custom videos, images and preferences first.',
  '只能删除自己上传的封面图片。': 'Only uploaded cover images can be deleted.',
  '只能删除自己上传的动画。': 'Only uploaded animations can be deleted.',
  '文件操作失败，请检查数据目录权限和可用空间。': 'The file operation failed. Check data directory permissions and available space.',
  '更新包下载超过 15 分钟，请检查网络后重试。': 'The update download exceeded 15 minutes. Check your connection and try again.',
  '连接更新下载服务超时。': 'The update download connection timed out.',
  '更新包下载长时间没有进展，请检查网络后重试。': 'The update download has stalled. Check your connection and try again.',
  'npm 更新请求离开了允许的注册表。': 'The npm update request left the allowed registries.',
  '连接 npm 注册表超时。': 'The npm registry connection timed out.',
  '无法连接 npm 注册表。': 'Could not connect to the npm registry.',
  'npm 注册表返回了无效跳转。': 'The npm registry returned an invalid redirect.',
  'npm 注册表跳转次数过多。': 'The npm registry returned too many redirects.',
  '读取 npm 注册表内容失败。': 'Could not read the npm registry response.',
  'npm 更新包标识与当前插件不一致。': 'The npm package identifier does not match this plugin.',
  'npm 更新包的仓库标识不属于本项目。': 'The npm package repository does not belong to this project.',
  '不支持的 npm 注册表。': 'This npm registry is not supported.',
  'npm 更新包地址不属于允许的注册表和版本。': 'The npm package URL does not match an allowed registry and version.',
  'npm 更新包缺少有效的 SHA-512 完整性信息。': 'The npm package is missing valid SHA-512 integrity information.',
  'npm 更新包 SHA-512 校验失败，未执行更新。': 'The npm package failed SHA-512 verification. The update was not applied.',
  '维护版本必须使用 X.Y.Z 稳定版本号。': 'Release versions must use a stable X.Y.Z version number.',
  '版本号过大。': 'The version number is too large.',
  '维护清单格式不正确。': 'The update manifest format is invalid.',
  '更新包标识与当前插件不一致。': 'The update package identifier does not match this plugin.',
  '更新提交或 SHA-256 无效。': 'The update commit or SHA-256 is invalid.',
  '更新包大小超出限制。': 'The update package exceeds the size limit.',
  '维护清单缺少发布时间或重启声明。': 'The update manifest is missing its publication time or restart declaration.',
  '只接受本项目固定版本的 GitHub Release 更新包。': 'Only versioned GitHub Release packages from this project are accepted.',
  '更新包 TAR 校验失败。': 'The update package failed TAR verification.',
  '更新包 TAR 长度无效。': 'The update package TAR length is invalid.',
  '更新包内容不完整。': 'The update package is incomplete.',
  '更新包扩展头无效。': 'The update package extension header is invalid.',
  '更新包扩展头长度无效。': 'The update package extension header length is invalid.',
  '更新包含重复 package.json，未执行更新。': 'The update package contains duplicate package.json entries. The update was not applied.',
  '更新包 package.json 无效。': 'The update package package.json is invalid.',
  '更新包包含过多 TAR 条目，未执行更新。': 'The update package contains too many TAR entries. The update was not applied.',
  '更新包中没有 package/package.json。': 'The update package is missing package/package.json.',
  '维护文件读取已中断。': 'Reading the update file was interrupted.',
  '维护文件超过允许大小。': 'The update file exceeds the size limit.',
  '维护文件内容为空。': 'The update file is empty.',
  '更新包未完整下载，请检查网络后重试。': 'The update download is incomplete. Check your connection and try again.',
  'npm 版本尚未发布，当前版本可以继续使用。': 'The npm version is not published yet. You can keep using the current version.',
  '有新版本可用。': 'A new version is available.',
  '当前已是最新版本。': 'You are up to date.',
  '维护通道尚未发布，当前版本可以继续使用。': 'The update channel is not published yet. You can keep using the current version.',
  '连接维护通道超时，请稍后重试。': 'The update channel connection timed out. Please try again later.',
  '另一个版本正在准备，请稍后重新检查。': 'Another version is being prepared. Check again later.',
  '更新版本已变化或尚未发布，请重新检查更新。': 'The update version has changed or is not published yet. Check for updates again.',
  '更新包 SHA-256 或大小校验失败，未执行更新。': 'The update package failed SHA-256 or size verification. The update was not applied.',
  '更新包的名称、版本或插件声明不匹配。': 'The update package name, version or plugin declaration does not match.',
  '更新包中的作者说明与本次检查结果不一致，请重新检查更新。': 'The update package release notes do not match the checked version. Check for updates again.',
  '维护包包含安装脚本，请通过 Harness 插件管理器人工检查。': 'The update package contains installation scripts. Review it in the Harness plugin manager.',
  'npm 更新包必须属于本项目且不含运行依赖。': 'The npm update package must belong to this project and contain no runtime dependencies.',
  '更新包准备结果无效，未请求安装。': 'The prepared update is invalid. Installation was not requested.',
  '更新包路径与已校验的名称、版本或 SHA-256 不一致，未请求安装。': 'The update path does not match the verified name, version or SHA-256. Installation was not requested.',
  '更新包路径或版本无效，未请求安装。': 'The update path or version is invalid. Installation was not requested.',
  '当前连接没有管理插件的权限，请使用 Harness 主窗口的拥有者连接。': 'This connection cannot manage plugins. Use the owner connection in the main Harness window.',
  'Harness 未接受更新请求，请在插件管理中查看详情。': 'Harness did not accept the update request. See the plugin manager for details.',
  '更新未完成，请在插件管理中查看详情。': 'The update did not complete. See the plugin manager for details.',
  'Harness 返回的版本与更新目标不一致，请查看插件管理。': 'The version returned by Harness does not match the update target. Check the plugin manager.',
  '更新响应超时。请在插件管理中核对实际版本后重试。': 'The update response timed out. Check the installed version in the plugin manager before retrying.',
  '更新版本无效或尚未公开，请重新检查更新。': 'The update version is invalid or not public yet. Check for updates again.',
  '更新已取消：插件已停用或卸载，未请求安装。': 'The update was canceled because the plugin was disabled or uninstalled. Installation was not requested.',
  '暂时无法恢复默认，请稍后重试。': 'Could not restore defaults. Please try again later.',
  '恢复默认未完成，请稍后重试。': 'Restoring defaults did not complete. Please try again later.',
  '暂时无法检查更新，请稍后重试。': 'Could not check for updates. Please try again later.',
  '更新未完成，请稍后重试。': 'The update did not complete. Please try again later.',
  '发布前请先询问作者并填写本版本给用户展示的更新说明。': 'Ask the author for this version’s release notes before publishing.',
  '更新说明须包含且仅包含 version 和 notes。': 'Release notes must contain only version and notes.',
  '作者更新说明的版本必须与实际安装包版本完全一致。': 'The release notes version must match the package version exactly.',
  '作者更新说明须为 1 到 2000 字的纯文本，不接受控制字符。': 'Release notes must contain 1 to 2000 plain-text characters without control characters.',
  '安装包元数据不存在，无法核对作者更新说明。': 'Package metadata is unavailable. Release notes could not be verified.',
});

function englishMessage(text) {
  if (Object.hasOwn(MESSAGES, text)) return MESSAGES[text];
  let match;
  if ((match = /^不支持的设置：(.+)$/.exec(text))) return `Unsupported setting: ${match[1]}`;
  if ((match = /^(.+) 必须是开关。$/.exec(text))) return `${match[1]} must be a boolean.`;
  if ((match = /^(图片|视频)不能超过 (\d+) MB。$/.exec(text))) return `${match[1] === '图片' ? 'Images' : 'Videos'} cannot exceed ${match[2]} MB.`;
  if ((match = /^默认设置已恢复，但自定义文件尚未全部清理。请再次恢复默认重试(?:（(.+)）)?。$/.exec(text))) return `Default settings were restored, but some custom files remain. Restore defaults again${match[1] ? ` (${match[1]})` : ''}.`;
  if ((match = /^暂时无法检查更新：([\s\S]+)$/.exec(text))) return `Could not check for updates: ${englishMessage(match[1])}`;
  if ((match = /^npm 注册表返回 HTTP (\d+)。$/.exec(text))) return `The npm registry returned HTTP ${match[1]}.`;
  if ((match = /^维护服务返回 HTTP (\d+)。$/.exec(text))) return `The update service returned HTTP ${match[1]}.`;
  if ((match = /^(npm )?更新包下载失败（HTTP (\d+)）。$/.exec(text))) return `${match[1] ? 'The npm update package' : 'The update package'} download failed (HTTP ${match[2]}).`;
  if ((match = /^Harness 更新请求失败（HTTP (\d+)）。$/.exec(text))) return `The Harness update request failed (HTTP ${match[1]}).`;
  if ((match = /^请求失败 \((\d+)\)$/.exec(text))) return `Request failed (${match[1]})`;
  if ((match = /^连接失败：([\s\S]+)。请重启 Harness 后重试。$/.exec(text))) return `Connection failed: ${englishMessage(match[1])}. Restart Harness and try again.`;
  return text;
}

/** Localize operational diagnostics; never pass author-written release notes here. */
export function localizeMessage(value) {
  const text = value instanceof Error ? value.message : String(value ?? '');
  return readHostLocale() === 'en' ? englishMessage(text) : text;
}
