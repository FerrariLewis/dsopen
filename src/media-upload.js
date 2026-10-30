import { BASE_PATH, API_TIMEOUTS } from './constants.js';
import { clientError, parseJSONResponse } from './api-client.js';

const TYPES = Object.freeze({
  video: {
    extension: /\.(mp4|m4v|webm)$/i,
    maxBytes: 209715200,
    path: '/upload',
    timeout: 'uploadVideo',
  },
  image: {
    extension: /\.(png|jpe?g|webp)$/i,
    maxBytes: 20971520,
    path: '/end-images',
    timeout: 'uploadImage',
  },
});
const cancelled = () => clientError('BOOT_REQUEST_CANCELLED', '请求已取消。');

export function validateMediaFile(file, kind, maxBytes = TYPES[kind]?.maxBytes) {
  const type = TYPES[kind];
  if (!type) throw TypeError('Unknown media kind');
  if (!file || !type.extension.test(file.name || ''))
    throw clientError(
      kind === 'image' ? 'BOOT_IMAGE_TYPE' : 'BOOT_VIDEO_TYPE',
      kind === 'image'
        ? '请选择不超过20 MB的PNG、JPEG或WebP图片。'
        : '请选择 MP4、M4V 或 WebM 视频。推荐 MP4（H.264 / AAC）。',
    );
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > maxBytes)
    throw clientError(
      kind === 'image' ? 'BOOT_IMAGE_TOO_LARGE' : 'BOOT_VIDEO_TOO_LARGE',
      kind === 'image'
        ? '请选择不超过20 MB的PNG、JPEG或WebP图片。'
        : '视频应大于 0 字节，且不超过 200 MB。',
    );
}

export function probeMediaFile(
  file,
  kind,
  {
    signal,
    documentImpl = globalThis.document,
    ImageImpl = globalThis.Image,
    urlImpl = globalThis.URL,
  } = {},
) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(cancelled());
      return;
    }
    let probe,
      objectURL,
      timer,
      settled = false;
    const cleanup = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      if (probe) {
        probe.onload = probe.onloadeddata = probe.onerror = null;
        if (kind === 'video') {
          probe.removeAttribute('src');
          probe.load();
        } else probe.src = '';
      }
      if (objectURL) urlImpl.revokeObjectURL(objectURL);
    };
    const finish = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) reject(error);
      else resolve();
    };
    const abort = () => finish(cancelled());
    const fail = () =>
      finish(
        clientError(
          kind === 'image' ? 'BOOT_IMAGE_DECODE' : 'BOOT_VIDEO_DECODE',
          kind === 'image'
            ? '无法读取这张图片，请更换有效的PNG、JPEG或WebP。'
            : '浏览器无法读取此视频。请转换为 MP4（H.264 / AAC）后重试。',
        ),
      );
    try {
      probe = kind === 'image' ? new ImageImpl() : documentImpl.createElement('video');
      objectURL = urlImpl.createObjectURL(file);
      signal?.addEventListener('abort', abort, { once: true });
      timer = setTimeout(fail, kind === 'image' ? 10000 : 12000);
      probe.onerror = fail;
      if (kind === 'image') probe.onload = () => finish();
      else {
        probe.onloadeddata = () => finish();
        probe.preload = 'auto';
      }
      probe.src = objectURL;
      if (kind === 'video') probe.load();
    } catch {
      fail();
    }
  });
}

function sendMedia(file, kind, { signal, basePath, onProgress, xhrFactory }) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(cancelled());
      return;
    }
    const xhr = xhrFactory();
    let settled = false;
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener('abort', abort);
      xhr.onload = xhr.onerror = xhr.ontimeout = xhr.onabort = null;
      xhr.upload.onprogress = null;
      if (error) reject(error);
      else resolve(result);
    };
    const abort = () => {
      xhr.abort();
      finish(cancelled());
    };
    signal.addEventListener('abort', abort, { once: true });
    xhr.open('POST', basePath + TYPES[kind].path);
    xhr.setRequestHeader('x-dsh-boot-studio', '1');
    xhr.setRequestHeader('x-file-name', encodeURIComponent(file.name));
    xhr.setRequestHeader('content-type', file.type || 'application/octet-stream');
    xhr.timeout = API_TIMEOUTS[TYPES[kind].timeout];
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      try {
        finish(
          null,
          parseJSONResponse(xhr.responseText, {
            status: xhr.status,
            contentType: xhr.getResponseHeader('content-type'),
          }),
        );
      } catch (error) {
        finish(error);
      }
    };
    xhr.onerror = () => finish(clientError('BOOT_UPLOAD_INTERRUPTED', '上传中断，请重试。'));
    xhr.ontimeout = () => finish(clientError('BOOT_UPLOAD_TIMEOUT', '上传等待超时，请重试。'));
    xhr.onabort = () => finish(cancelled());
    try {
      xhr.send(file);
    } catch {
      finish(clientError('BOOT_UPLOAD_INTERRUPTED', '上传中断，请重试。'));
    }
  });
}

/** One cancellation owner covers validation, browser decoding and upload. */
export function createMediaUpload(
  file,
  {
    kind = 'video',
    maxBytes = TYPES[kind]?.maxBytes,
    basePath = BASE_PATH,
    onPhase,
    onProgress,
    probe = probeMediaFile,
    xhrFactory = () => new XMLHttpRequest(),
  } = {},
) {
  const controller = new AbortController();
  const promise = Promise.resolve().then(async () => {
    validateMediaFile(file, kind, maxBytes);
    onPhase?.('probe');
    await probe(file, kind, { signal: controller.signal });
    if (controller.signal.aborted) throw cancelled();
    onPhase?.('upload');
    onProgress?.(0);
    return sendMedia(file, kind, { signal: controller.signal, basePath, onProgress, xhrFactory });
  });
  return { promise, cancel: () => controller.abort() };
}
