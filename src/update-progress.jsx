import React from 'react';
import { useI18n } from './i18n.jsx';

const mib = value => `${(Math.max(0, Number(value) || 0) / 1048576).toFixed(1)} MB`;

/** A byte percentage belongs to the download, never to an unmeasured install. */
export function UpdateProgress({ progress = {}, completed = false }) {
  const t = useI18n();
  const phase = completed ? 'complete' : progress.phase;
  const downloading = phase === 'downloading';
  const measured = downloading && Number.isFinite(progress.totalBytes) && progress.totalBytes > 0;
  const percent = completed ? 100 : measured ? Math.min(99, Math.max(0, Math.floor(progress.downloadedBytes / progress.totalBytes * 100))) : null;
  const label = completed ? t('更新完成', 'Update complete') : phase === 'install' ? t('正在应用更新', 'Applying update') : phase === 'verifying' || phase === 'ready' ? t('正在校验更新包', 'Verifying update package') : downloading ? t('正在下载更新包', 'Downloading update package') : t('正在准备更新', 'Preparing update');
  return <div className="bs-update-progress" data-testid="update-progress" data-phase={phase || 'prepare'}>
    <div className="bs-update-progress-heading"><span>{label}</span>{percent !== null && <strong>{percent}%</strong>}</div>
    <progress aria-label={completed ? t('更新完成', 'Update complete') : downloading ? t('更新包下载进度', 'Update package download progress') : label} max="100" {...(percent !== null ? { value: percent } : {})}/>
    <div className="bs-update-progress-detail">{completed ? t('视频、图片和设置已保留', 'Videos, images and settings have been kept') : downloading ? `${mib(progress.downloadedBytes)}${measured ? ` / ${mib(progress.totalBytes)}` : t(' · 正在接收', ' · Receiving')}` : phase === 'install' ? t('正在通过 Harness 安全应用更新，请稍候。', 'Applying the update through Harness. Please wait.') : phase === 'verifying' || phase === 'ready' ? t('下载已完成，正在检查安装包的完整性。', 'Download complete. Checking package integrity.') : t('正在连接更新服务，请稍候。', 'Connecting to the update service. Please wait.')}</div>
  </div>;
}
