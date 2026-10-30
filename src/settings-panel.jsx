import React, { useState, useEffect, useRef } from 'react';
import { useStudioStyles as useStyles } from './studio-styles.jsx';
import { UpdatePanel } from './update-panel.jsx';
import { ResetDialog } from './reset-dialog.jsx';
import { AuthorDialog } from './author-dialog.jsx';
import { useEnchantAppearance } from './enchant-theme.jsx';
import { useI18n, localizeMessage } from './i18n.jsx';
import { api } from './api-client.js';
import { createMediaUpload } from './media-upload.js';
import { VideoLibrary, EndingSettings } from './settings-sections.jsx';
import { EndTitle, playbackStages } from './player.jsx';
import { latestState, subscribers, publish, preview, VERSION } from './studio-state.js';

function Toggle({ label, description, checked, onChange, disabled }) {
  return (
    <label className="bs-toggle-row">
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className="bs-switch" aria-hidden="true" />
    </label>
  );
}
export function SettingsPanel({ standalone = false, updateTools }) {
  const t = useI18n();
  useStyles();
  const appearance = useEnchantAppearance();
  const [state, setState] = useState(latestState);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pendingImageDelete, setPendingImageDelete] = useState(null);
  const [resetOpened, setResetOpened] = useState(false);
  const [authorOpened, setAuthorOpened] = useState(false);
  const input = useRef(null);
  const imageInput = useRef(null);
  const active = useRef(true);
  const activeUpload = useRef(null);
  useEffect(() => {
    active.current = true;
    const update = (v) => setState(v);
    subscribers.add(update);
    api('/state')
      .then(publish)
      .catch((error) => {
        if (active.current) setError(error);
      });
    return () => {
      active.current = false;
      subscribers.delete(update);
      activeUpload.current?.cancel();
    };
  }, []);
  async function save(patch) {
    if (busy) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      publish(await api('/settings', { method: 'POST', body: JSON.stringify(patch) }));
      setNotice('设置已保存，下次启动生效');
    } catch (e) {
      setError(e);
    } finally {
      if (active.current) setBusy(false);
    }
  }
  async function restoreDefaults() {
    if (busy) throw Error('请等待当前操作完成后再恢复默认。');
    setBusy(true);
    setError('');
    setNotice('');
    try {
      publish(
        await api('/reset', {
          method: 'POST',
          body: JSON.stringify({ confirm: 'reset-all-custom-data' }),
        }),
      );
      setNotice('已恢复默认，全部上传的视频和图片已删除。');
    } catch (error) {
      // Cleanup can report a disk error after preferences were safely reset.
      // Refresh the visible state without hiding that error or claiming success.
      await api('/state')
        .then(publish)
        .catch(() => {});
      throw error;
    } finally {
      if (active.current) setBusy(false);
    }
  }
  async function remove(clip) {
    setBusy(true);
    setError('');
    try {
      publish(await api('/clips/' + encodeURIComponent(clip.id), { method: 'DELETE' }));
      setNotice('视频已移除');
      setPendingDelete(null);
    } catch (e) {
      setError(e);
    } finally {
      if (active.current) setBusy(false);
    }
  }
  async function removeEndImage(image) {
    setBusy(true);
    setError('');
    try {
      publish(await api('/end-images/' + encodeURIComponent(image.id), { method: 'DELETE' }));
      setNotice('结束画面已移除');
      setPendingImageDelete(null);
    } catch (e) {
      setError(e);
    } finally {
      if (active.current) setBusy(false);
    }
  }
  function importMedia(file, kind) {
    if (!file || busy || activeUpload.current) return;
    setBusy(true);
    setError('');
    setNotice('');
    const image = kind === 'image';
    const task = createMediaUpload(file, {
      kind,
      maxBytes: image ? state?.maxImageUploadBytes : state?.maxUploadBytes,
      onPhase: (phase) => {
        if (active.current)
          setNotice(
            phase === 'probe'
              ? image
                ? '正在检查结束画面…'
                : '正在检查视频…'
              : image
                ? '正在上传图片…'
                : '正在上传…',
          );
      },
      onProgress: (percent) => {
        if (active.current) setUploadPercent(percent);
      },
    });
    activeUpload.current = task;
    task.promise
      .then((result) => {
        if (!active.current) return;
        publish(result.state);
        setNotice(image ? '图片已上传并设为结束画面' : '视频已导入并设为开机动画');
      })
      .catch((error) => {
        if (active.current) {
          setError(error);
          setNotice('');
        }
      })
      .finally(() => {
        if (activeUpload.current === task) activeUpload.current = null;
        if (active.current) {
          setBusy(false);
          setUploadPercent(null);
        }
      });
  }
  const uploadEndImage = (file) => importMedia(file, 'image');
  const upload = (file) => importMedia(file, 'video');

  const settings = state?.settings;
  const selected = state?.clips.find((c) => c.id === settings.selectedId) || state?.clips[0];
  const stages = playbackStages(settings);
  return (
    <section className="bs-studio" data-testid="settings" {...appearance}>
      <div className="bs-heading">
        <div>
          <div className="bs-eyebrow">DSH LEWIS ENCHANTMENT</div>
          <h1>
            {t('附魔台', 'Enchantment')}
            <span>{t('开机动画', 'Startup animation')}</span>
          </h1>
          <p>{t('自定义你的开场，封面与声音。', 'Customize your intro, cover and sound.')}</p>
        </div>
        {VERSION && <span className="bs-version">V{VERSION}</span>}
      </div>
      <div className="bs-preferences bs-animation-settings">
        <div className="bs-toolbar">
          <h2>{t('动画片库', 'Animation library')}</h2>
          <button
            className="bs-primary"
            type="button"
            disabled={busy || !selected}
            onClick={() =>
              preview(selected, {
                ...settings,
                enabled: true,
                videoEnabled: true,
                endEnabled: true,
              })
            }
          >
            {t('▶ 预览当前开场', '▶ Preview current intro')}
          </button>
        </div>
        <div className="bs-animation-content">
          {error && (
            <div className="bs-alert" role="alert">
              {localizeMessage(error)}
              <button
                type="button"
                onClick={() => {
                  setError('');
                  api('/state')
                    .then(publish)
                    .catch((e) => setError(e));
                }}
              >
                {t('重试', 'Retry')}
              </button>
            </div>
          )}
          <div className="bs-notice" role="status" aria-live="polite">
            {busy
              ? uploadPercent !== null
                ? t(`正在上传 ${uploadPercent}%`, `Uploading ${uploadPercent}%`)
                : localizeMessage(notice) || t('正在保存…', 'Saving…')
              : localizeMessage(notice)}
          </div>
          {settings && (
            <>
              <VideoLibrary
                state={state}
                settings={settings}
                busy={busy}
                preview={preview}
                save={save}
                remove={remove}
                pendingDelete={pendingDelete}
                setPendingDelete={setPendingDelete}
                input={input}
                upload={upload}
              />
            </>
          )}
          {!state && !error && (
            <div className="bs-loading">{t('正在加载片库…', 'Loading library…')}</div>
          )}
        </div>
      </div>
      {settings && (
        <>
          <EndingSettings
            state={state}
            settings={settings}
            busy={busy}
            preview={preview}
            save={save}
            imageInput={imageInput}
            uploadEndImage={uploadEndImage}
            removeEndImage={removeEndImage}
            pendingImageDelete={pendingImageDelete}
            setPendingImageDelete={setPendingImageDelete}
            EndTitleComponent={EndTitle}
          />
          <div className="bs-section-title">
            <h2>{t('播放偏好', 'Playback preferences')}</h2>
          </div>
          <div className="bs-preferences">
            <Toggle
              label={t('开机动画', 'Startup animation')}
              checked={stages.video}
              disabled={busy}
              onChange={(videoEnabled) => save({ videoEnabled })}
            />
            <Toggle
              label={t('结束停留画面', 'Ending screen')}
              checked={stages.end}
              disabled={busy}
              onChange={(endEnabled) => save({ endEnabled })}
            />
            <Toggle
              label={t('播放声音', 'Play sound')}
              checked={settings.sound}
              disabled={busy}
              onChange={(sound) => save({ sound })}
            />
            <Toggle
              label={t('随机开场', 'Shuffle intros')}
              checked={settings.shuffle}
              disabled={busy}
              onChange={(shuffle) => save({ shuffle })}
            />
          </div>
          <UpdatePanel request={api} standalone={standalone} {...updateTools} />
          <div className="bs-section-title bs-entry-title">
            <h2>{t('进入方式', 'Quick access')}</h2>
          </div>
          <div className="bs-preferences">
            <Toggle
              label={t('显示侧栏快捷入口', 'Show sidebar shortcut')}
              description={t(
                '在头像上方显示“开机动画”；关闭后仍可从设置进入。附魔台系列最多显示17个快捷入口。',
                'Show Startup animation above your avatar. You can always open it from Settings. The Enchantment series supports up to 17 shortcuts.',
              )}
              checked={settings.showShortcut ?? false}
              disabled={busy}
              onChange={(showShortcut) => save({ showShortcut })}
            />
          </div>
          <div className="bs-reset-area">
            <div>
              <strong>{t('恢复默认', 'Restore defaults')}</strong>
              <p>
                {t(
                  '重置所有设置，永久删除全部上传的视频和图片，仅保留内置素材。',
                  'Reset all settings and permanently delete all uploaded videos and images. Built-in media will be kept.',
                )}
              </p>
            </div>
            <button
              className="bs-reset-open"
              type="button"
              disabled={busy}
              onClick={() => setResetOpened(true)}
            >
              {t('恢复默认', 'Restore defaults')}
            </button>
          </div>
          {resetOpened && (
            <ResetDialog
              settings={settings}
              onCancel={() => setResetOpened(false)}
              onConfirm={restoreDefaults}
            />
          )}
          <div className="bs-author-entry">
            <span>{t('点击了解更多作者信息', 'Learn more about the author')}</span>
            <button
              type="button"
              aria-label={t('查看作者信息', 'View author information')}
              onClick={() => setAuthorOpened(true)}
            >
              {t('查看', 'View')}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
          {authorOpened && (
            <AuthorDialog settings={settings} onClose={() => setAuthorOpened(false)} />
          )}
        </>
      )}
    </section>
  );
}
