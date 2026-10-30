import { BASE_PATH, API_TIMEOUTS } from './constants.js';

export function clientError(code, message, properties = {}) {
  return Object.assign(new Error(message), { code, ...properties });
}

const jsonType = (value) =>
  /^(?:application\/json|application\/[\w.+-]+\+json)(?:\s*;|$)/i.test(String(value || '').trim());

/** Never expose an HTML page or a JSON parser's implementation details as copy. */
export function parseJSONResponse(text, { status = 200, contentType } = {}) {
  const ok = status >= 200 && status < 300;
  const fallback = () =>
    clientError(
      ok ? 'BOOT_RESPONSE_INVALID' : 'BOOT_HTTP_ERROR',
      ok ? '服务返回了无法识别的内容，请稍后重试。' : `请求失败 (${status})`,
      { status },
    );
  if (!jsonType(contentType)) throw fallback();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw fallback();
  }
  if (!ok) {
    const message =
      typeof data?.error === 'string' && data.error.trim() ? data.error : `请求失败 (${status})`;
    const code =
      typeof data?.code === 'string'
        ? data.code
        : typeof data?.errorCode === 'string'
          ? data.errorCode
          : 'BOOT_HTTP_ERROR';
    throw clientError(code, message, { status, details: data?.details });
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw fallback();
  return data;
}

export async function readJSONResponse(response) {
  // Read the status and media type before consuming the response body.
  const status = response.status;
  const contentType = response.headers?.get?.('content-type');
  if (!jsonType(contentType)) return parseJSONResponse('', { status, contentType });
  return parseJSONResponse(await response.text(), { status, contentType });
}

export function requestTimeout(path) {
  if (path === '/updates/prepare') return API_TIMEOUTS.updatePrepare;
  if (path === '/updates/check') return API_TIMEOUTS.updateCheck;
  if (path === '/upload') return API_TIMEOUTS.uploadVideo;
  if (path === '/end-images') return API_TIMEOUTS.uploadImage;
  if (path === '/reset') return API_TIMEOUTS.reset;
  return API_TIMEOUTS.request;
}

export function createAPIClient({
  basePath = BASE_PATH,
  fetchImpl = (...args) => fetch(...args),
  timeoutForPath = requestTimeout,
} = {}) {
  return async function api(path, options = {}) {
    const controller = new AbortController();
    let timedOut = false;
    const abort = () => controller.abort();
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutForPath(path));
    if (options.signal?.aborted) controller.abort();
    else options.signal?.addEventListener('abort', abort, { once: true });
    try {
      const response = await fetchImpl(basePath + path, {
        ...options,
        signal: controller.signal,
        headers: {
          'x-dsh-boot-studio': '1',
          ...(typeof options.body === 'string' ? { 'content-type': 'application/json' } : {}),
          ...options.headers,
        },
      });
      return await readJSONResponse(response);
    } catch (error) {
      if (timedOut)
        throw clientError('BOOT_REQUEST_TIMEOUT', '请求超时，请检查连接后重试。', { cause: error });
      if (controller.signal.aborted)
        throw clientError('BOOT_REQUEST_CANCELLED', '请求已取消。', { cause: error });
      if (error?.code) throw error;
      throw clientError(
        'BOOT_NETWORK_ERROR',
        '无法连接开机动画服务，请检查连接或重启 Harness 后重试。',
        { cause: error },
      );
    } finally {
      clearTimeout(timer);
      options.signal?.removeEventListener('abort', abort);
    }
  };
}

export const api = createAPIClient();
