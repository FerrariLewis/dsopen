/** Shared across ENCHANT products: release text is authored, versioned plain text. */
export const MAX_RELEASE_NOTES_LENGTH = 2000;

export function validateReleaseNotes(value, expectedVersion, { required = false } = {}) {
  if (value === undefined || value === null) {
    if (required) throw new Error('发布前请先询问作者并填写本版本给用户展示的更新说明。');
    return null;
  }
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      Object.keys(value).some(key => key !== 'version' && key !== 'notes')) throw new Error('更新说明须包含且仅包含 version 和 notes。');
  if (typeof expectedVersion !== 'string' || value.version !== expectedVersion) throw new Error('作者更新说明的版本必须与实际安装包版本完全一致。');
  if (typeof value.notes !== 'string' || !value.notes.trim() ||
      value.notes.length > MAX_RELEASE_NOTES_LENGTH || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value.notes)) throw new Error('作者更新说明须为 1 到 2000 字的纯文本，不接受控制字符。');
  // Keep the author's exact text, including punctuation and line breaks. React
  // renders it as a text node; Markdown and HTML are never executed.
  return value.notes;
}

export function requirePackageReleaseNotes(manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw new Error('安装包元数据不存在，无法核对作者更新说明。');
  return validateReleaseNotes(manifest.lewisEnchantRelease, manifest.version, { required: true });
}
