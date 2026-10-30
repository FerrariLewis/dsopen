import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStudioStyles as useStyles } from './studio-styles.jsx';
import { WHALE_PATH } from './logo-path.js';
import { StartupSequence } from './startup-screen.jsx';
import { useEnchantAppearance } from './enchant-theme.jsx';
import { useI18n, localizedName } from './i18n.jsx';
import { BASE_PATH as BASE } from './constants.js';
import { handlePlayerKey } from './player-input.js';

const playerWindows = new WeakMap();

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
  const failure = useRef(null);
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
      onClose(failure.current || reason);
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
  const fail = useCallback(
    (reason) => {
      if (closed.current || phaseRef.current !== 'intro') return;
      failure.current ||= reason;
      showEnd();
    },
    [showEnd],
  );
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
      const timeout = setTimeout(() => fail('timeout'), 120000);
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
      if (performance.now() - progressAt > 30000) fail('timeout');
    }, 1000);
    return () => {
      clearInterval(watchdog);
      playerVideo.pause();
      playerVideo.removeAttribute('src');
      playerVideo.load();
    };
  }, [phase, clip?.kind, fail]);
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
      } catch {
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
      fail('play-error');
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
              onError={() => fail('media-error')}
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
