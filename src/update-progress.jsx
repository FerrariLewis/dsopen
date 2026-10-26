import React from 'react';

const mib = value => `${(Math.max(0, Number(value) || 0) / 1048576).toFixed(1)} MB`;

/** A byte percentage belongs to the download, never to an unmeasured install. */
export function UpdateProgress({ progress = {}, completed = false }) {
  const phase = completed ? 'complete' : progress.phase;
  const downloading = phase === 'downloading';
  const measured = downloading && Number.isFinite(progress.totalBytes) && progress.totalBytes > 0;
  const percent = completed ? 100 : measured ? Math.min(99, Math.max(0, Math.floor(progress.downloadedBytes / progress.totalBytes * 100))) : null;
  const label = completed ? '更新完成' : phase === 'install' ? '正在应用更新' : phase === 'verifying' || phase === 'ready' ? '正在校验更新包' : downloading ? '正在下载更新包' : '正在准备更新';
  return <div className="bs-update-progress" data-testid="update-progress" data-phase={phase || 'prepare'}>
    <div className="bs-update-progress-heading"><span>{label}</span>{percent !== null && <strong>{percent}%</strong>}</div>
    <progress aria-label={completed ? '更新完成' : downloading ? '更新包下载进度' : label} max="100" {...(percent !== null ? { value: percent } : {})}/>
    <div className="bs-update-progress-detail">{completed ? '视频、图片和设置已保留' : downloading ? `${mib(progress.downloadedBytes)}${measured ? ` / ${mib(progress.totalBytes)}` : ' · 正在接收'}` : phase === 'install' ? '正在通过 Harness 安全应用更新，请稍候。' : phase === 'verifying' || phase === 'ready' ? '下载已完成，正在检查安装包的完整性。' : '正在连接更新服务，请稍候。'}</div>
  </div>;
}
