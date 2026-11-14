import React from 'react';
import { useI18n } from './i18n.jsx';

const mb = (value) => `${(value / 1000000).toFixed(2)} MB`;

/** A byte percentage belongs to the download, never to an unmeasured install. */
export function UpdateProgress({ progress = {}, completed = false }) {
  const t = useI18n();
  const phase = completed ? 'complete' : progress.phase;
  const downloading = phase === 'downloading';
  const hasTotal = Number.isFinite(progress.totalBytes) && progress.totalBytes > 0;
  const downloadedBytes =
    Number.isFinite(progress.downloadedBytes) && progress.downloadedBytes >= 0
      ? progress.downloadedBytes
      : 0;
  const measured = downloading && hasTotal;
  const fromCache = progress.fromCache === true;
  const percent = completed
    ? 100
    : measured
      ? Math.min(99, Math.max(0, Math.floor((downloadedBytes / progress.totalBytes) * 100)))
      : null;
  const label = completed
    ? t('更新完成', 'Update complete')
    : phase === 'install'
      ? t('正在应用更新', 'Applying update')
      : phase === 'verifying'
        ? fromCache
          ? t('正在校验缓存', 'Verifying cached update')
          : t('正在校验更新包', 'Verifying update package')
        : phase === 'ready'
          ? t('更新包已就绪', 'Update package ready')
          : downloading
            ? t('正在下载更新包', 'Downloading update package')
            : t('正在准备更新', 'Preparing update');
  let detail;
  if (completed) detail = t('视频、图片和设置已保留', 'Videos, images and settings have been kept');
  else if (downloading)
    detail = `${mb(downloadedBytes)}${hasTotal ? ` / ${mb(progress.totalBytes)}` : t(' · 正在接收', ' · Receiving')}`;
  else if (phase === 'verifying')
    detail = fromCache
      ? t('正在检查缓存更新包的完整性。', 'Checking cached package integrity.')
      : t('下载已完成，正在检查安装包的完整性。', 'Download complete. Checking package integrity.');
  else if (phase === 'ready' || phase === 'install') {
    detail = fromCache
      ? t(
          '复用已校验更新包，无需重复下载。',
          'Reusing the verified update package. No download needed.',
        )
      : phase === 'ready'
        ? t('更新包校验完成，正在准备安装。', 'Package verified. Preparing to install.')
        : '';
    if (phase === 'install')
      detail += `${detail ? ' ' : ''}${t(
        '正在通过 Harness 安全应用更新，请稍候。',
        'Applying the update through Harness. Please wait.',
      )}`;
  } else detail = t('正在连接更新服务，请稍候。', 'Connecting to the update service. Please wait.');
  if (!completed && !downloading && hasTotal) detail = `${mb(progress.totalBytes)} · ${detail}`;
  const byteDetail = completed
    ? undefined
    : downloading
      ? `${downloadedBytes}${hasTotal ? ` / ${progress.totalBytes}` : ''}`
      : hasTotal
        ? String(progress.totalBytes)
        : undefined;
  return (
    <div
      className="bs-update-progress"
      data-testid="update-progress"
      data-phase={phase || 'prepare'}
    >
      <div className="bs-update-progress-heading">
        <span>{label}</span>
        {percent !== null && <strong>{percent}%</strong>}
      </div>
      <progress
        aria-label={
          completed
            ? t('更新完成', 'Update complete')
            : downloading
              ? t('更新包下载进度', 'Update package download progress')
              : label
        }
        max="100"
        {...(percent !== null ? { value: percent } : {})}
      />
      <div
        className="bs-update-progress-detail"
        title={byteDetail === undefined ? undefined : `${byteDetail} ${t('字节', 'bytes')}`}
      >
        {detail}
      </div>
    </div>
  );
}
