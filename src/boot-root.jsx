import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStudioStyles as useStyles } from './studio-styles.jsx';
import { UpdatePrompt } from './update-prompt.jsx';
import { startupUpdateSession, isAvailableUpdate } from './startup-update.js';
import { useEnchantAppearance } from './enchant-theme.jsx';
import { useI18n } from './i18n.jsx';
import { api } from './api-client.js';
import { SettingsPanel } from './settings-panel.jsx';
import { Player, playbackStages } from './player.jsx';
import { OPEN, PLAY, launchSession, latestState, subscribers, publish } from './studio-state.js';

export function BootRoot() {
  const t = useI18n();
  useStyles();
  const appearance = useEnchantAppearance();
  const [play, setPlay] = useState(null);
  const [opened, setOpened] = useState(false);
  const [message, setMessage] = useState('');
  const messageTimer = useRef(null);
  useEffect(() => () => clearTimeout(messageTimer.current), []);
  const [launchSettled, setLaunchSettled] = useState(launchSession.decisionSettled);
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
    if (launchSession.bootClaimed) {
      setLaunchSettled(true);
      return;
    }
    let alive = true;
    // Scope is the current document. A refreshed/reopened renderer replays; a
    // shell slot remount or a conversation change within that renderer does not.
    launchSession.request ||= api('/launch');
    launchSession.request
      .then((value) => {
        if (!alive || launchSession.bootClaimed) return;
        launchSession.bootClaimed = true;
        launchSession.decisionSettled = true;
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
          launchSession.bootClaimed = true;
          launchSession.decisionSettled = true;
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
      setMessage(reason);
      clearTimeout(messageTimer.current);
      messageTimer.current = setTimeout(() => setMessage(''), 6500);
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
          {t(
            '动画未能播放，已为你进入 Harness。可在设置中更换视频。',
            'The animation could not play. Harness is ready. Choose another video in Settings.',
          )}
        </div>
      )}
    </>
  );
}
