import React, { useEffect, useRef, useState } from 'react';
import { useEnchantAppearance } from './enchant-theme.jsx';
import { useStudioStyles } from './studio-styles.jsx';
import { CloseIcon } from './close-icon.jsx';
import { useI18n } from './i18n.jsx';
import { api } from './api-client.js';
import { telemetryMetadata } from './telemetry-runtime.js';

export function DataSharingDialog({ onClose, onStatus }) {
  const t = useI18n();
  useStudioStyles();
  const appearance = useEnchantAppearance();
  const dialog = useRef(null),
    closeButton = useRef(null),
    alive = useRef(true),
    lock = useRef(false),
    operation = useRef({ sequence: 0 });
  const [status, setStatus] = useState(null),
    [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [pollExpired, setPollExpired] = useState(false);
  useEffect(() => {
    alive.current = true;
    let active = true;
    const controller = new AbortController(),
      requestVersion = operation.current;
    const element = dialog.current,
      previous = document.activeElement;
    if (typeof element.showModal === 'function') {
      if (!element.open) element.showModal();
    } else element.setAttribute('open', '');
    closeButton.current?.focus();
    api('/telemetry', { signal: controller.signal })
      .then((value) => {
        if (active) {
          setStatus(value);
          onStatus?.(value);
        }
      })
      .catch(() => {
        if (active) setError('load');
      });
    return () => {
      active = false;
      alive.current = false;
      requestVersion.sequence++;
      controller.abort();
      if (element.open && typeof element.close === 'function') element.close();
      if (previous?.isConnected) previous.focus?.();
    };
  }, [onStatus]);
  const awaitingReport = Boolean(
    status?.enabled && (status.reporting || status.lastResult == null),
  );
  useEffect(() => {
    if (!awaitingReport || busy) return;
    let active = true,
      timer,
      controller;
    const sequence = operation.current.sequence;
    setPollExpired(false);
    const current = () => active && alive.current && operation.current.sequence === sequence;
    function stop() {
      active = false;
      clearTimeout(timer);
      controller?.abort();
      clearTimeout(deadline);
    }
    const deadline = setTimeout(() => {
      if (current()) setPollExpired(true);
      stop();
    }, 90000);
    function schedule() {
      timer = setTimeout(async () => {
        if (!current()) return;
        controller = new AbortController();
        try {
          const value = await api('/telemetry', { signal: controller.signal });
          if (!current()) return;
          setStatus(value);
          onStatus?.(value);
          if (value.enabled && (value.reporting || value.lastResult == null)) schedule();
          else stop();
        } catch {
          if (current()) setError('refresh');
          stop();
        }
      }, 1000);
    }
    schedule();
    return stop;
  }, [awaitingReport, busy, onStatus]);
  async function change(path, body) {
    if (lock.current) return;
    lock.current = true;
    const sequence = ++operation.current.sequence;
    setBusy(true);
    setError('');
    setPollExpired(false);
    try {
      const value = await api(path, { method: 'POST', body: JSON.stringify(body) });
      if (alive.current && sequence === operation.current.sequence) {
        setStatus(value);
        setConfirmed(false);
        onStatus?.(value);
      }
    } catch {
      if (alive.current && sequence === operation.current.sequence) setError('change');
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  const close = () => {
    if (!lock.current) onClose();
  };
  const stopped = status && !status.enabled && status.lastResult?.withdrawn;
  const result = status?.lastResult;
  const sentAt = status?.lastSentAt && new Date(status.lastSentAt);
  const sentAtLabel =
    sentAt && Number.isFinite(sentAt.getTime())
      ? sentAt.toLocaleString(t('zh-CN', 'en-US'))
      : t('尚无成功上报', 'No successful report yet');
  const failureCode =
    /^(?:HTTP_[1-5]\d\d|ECONNRESET|ETIMEDOUT|ENOTFOUND|AbortError|TimeoutError|TypeError|Error)$/.test(
      result?.failureCode || '',
    )
      ? result.failureCode
      : null;
  const httpStatus =
    Number.isInteger(result?.httpStatus) && result.httpStatus >= 100 && result.httpStatus <= 599
      ? result.httpStatus
      : null;
  const reportSummary =
    result?.sent === true
      ? result.accountIdentified === true
        ? t('上报成功，已识别 DeepSeek 账户。', 'Report sent; the DeepSeek account was identified.')
        : t(
            '上报成功，仅包含安装数据，未识别已登录账户。',
            'Report sent with installation data only; no signed-in account was identified.',
          )
      : result?.sent === false
        ? t(
            '最近一次上报未成功，可重试上报。',
            'The latest report was not sent. You can retry reporting.',
          )
        : null;
  return (
    <dialog
      ref={dialog}
      className="bs-startup-update bs-sharing-dialog"
      data-testid="data-sharing-dialog"
      {...appearance}
      aria-labelledby="bs-sharing-title"
      aria-describedby="bs-sharing-description bs-sharing-region"
      aria-busy={busy}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className="bs-startup-update-card bs-sharing-card">
        <button
          ref={closeButton}
          className="bs-startup-update-close"
          type="button"
          disabled={busy}
          aria-label={t('关闭数据共享说明', 'Close data-sharing notice')}
          onClick={close}
        >
          <CloseIcon />
        </button>
        <p className="bs-startup-update-brand">DSH LEWIS ENCHANTMENT</p>
        <h2 id="bs-sharing-title">{t('与开发者共享数据', 'Share data with the developer')}</h2>
        <p id="bs-sharing-description" className="bs-startup-update-copy">
          {t(
            '由 FerrariLewis 接收，用于了解插件使用规模和版本分布。默认关闭，拒绝不会影响任何插件功能。',
            'FerrariLewis receives this data to understand plugin usage and version distribution. Sharing is off by default and is optional.',
          )}
        </p>
        <p id="bs-sharing-region" className="bs-sharing-unconfigured">
          {t(
            'OpenAI不支持的地区，与开发者共享数据暂不可用。',
            'Sharing data with the developer is currently unavailable in regions not supported by OpenAI.',
          )}
        </p>
        <div className="bs-sharing-notice">
          <h3>{t('你同意后将共享', 'Shared after you agree')}</h3>
          <ul>
            <li>
              {t(
                '已登录 DeepSeek 的昵称与账户标识。账户标识传至接收服务后用服务端密钥 HMAC 去重，原始标识不落盘。',
                'The signed-in DeepSeek nickname and account ID. The collector derives an HMAC key for deduplication; raw account IDs are not stored.',
              )}
            </li>
            <li>
              {t(
                '插件及 Harness 版本、操作系统、处理器架构和界面语言。',
                'Plugin and Harness versions, operating system, processor architecture and interface language.',
              )}
            </li>
            <li>
              {t(
                '首次与最近活跃时间，以及用于去重的随机安装标识。正常使用中最多每天自动上报一次。',
                'First and most recent activity times and a random installation identifier. Normal automatic reporting is limited to once per day.',
              )}
            </li>
          </ul>
          <p>
            {t(
              '不会收集登录令牌、API Key、联系方式、聊天内容或余额；没有可用的会员等级接口，会员等级统一未知。',
              'Login tokens, API keys, contact information, conversations and balances are excluded. Membership level has no supported data source and remains unknown.',
            )}
          </p>
          <p>
            {t(
              '未登录或接口不可用时只上报安装数据。账户信息由客户端自报，未经 DeepSeek 身份验证；账户数和安装数均不等于自然人数。',
              'Without an available signed-in profile, only installation data is reported. Account information is client-reported, not verified by DeepSeek; accounts and installations do not equal people.',
            )}
          </p>
          <p>
            {t(
              '可随时从此入口停止共享并请求删除该安装关联数据。同账户仍有其他已授权安装时，其余安装数据会保留。',
              'You can stop sharing and request deletion for this installation here. Data from other authorized installations of the same account remains.',
            )}
          </p>
        </div>
        {!status && !error && (
          <p role="status">{t('正在读取共享状态…', 'Loading sharing status…')}</p>
        )}
        {status && !status.configured && (
          <p className="bs-sharing-unconfigured" role="status">
            {t(
              '开发者尚未配置数据接收服务，当前不会发送任何数据。',
              'The developer has not configured a collector. No data is currently sent.',
            )}
          </p>
        )}
        <p className="bs-sharing-endpoint">
          <a
            href="https://dsopen-console-lewis.lewiszhouyichen.chatgpt.site"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('作者后台（仅作者可访问）', 'Author dashboard (author access only)')}
          </a>
          <br />
          {t(
            '请使用作者的 OpenAI / ChatGPT 账户登录。',
            "Sign in with the author's OpenAI / ChatGPT account.",
          )}
        </p>
        {status?.enabled && (
          <div className="bs-sharing-active" role="status" data-testid="sharing-report-status">
            <p>
              {t(
                '数据共享已开启。之后将按上述范围自动上报。',
                'Sharing is enabled. Future reports follow the scope above.',
              )}
            </p>
            {(status.reporting || result == null) && !pollExpired && (
              <p>
                {status.lastSentAt
                  ? t('正在上报，请稍候…', 'Reporting; please wait…')
                  : t('首次上报中，请稍候…', 'Sending the first report; please wait…')}
              </p>
            )}
            <p>
              {t('上次成功上报：', 'Last successful report: ')}
              {sentAtLabel}
            </p>
            {reportSummary && <p>{reportSummary}</p>}
            {result?.sent === false && (failureCode || httpStatus) && (
              <p>
                {t('诊断摘要：', 'Diagnostic summary: ')}
                {[failureCode, httpStatus && `HTTP ${httpStatus}`].filter(Boolean).join(' · ')}
              </p>
            )}
            {pollExpired && (
              <p>
                {t(
                  '等待上报结果已超过 90 秒，请稍后重新打开此窗口查看状态。',
                  'Waiting for the report exceeded 90 seconds. Reopen this window later to check its status.',
                )}
              </p>
            )}
          </div>
        )}
        {status?.authorizationRequired && (
          <p role="status">
            {t(
              '接收服务或说明已变更，需要重新授权。',
              'The collector or notice changed. Fresh authorization is required.',
            )}
          </p>
        )}
        {status?.withdrawalPending && (
          <p className="bs-startup-update-error" role="status">
            {t(
              '已停止共享；远程删除尚未确认，请重试删除。',
              'Sharing has stopped. Remote deletion is unconfirmed; retry deletion.',
            )}
          </p>
        )}
        {stopped && !status.withdrawalPending && (
          <p className="bs-sharing-active" role="status">
            {t(
              '已停止共享，已确认删除该安装关联的远程数据。',
              'Sharing has stopped and deletion of this installation’s remote data is confirmed.',
            )}
          </p>
        )}
        {error && (
          <p className="bs-startup-update-error" role="alert">
            {error === 'load'
              ? t(
                  '暂时无法读取共享状态，请关闭后重试。',
                  'Sharing status is unavailable. Close this window and try again.',
                )
              : error === 'refresh'
                ? t(
                    '暂时无法刷新上报状态，请稍后重新打开此窗口查看。',
                    'Report status could not be refreshed. Reopen this window later to check it.',
                  )
                : t(
                    '操作未完成，请检查网络连接后重试。',
                    'The operation did not complete. Check your connection and try again.',
                  )}
          </p>
        )}
        {status && !status.enabled && !status.withdrawalPending && (
          <label className="bs-sharing-consent">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              disabled={!status.configured || busy}
            />
            <span>
              {t(
                '我已阅读并同意上述数据范围、用途和撤回方式。',
                'I have read and agree to the data scope, purpose and withdrawal process above.',
              )}
            </span>
          </label>
        )}
        <div className="bs-startup-update-actions">
          <button type="button" disabled={busy} onClick={close}>
            {t('关闭', 'Close')}
          </button>
          {status?.enabled && (
            <button
              type="button"
              disabled={busy || Boolean(status.reporting)}
              onClick={() => change('/telemetry/retry', telemetryMetadata())}
            >
              {t('重试上报', 'Retry reporting')}
            </button>
          )}
          {status &&
          (status.enabled || status.withdrawalPending || status.authorizationRequired) ? (
            <button type="button" disabled={busy} onClick={() => change('/telemetry/withdraw', {})}>
              {busy
                ? t('正在处理…', 'Processing…')
                : status.withdrawalPending
                  ? t('重试删除', 'Retry deletion')
                  : t('停止共享并请求删除', 'Stop sharing and request deletion')}
            </button>
          ) : (
            <button
              type="button"
              className="bs-startup-update-primary"
              disabled={!status?.configured || !confirmed || busy}
              onClick={() =>
                change('/telemetry/consent', {
                  confirmed: true,
                  policyVersion: status.policyVersion,
                  ...telemetryMetadata(),
                })
              }
            >
              {busy ? t('正在保存…', 'Saving…') : t('同意并开启', 'Agree and enable')}
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
