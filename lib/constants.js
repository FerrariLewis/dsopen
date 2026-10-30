/** Stable identities are distinct: changing the update identity breaks installed clients. */
export const CORE_PACKAGE_NAME = 'dsh-boot-studio';
export const NPM_ENTRY_NAME = 'dsh-openup-lewis';
export const BASE_PATH = `/${CORE_PACKAGE_NAME}`;
export const REPOSITORY = 'FerrariLewis/dsopen';
export const UPDATE_REPOSITORY = 'FerrariLewis/open';
export const MAX_PACKAGE_BYTES = 80 * 1024 * 1024;
export const NPM_REGISTRIES = Object.freeze([
  'https://registry.npmjs.org',
  'https://registry.npmmirror.com',
]);
export const API_TIMEOUTS = Object.freeze({
  request: 7000,
  updateCheck: 20000,
  updatePrepare: 35 * 60 * 1000,
  uploadVideo: 180000,
  uploadImage: 120000,
  reset: 180000,
  install: 120000,
});
