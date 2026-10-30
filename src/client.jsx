import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStudioStyles as useStyles } from './studio-styles.jsx';
import { WHALE_PATH } from './logo-path.js';
import { StartupSequence } from './startup-screen.jsx';
import { UpdatePanel } from './update-panel.jsx';
import { UpdatePrompt } from './update-prompt.jsx';
import {
  startupUpdateSession,
  isAvailableUpdate,
  cancelPendingUpdates,
  bindHarnessServices,
} from './startup-update.js';
import { getShortcutRegistry } from './shortcut-registry.js';
import { ResetDialog } from './reset-dialog.jsx';
import { AuthorDialog } from './author-dialog.jsx';
import { useEnchantAppearance } from './enchant-theme.jsx';
import { getEnchantRegistry, bindSettingsEntry } from './enchant-bridge.js';
import { useI18n, translate, localizeMessage, localizedName } from './i18n.jsx';
import { bindHostLocale, subscribeHostLocale } from './host-locale.js';
import { BASE_PATH as BASE, CORE_PACKAGE_NAME, NPM_ENTRY_NAME } from './constants.js';
import { api } from './api-client.js';
import { createMediaUpload } from './media-upload.js';
import { handlePlayerKey } from './player-input.js';
import { VideoLibrary, EndingSettings } from './settings-sections.jsx';
export { api } from './api-client.js';

const OPEN = `${CORE_PACKAGE_NAME}:open`;
const PLAY = `${CORE_PACKAGE_NAME}:play`;
let bootClaimed = false;
let launchRequest = null;
let launchDecisionSettled = false;
let latestState = null;
const subscribers = new Set();
const playerWindows = new WeakMap();
const VERSION = typeof __DSH_LEWIS_VERSION__ === 'string' ? __DSH_LEWIS_VERSION__ : null;

// A marker for Harness's optional HTML menu only. Native caption buttons are
// owned by the desktop host; this lease never changes the native window state.
function acquirePlayerWindow(doc) {
  const root = doc.documentElement;
  let state = playerWindows.get(doc);
  if (!state) {
    state = { count: 0, previous: root.getAttribute('data-lewis-player') };
    playerWindows.set(doc, state);
  }
  state.count++;
  root.setAttribute('data-lewis-player', 'true');
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--state.count) return;
    if (state.previous === null) root.removeAttribute('data-lewis-player');
    else root.setAttribute('data-lewis-player', state.previous);
    playerWindows.delete(doc);
  };
}

function publish(value) {
  latestState = value;
  subscribers.forEach((fn) => fn(value));
  return value;
}
export function openSettings() {
  if (getEnchantRegistry().openControllerSettings(NPM_ENTRY_NAME)) return;
  window.dispatchEvent(new Event(OPEN));
}
function preview(clip, settings, endOnly = false, clipOnly = false) {
  window.dispatchEvent(new CustomEvent(PLAY, { detail: { clip, settings, endOnly, clipOnly } }));
}
export function playbackStages(settings = {}, { endOnly = false, clipOnly = false } = {}) {
  if (endOnly) return { video: false, end: true };
  if (clipOnly) return { video: true, end: false };
  const legacy = settings.enabled !== false;
  return {
    video: typeof settings.videoEnabled === 'boolean' ? settings.videoEnabled : legacy,
    end: typeof settings.endEnabled === 'boolean' ? settings.endEnabled : legacy,
  };
}
export function EndTitle({ settings }) {
  const t = useI18n();
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(
    () => setImageFailed(false),
    [settings.endImageId, settings.logoVariant, settings.endScreen],
  );
  const variant = settings.logoVariant || 'silver';
  const userImage = settings.endScreen === 'image' && settings.endImageId && !imageFailed;
  const builtinImage = settings.endScreen !== 'image' && variant !== 'classic' && !imageFailed;
  const imageURL = userImage
    ? `${BASE}/end-image/${encodeURIComponent(settings.endImageId)}`
    : builtinImage
      ? `${BASE}/logo/${encodeURIComponent(variant)}`
      : null;
  return (
    <div
      className={`bs-end-title bs-end-${userImage ? 'custom' : variant}`}
      data-testid="end-screen"
      data-logo={builtinImage ? variant : undefined}
    >
      {imageURL ? (
        <img
          className="bs-end-image"
          data-testid={userImage ? 'end-image' : 'end-logo-image'}
          src={imageURL}
          alt={
            userImage
              ? t('自定义结束画面', 'Custom ending screen')
              : t('DeepSeek 内置结束画面', 'DeepSeek built-in ending screen')
          }
          style={{ objectFit: userImage ? settings.endFit || 'cover' : 'cover' }}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="bs-end-brand">
          <div className="bs-end-halo" />
          <svg
            className="bs-end-whale"
            viewBox="0 0 50 50"
            aria-label={t('DeepSeek 标志', 'DeepSeek logo')}
            role="img"
          >
            <path d={WHALE_PATH} />
          </svg>
          <h1>DEEPSEEK</h1>
          <p>HARNESS</p>
          <div className="bs-end-rule" />
        </div>
      )}
      <p className="bs-enter-prompt">
        {t('点击进入 DeepSeek Harness', 'Click to enter DeepSeek Harness')}
      </p>
    </div>
  );
}

