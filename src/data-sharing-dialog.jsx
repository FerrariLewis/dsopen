import React, { useEffect, useRef, useState } from 'react';
import { useEnchantAppearance } from './enchant-theme.jsx';
import { useStudioStyles } from './studio-styles.jsx';
import { CloseIcon } from './close-icon.jsx';
import { useI18n, localizeMessage } from './i18n.jsx';
import { api } from './api-client.js';
import { telemetryMetadata } from './telemetry-runtime.js';

export function DataSharingDialog({ onClose, onStatus }) {
  const t = useI18n();
  useStudioStyles();
  const appearance = useEnchantAppearance();
  const dialog = useRef(null),
    closeButton = useRef(null),
    alive = useRef(true),
    lock = useRef(false);
  const [status, setStatus] = useState(null),
    [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  useEffect(() => {
    alive.current = true;
    const element = dialog.current,
      previous = document.activeElement;
    if (typeof element.showModal === 'function') {
      if (!element.open) element.showModal();
    } else element.setAttribute('open', '');
    closeButton.current?.focus();
    api('/telemetry')
      .then((value) => {
        if (alive.current) {
          setStatus(value);
          onStatus?.(value);
        }
      })
      .catch((reason) => {
        if (alive.current) setError(reason);
      });
    return () => {
      alive.current = false;
      if (element.open && typeof element.close === 'function') element.close();
      if (previous?.isConnected) previous.focus?.();
    };
  }, [onStatus]);
  async function change(path, body) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      const value = await api(path, { method: 'POST', body: JSON.stringify(body) });
      if (alive.current) {
        setStatus(value);
        setConfirmed(false);
        onStatus?.(value);
      }
    } catch (reason) {
      if (alive.current) setError(reason);
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  const close = () => {
    if (!lock.current) onClose();
  };
  const stopped = status && !status.enabled && status.lastResult?.withdrawn;
  return (
    <dialog
      ref={dialog}
      className="bs-startup-update bs-sharing-dialog"
      data-testid="data-sharing-dialog"
      {...appearance}
      aria-labelledby="bs-sharing-title"
      aria-describedby="bs-sharing-description"
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
        {status?.endpoint && (
          <p className="bs-sharing-endpoint">
            {t('接收服务：', 'Collector: ')}
            {status.endpoint}
          </p>
        )}
        {status?.enabled && (
          <p className="bs-sharing-active" role="status">
            {t(
              '数据共享已开启。之后将按上述范围自动上报。',
              'Sharing is enabled. Future reports follow the scope above.',
            )}
          </p>
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
            {localizeMessage(error)}
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
