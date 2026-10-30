import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  appliedUpdate,
  isAvailableUpdate,
  prepareAndInstallUpdate,
  canOpenHarnessPluginManager,
  openHarnessPluginManager,
} from './startup-update.js';
import { useEnchantAppearance } from './enchant-theme.jsx';
import { useStudioStyles } from './studio-styles.jsx';
import { CloseIcon } from './close-icon.jsx';
import { UpdateProgress } from './update-progress.jsx';
import { useI18n, localizeMessage } from './i18n.jsx';

export function UpdatePrompt({
  request,
  status = {},
  onDismiss,
  onUpdated,
  preview = false,
  kind = 'update',
  checkError,
  install,
}) {
  const t = useI18n();
  useStudioStyles();
  const appearance = useEnchantAppearance();
  const dialog = useRef(null);
  const mounted = useRef(true);
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({
    phase: 'prepare',
    downloadedBytes: 0,
    totalBytes: null,
  });
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(() =>
    kind === 'update' ? appliedUpdate(status) : null,
  );
  const close = useCallback(() => {
    if (lock.current) return;
    if (completed && !preview) onUpdated?.(completed.version, completed.result);
    onDismiss?.();
  }, [completed, onDismiss, onUpdated, preview]);
  useEffect(() => {
    mounted.current = true;
    const element = dialog.current;
    const previous = document.activeElement;
    if (typeof element.showModal === 'function') {
      if (!element.open) element.showModal();
    } else element.setAttribute('open', '');
    return () => {
      mounted.current = false;
      if (element.open && typeof element.close === 'function') element.close();
      if (previous?.isConnected) previous.focus?.();
    };
  }, []);
  async function accept() {
    if (preview || lock.current || completed || error?.uncertain || !isAvailableUpdate(status))
      return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      const value = await prepareAndInstallUpdate(request, status, {
        install,
        onProgress: (value) => {
          if (mounted.current) setProgress(value);
        },
      });
      if (mounted.current) setCompleted(value);
    } catch (reason) {
      if (mounted.current) setError(reason || '更新未完成，请稍后重试。');
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  const checkingFailed = kind === 'error';
  const current = kind === 'current';
  const sourceNotes =
    typeof status.manifest?.releaseNotes === 'string' ? status.manifest.releaseNotes : '';
  const englishNotes =
    typeof status.manifest?.releaseNotesEn === 'string' && status.manifest.releaseNotesEn.trim()
      ? status.manifest.releaseNotesEn
      : sourceNotes;
  // Select the complete authored/translated text at render time so language
  // changes update an open prompt without altering either text or its newlines.
  const releaseNotes = t(sourceNotes, englishNotes);
  const title = current
    ? t('已经是最新版本', 'You are up to date')
    : checkingFailed
      ? t('暂时无法检查更新。', 'Unable to check for updates.')
      : completed
        ? t('新的开场，已准备就绪。', 'Your new opening is ready.')
        : t('准备好新的开场', 'A new opening awaits');
  const description = current
    ? t('你的开机动画已是最新，快去体验吧', 'Your startup animation is up to date. Enjoy!')
    : checkingFailed
      ? localizeMessage(
          checkError ||
            (status.message
              ? status
              : t(
                  '请检查网络连接，稍后再试。',
                  'Check your network connection and try again later.',
                )),
        )
      : preview
        ? t(
            '这里只预览弹窗外观，不会下载或安装更新。',
            'This preview only shows the dialog. No updates will be downloaded or installed.',
          )
        : completed
          ? t(
              '更新已完成，请完全退出并重新打开 Harness，以应用新版本。',
              'Update complete. Fully quit and reopen Harness to apply the new version.',
            )
          : t(
              '发现开机动画的新版本，为下一次启动添一点新意',
              'A new startup animation version is available for your next launch.',
            );
  return (
    <dialog
      ref={dialog}
      className="bs-startup-update"
      data-testid="startup-update"
      data-kind={kind}
      data-preview={preview || undefined}
      {...appearance}
      aria-labelledby="bs-startup-update-title"
      aria-describedby="bs-startup-update-description"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className="bs-startup-update-card">
        <button
          className="bs-startup-update-close"
          type="button"
          aria-label={t('关闭更新提示', 'Close update notification')}
          disabled={busy}
          onClick={close}
        >
          <CloseIcon />
        </button>
        <div className="bs-startup-update-glyph" aria-hidden="true">
          {current ? '✓' : checkingFailed ? '!' : '✧'}
        </div>
        <p className="bs-startup-update-brand">
          DSH LEWIS ENCHANTMENT
          {preview && <span>{t(' · 更新提醒外观预览', ' · Update notification preview')}</span>}
        </p>
        <h2 id="bs-startup-update-title">{title}</h2>
        <p id="bs-startup-update-description" className="bs-startup-update-copy">
          {description}
        </p>
        {current ? (
          <div className="bs-startup-update-versions">
            <strong>
              {status.currentVersion
                ? `v${status.currentVersion}`
                : t('版本信息暂不可用', 'Version unavailable')}
            </strong>
            <span>{t('当前版本', 'Current version')}</span>
          </div>
        ) : (
          !checkingFailed && (
            <div className="bs-startup-update-versions">
              <span>
                {status.currentVersion
                  ? `v${status.currentVersion}`
                  : t('当前版本', 'Current version')}
              </span>
              <span aria-hidden="true">→</span>
              <strong>
                {status.latestVersion
                  ? `v${status.latestVersion}`
                  : preview
                    ? t('后续版本', 'Future version')
                    : t('新版本', 'New version')}
              </strong>
            </div>
          )
        )}
        {!checkingFailed && !current && !busy && !completed && (
          <div className="bs-release-notes" aria-label={t('本次更新', 'What’s new')}>
            <h3>{t('本次更新', 'What’s new')}</h3>
            {releaseNotes.trim() ? (
              <p>{releaseNotes}</p>
            ) : (
              <p className="bs-release-notes-empty">
                {preview
                  ? t(
                      '更新说明待作者填写（仅本地预览）',
                      'Awaiting the author’s release notes (local preview only)',
                    )
                  : t('此版本未提供更新说明。', 'No release notes were provided for this version.')}
              </p>
            )}
          </div>
        )}
        {!checkingFailed && !current && !completed && (
          <p className="bs-startup-update-restart">
            {t(
              '更新完成后，请完全退出并重新打开 Harness，以应用新版本。',
              'After updating, fully quit and reopen Harness to apply the new version.',
            )}
          </p>
        )}
        {!checkingFailed && !current && !completed && (
          <p className="bs-startup-update-retain">
            {t('你的视频、图片和设置都会保留', 'Your videos, images and settings will be kept')}
          </p>
        )}
        {(busy || completed) && <UpdateProgress progress={progress} completed={!!completed} />}
        {error && (
          <p className="bs-startup-update-error" role="alert">
            {localizeMessage(error)}
          </p>
        )}
        {error?.code?.startsWith('BOOT_HARNESS_INSTALL') && canOpenHarnessPluginManager() && (
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              if (openHarnessPluginManager(status.packageName)) onDismiss?.();
            }}
          >
            {t('打开插件管理', 'Open plugin manager')}
          </button>
        )}
        <div className="bs-startup-update-actions">
          {current || checkingFailed ? (
            <button className="bs-startup-update-primary" type="button" onClick={close}>
              {t('知道了', 'Got it')}
            </button>
          ) : preview ? (
            <button className="bs-startup-update-primary" type="button" onClick={close}>
              {t('关闭预览', 'Close preview')}
            </button>
          ) : completed ? (
            <button
              className="bs-startup-update-primary"
              type="button"
              disabled={busy}
              onClick={close}
            >
              {t('知道了', 'Got it')}
            </button>
          ) : (
            <>
              <button type="button" disabled={busy} onClick={close}>
                {t('稍后再说', 'Later')}
              </button>
              {!error?.uncertain && (
                <button
                  className="bs-startup-update-primary"
                  type="button"
                  disabled={busy}
                  onClick={accept}
                >
                  {busy
                    ? t('正在更新…', 'Updating…')
                    : error
                      ? t('重试更新', 'Retry update')
                      : t(`更新到 ${status.latestVersion}`, `Update to ${status.latestVersion}`)}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