export function Player({ clip, settings = {}, onClose, endOnly = false, clipOnly = false }) {
  const t = useI18n();
  useStyles();
  const appearance = useEnchantAppearance();
  const video = useRef(null);
  const dialog = useRef(null);
  const closed = useRef(false);
  const stages = playbackStages(settings, { endOnly, clipOnly });
  const initialPhase = stages.video ? 'intro' : stages.end ? 'end' : 'idle';
  const [phase, setPhase] = useState(initialPhase);
  const phaseRef = useRef(initialPhase);
  const lastInput = useRef(-1000);
  const [blocked, setBlocked] = useState(false);
  const [mutedFallback, setMutedFallback] = useState(false);
  const stopMedia = useCallback(() => {
    const el = video.current;
    if (el) {
      el.pause();
      el.removeAttribute('src');
      el.load();
    }
  }, []);
  const close = useCallback(
    (reason) => {
      if (closed.current) return;
      closed.current = true;
      stopMedia();
      onClose(reason);
    },
    [onClose, stopMedia],
  );
  const showEnd = useCallback(() => {
    if (closed.current || phaseRef.current === 'end') return;
    if (!stages.end) {
      close('complete');
      return;
    }
    phaseRef.current = 'end';
    stopMedia();
    setPhase('end');
  }, [stopMedia, close, stages.end]);
  const advance = useCallback(() => {
    const now = performance.now();
    if (now - lastInput.current < 250) return;
    lastInput.current = now;
    if (phaseRef.current === 'intro') showEnd();
    else close('enter');
  }, [showEnd, close]);
  useEffect(() => {
    closed.current = false;
    if (phaseRef.current === 'idle') {
      close('disabled');
      return;
    }
    const playerDialog = dialog.current;
    const previous = document.activeElement;
    const releaseWindow = acquirePlayerWindow(document);
    if (typeof playerDialog.showModal === 'function' && !playerDialog.open)
      playerDialog.showModal();
    else playerDialog.setAttribute('open', '');
    const key = (event) => handlePlayerKey(event, advance);
    window.addEventListener('keydown', key, true);
    playerDialog.focus();
    return () => {
      closed.current = true;
      releaseWindow();
      window.removeEventListener('keydown', key, true);
      if (playerDialog.open && typeof playerDialog.close === 'function') playerDialog.close();
      if (previous?.isConnected) previous.focus?.();
    };
  }, [advance, close]);
  useEffect(() => {
    if (phase !== 'intro') return;
    if (clip.kind === 'sequence') {
      const timeout = setTimeout(showEnd, 120000);
      return () => clearTimeout(timeout);
    }
    const playerVideo = video.current;
    if (!playerVideo) return;
    let progressAt = performance.now();
    let previousTime = playerVideo.currentTime;
    const watchdog = setInterval(() => {
      if (playerVideo.currentTime !== previousTime) {
        previousTime = playerVideo.currentTime;
        progressAt = performance.now();
      }
      if (performance.now() - progressAt > 30000) showEnd();
    }, 1000);
    return () => {
      clearInterval(watchdog);
      playerVideo.pause();
      playerVideo.removeAttribute('src');
      playerVideo.load();
    };
  }, [phase, clip?.kind, showEnd]);
  useEffect(() => {
    if (phase !== 'intro' || clip.kind === 'sequence') return;
    const el = video.current;
    let alive = true;
    el.volume = settings.volume ?? 0.7;
    el.muted = !settings.sound;
    const start = async () => {
      try {
        await el.play();
        if (!alive || closed.current) el.pause();
      } catch (error) {
        if (!alive || closed.current) return;
        if (settings.sound && !el.muted) {
          el.muted = true;
          setMutedFallback(true);
          try {
            await el.play();
            if (!alive || closed.current) el.pause();
          } catch {
            if (alive && !closed.current) setBlocked(true);
          }
        } else setBlocked(true);
      }
    };
    void start();
    return () => {
      alive = false;
    };
  }, [clip?.url, clip?.kind, phase, settings.sound, settings.volume, showEnd]);
  const enableSound = async (e) => {
    e.stopPropagation();
    const el = video.current;
    el.muted = false;
    try {
      await el.play();
      setMutedFallback(false);
      setBlocked(false);
    } catch {
      el.muted = true;
      setBlocked(true);
    }
  };
  const playManually = async (e) => {
    e.stopPropagation();
    try {
      await video.current.play();
      setBlocked(false);
    } catch {
      showEnd();
    }
  };
  if (phase === 'idle') return null;
  return (
    <dialog
      ref={dialog}
      className="bs-player"
      data-testid="player"
      data-phase={phase}
      {...appearance}
      aria-label={
        phase === 'end'
          ? t('DeepSeek 标题界面', 'DeepSeek title screen')
          : t(`开机动画：${localizedName(clip)}`, `Startup animation: ${localizedName(clip)}`)
      }
      tabIndex={-1}
      onCancel={(e) => {
        e.preventDefault();
        advance();
      }}
      onPointerDown={(e) => {
        if (!e.target.closest('[data-bs-control]')) advance();
      }}
    >
      {phase === 'end' ? (
        <EndTitle settings={settings} />
      ) : (
        <>
          {clip.kind === 'sequence' ? (
            <StartupSequence sound={settings.sound} volume={settings.volume} onEnded={showEnd} />
          ) : (
            <video
              data-testid="boot-video"
              ref={video}
              src={clip.url}
              loop={false}
              playsInline
              preload="auto"
              style={{ objectFit: 'cover' }}
              onPlaying={() => setBlocked(false)}
              onEnded={showEnd}
              onError={showEnd}
            />
          )}
          {blocked && (
            <button data-bs-control type="button" className="bs-play-manual" onClick={playManually}>
              {t('▶ 点击播放', '▶ Click to play')}
            </button>
          )}
          {mutedFallback && (
            <button data-bs-control type="button" className="bs-sound" onClick={enableSound}>
              {t('♪ 开启声音', '♪ Enable sound')}
            </button>
          )}
          <p className="bs-intro-prompt">{t('按任意键跳过动画', 'Press any key to skip')}</p>
        </>
      )}
    </dialog>
  );
}

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

export function BootRoot() {
  const t = useI18n();
  useStyles();
  const appearance = useEnchantAppearance();
  const [play, setPlay] = useState(null);
  const [opened, setOpened] = useState(false);
  const [message, setMessage] = useState('');
  const [launchSettled, setLaunchSettled] = useState(launchDecisionSettled);
  const [launchState, setLaunchState] = useState(latestState);
  const [updateSnapshot, setUpdateSnapshot] = useState(() => startupUpdateSession.getSnapshot());
  const [offerUpdate, setOfferUpdate] = useState(false);
  const trigger = useCallback((value) => setPlay({ ...value, key: Date.now() }), []);
  useEffect(() => {
    const playEvent = (e) => trigger(e.detail);
    const open = () => setOpened(true);
    window.addEventListener(PLAY, playEvent);
    window.addEventListener(OPEN, open);
    return () => {
      window.removeEventListener(PLAY, playEvent);
      window.removeEventListener(OPEN, open);
    };
  }, [trigger]);
  useEffect(() => {
    const stateChanged = (value) => setLaunchState(value);
    subscribers.add(stateChanged);
    const unsubscribe = startupUpdateSession.subscribe(setUpdateSnapshot);
    setUpdateSnapshot(startupUpdateSession.getSnapshot());
    void startupUpdateSession.check(api);
    return () => {
      subscribers.delete(stateChanged);
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (bootClaimed) {
      setLaunchSettled(true);
      return;
    }
    let alive = true;
    // Scope is the current document. A refreshed/reopened renderer replays; a
    // shell slot remount or a conversation change within that renderer does not.
    launchRequest ||= api('/launch');
    launchRequest
      .then((value) => {
        if (!alive || bootClaimed) return;
        bootClaimed = true;
        launchDecisionSettled = true;
        publish(value);
        const stages = playbackStages(value.settings);
        if (stages.video || stages.end) {
          const clip =
            value.clip ||
            value.clips.find((c) => c.id === value.settings.selectedId) ||
            value.clips[0];
          if (clip || stages.end) trigger({ clip, settings: value.settings });
        }
        setLaunchSettled(true);
      })
      .catch(() => {
        if (alive) {
          bootClaimed = true;
          launchDecisionSettled = true;
          setLaunchSettled(true);
        } /* A cosmetic plugin never blocks the workspace. */
      });
    return () => {
      alive = false;
    };
  }, [trigger]);
  useEffect(() => {
    setOfferUpdate(false);
    if (
      !launchSettled ||
      play ||
      opened ||
      updateSnapshot.dismissed ||
      !isAvailableUpdate(updateSnapshot.status)
    )
      return;
    let timer = null;
    let alive = true;
    const blocked = () =>
      Array.from(document.querySelectorAll('dialog[open],[role="dialog"][aria-modal="true"]')).some(
        (element) => {
          if (element.matches('[data-testid="startup-update"]:not([data-preview])')) return false;
          return (
            element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden'
          );
        },
      );
    const schedule = () => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      if (!alive || blocked()) return;
      timer = setTimeout(() => {
        timer = null;
        if (alive && !blocked()) {
          setOfferUpdate(true);
          observer?.disconnect();
        }
      }, 250);
    };
    const observer = typeof MutationObserver === 'function' ? new MutationObserver(schedule) : null;
    observer?.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['open', 'hidden', 'style', 'aria-hidden'],
    });
    schedule();
    return () => {
      alive = false;
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [launchSettled, play, opened, updateSnapshot]);
  const onClose = useCallback((reason) => {
    setPlay(null);
    if (['media-error', 'load-error', 'play-error', 'timeout'].includes(reason)) {
      setMessage('动画未能播放，已为你进入 Harness。可在设置中更换视频。');
      setTimeout(() => setMessage(''), 6500);
    }
  }, []);
  useEffect(() => {
    if (!opened) return;
    const key = (e) => {
      if (e.key === 'Escape' && !play && !document.querySelector('dialog[open]')) setOpened(false);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [opened, play]);
  return (
    <>
      {opened && (
        <div
          className="bs-modal"
          {...appearance}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpened(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('开机动画设置', 'Startup animation settings')}
            className="bs-modal-body"
          >
            <button type="button" className="bs-modal-close" onClick={() => setOpened(false)}>
              {t('关闭 ×', 'Close ×')}
            </button>
            <SettingsPanel />
          </div>
        </div>
      )}
      {play && (
        <Player
          key={play.key}
          clip={play.clip}
          settings={play.settings}
          endOnly={play.endOnly}
          clipOnly={play.clipOnly}
          onClose={onClose}
        />
      )}
      {offerUpdate &&
        !play &&
        !opened &&
        !updateSnapshot.dismissed &&
        isAvailableUpdate(updateSnapshot.status) && (
          <UpdatePrompt
            request={api}
            status={updateSnapshot.status}
            settings={launchState?.settings}
            onDismiss={() => startupUpdateSession.dismiss()}
            onUpdated={(version) => startupUpdateSession.updated(version)}
          />
        )}
      {message && (
        <div className="bs-toast" {...appearance} role="status">
          {localizeMessage(message)}
        </div>
      )}
    </>
  );
}

export function ShortcutAction() {
  const t = useI18n();
  const appearance = useEnchantAppearance();
  const [state, setState] = useState(latestState);
  const registry = getShortcutRegistry();
  const [budget, setBudget] = useState(() => registry.getSnapshot());
  const enabled = state?.settings.showShortcut === true;
  useEffect(() => {
    const changed = (value) => setState(value);
    subscribers.add(changed);
    if (latestState) setState(latestState);
    else
      api('/state')
        .then(publish)
        .catch(() => {});
    return () => subscribers.delete(changed);
  }, []);
  useEffect(() => registry.subscribe(() => setBudget(registry.getSnapshot())), [registry]);
  useEffect(() => {
    if (!enabled) return;
    return registry.acquire(NPM_ENTRY_NAME);
  }, [enabled, registry]);
  if (!enabled || !budget.visibleIds.includes(NPM_ENTRY_NAME)) return null;
  return (
    <button
      type="button"
      title={t('开机动画', 'Startup animation')}
      aria-label={t('开机动画', 'Startup animation')}
      onClick={openSettings}
      {...appearance}
      style={{
        ...appearance.style,
        border: 0,
        background: 'transparent',
        color: 'var(--lewis-accent,currentColor)',
        cursor: 'pointer',
        padding: 8,
        font: 'inherit',
      }}
    >
      ▷
    </button>
  );
}

export function apply(ctx) {
  const wire = (ready) => {
    const register = () => {
      const registry = getEnchantRegistry();
      let unregister;
      const updateName = () => {
        unregister?.();
        unregister = registry.registerPlugin({
          id: NPM_ENTRY_NAME,
          name: translate('开机动画', 'Startup animation'),
          sectionId: 'dsh-boot-studio-settings',
          renderSettings: () => React.createElement(SettingsPanel),
          openSettings: () => window.dispatchEvent(new Event(OPEN)),
        });
      };
      updateName();
      const stopLocale = subscribeHostLocale(updateName);
      try {
        ready.slots.inject('shell.overlay', () =>
          ready.slots.register(
            { name: 'shell.overlay', id: 'dsh-boot-studio-overlay', order: 950 },
            () => React.createElement(BootRoot),
          ),
        );
        ready.slots.inject('settings.section', () =>
          bindSettingsEntry({
            slots: ready.slots,
            registry,
            pluginId: NPM_ENTRY_NAME,
            register: () =>
              ready.slots.register(
                {
                  name: 'settings.section',
                  id: 'dsh-boot-studio-settings',
                  order: 80,
                  label: () => translate('开机动画', 'Startup animation'),
                },
                () => React.createElement(SettingsPanel),
              ),
          }),
        );
        ready.slots.inject('sidebar.footer.action', () =>
          ready.slots.register(
            {
              name: 'sidebar.footer.action',
              id: 'dsh-boot-studio-shortcut',
              order: 42,
              label: () => translate('开机动画', 'Startup animation'),
            },
            () => React.createElement(ShortcutAction),
          ),
        );
        return () => {
          cancelPendingUpdates();
          stopLocale();
          unregister();
        };
      } catch (error) {
        stopLocale();
        unregister();
        throw error;
      }
    };
    if (typeof ready.effect === 'function') return ready.effect(register, 'dsh-boot-studio: slots');
    else return register();
  };
  if (typeof ctx.inject === 'function') {
    // Optional reactive injections leave the settings/player available on older
    // hosts, whose installer can still use the legacy authenticated endpoint.
    const bindInstaller = (ready) => {
      const bind = () =>
        bindHarnessServices({
          pluginManager: ready.remote?.pluginManager,
        });
      return typeof ready.effect === 'function'
        ? ready.effect(bind, 'dsh-boot-studio: installer')
        : bind();
    };
    const bindNavigation = (ready) => {
      const bind = () => bindHarnessServices({ pluginNavigation: ready.pluginNavigation });
      return typeof ready.effect === 'function'
        ? ready.effect(bind, 'dsh-boot-studio: navigation')
        : bind();
    };
    ctx.inject(['remote', 'remote.pluginManager'], bindInstaller);
    ctx.inject(['pluginNavigation'], bindNavigation);
    ctx.inject(['locale'], (ready) =>
      typeof ready.effect === 'function'
        ? ready.effect(() => bindHostLocale(ready.locale))
        : bindHostLocale(ready.locale),
    );
    return ctx.inject(['slots'], wire);
  } else {
    const stopServices = bindHarnessServices({
      pluginManager: ctx.remote?.pluginManager,
      pluginNavigation: ctx.pluginNavigation,
    });
    const stopLocale = ctx.locale ? bindHostLocale(ctx.locale) : () => {};
    const stopSlots = ctx.slots ? wire(ctx) : undefined;
    return () => {
      if (typeof stopSlots === 'function') stopSlots();
      stopLocale();
      stopServices();
    };
  }
}
