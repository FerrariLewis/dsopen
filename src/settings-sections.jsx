import React from 'react';
import { WHALE_PATH } from './logo-path.js';
import { useI18n, localizedName } from './i18n.jsx';

export function VideoLibrary({
  state,
  settings,
  busy,
  preview,
  save,
  remove,
  pendingDelete,
  setPendingDelete,
  input,
  upload,
}) {
  const t = useI18n();
  return (
    <>
      <div className="bs-library">
        {state.clips.map((clip, index) => (
          <article
            key={clip.id}
            className={`bs-clip ${clip.id === settings.selectedId ? 'is-selected' : ''}`}
          >
            <button
              type="button"
              className={`bs-thumbnail bs-tone-${index % 4}`}
              aria-label={t(`预览 ${localizedName(clip)}`, `Preview ${localizedName(clip)}`)}
              onClick={() => preview(clip, settings, false, true)}
              disabled={busy}
            >
              {clip.kind === 'sequence' ? (
                <div className="bs-sequence-thumb">
                  <svg viewBox="0 0 50 50" aria-hidden="true">
                    <path d={WHALE_PATH} />
                  </svg>
                  <span>DEEPSEEK</span>
                  <small>TECHNICAL DOSSIER</small>
                </div>
              ) : (
                <video
                  src={clip.url + '#t=0.4'}
                  muted
                  playsInline
                  preload="metadata"
                  tabIndex={-1}
                />
              )}
              <span className="bs-thumbnail-shade" />
              <span className="bs-play-icon">▶</span>
              <span className="bs-clip-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="bs-badge">
                {clip.kind === 'sequence'
                  ? t('程序动画', 'Animated sequence')
                  : clip.source === 'builtin'
                    ? t('内置', 'Built-in')
                    : t('我的视频', 'My video')}
              </span>
            </button>
            <div className="bs-clip-info">
              <h3>{localizedName(clip)}</h3>
              <span>
                {clip.kind === 'sequence'
                  ? t('原版视觉序列', 'Original visual sequence')
                  : (clip.bytes / 1048576).toFixed(1) + ' MB'}
              </span>
            </div>
            <div className="bs-clip-actions">
              <button
                type="button"
                className={clip.id === settings.selectedId ? 'bs-selected' : ''}
                onClick={() => save({ selectedId: clip.id })}
                disabled={busy || clip.id === settings.selectedId}
              >
                {clip.id === settings.selectedId
                  ? t('✓ 当前动画', '✓ Selected')
                  : t('使用此动画', 'Use this animation')}
              </button>
              {clip.source === 'upload' && (
                <button
                  className="bs-delete"
                  aria-label={t(`删除 ${localizedName(clip)}`, `Delete ${localizedName(clip)}`)}
                  disabled={busy}
                  onClick={() => setPendingDelete(clip)}
                >
                  {t('移除', 'Remove')}
                </button>
              )}
            </div>
            {pendingDelete?.id === clip.id && (
              <div className="bs-delete-confirm">
                {t('移除此视频？', 'Remove this video?')}
                <button type="button" disabled={busy} onClick={() => remove(clip)}>
                  {t('确认移除', 'Confirm removal')}
                </button>
                <button type="button" onClick={() => setPendingDelete(null)}>
                  {t('取消', 'Cancel')}
                </button>
              </div>
            )}
          </article>
        ))}
        <button
          type="button"
          className="bs-upload"
          disabled={busy}
          onClick={() => input.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            upload(e.dataTransfer.files?.[0]);
          }}
        >
          <span>＋</span>
          <strong>{t('上传我的视频', 'Upload my video')}</strong>
          <small>{t('点击选择，或将视频拖到这里', 'Click to select or drop a video here')}</small>
          <small>MP4 / WebM / M4V · ≤ 200 MB</small>
        </button>
      </div>
      {state.storage && state.maxCustomMediaBytes > 0 && state.maxCustomMediaFiles > 0 && (
        <p className="bs-hint" role="status">
          {t(
            `个人素材已用 ${(state.storage.bytes / 1048576).toFixed(1)} / ${(state.maxCustomMediaBytes / 1048576).toFixed(0)} MB（${state.storage.files} / ${state.maxCustomMediaFiles} 个）。视频与图片共用额度，移除不用的素材可释放空间。`,
            `Custom media: ${(state.storage.bytes / 1048576).toFixed(1)} / ${(state.maxCustomMediaBytes / 1048576).toFixed(0)} MB (${state.storage.files} / ${state.maxCustomMediaFiles} files). Videos and images share this limit. Remove unused media to free space.`,
          )}
        </p>
      )}
      <input
        ref={input}
        type="file"
        accept=".mp4,.m4v,.webm,video/mp4,video/webm"
        aria-label={t('上传开机视频', 'Upload startup video')}
        hidden
        onChange={(e) => {
          upload(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </>
  );
}

export function EndingSettings({
  state,
  settings,
  busy,
  save,
  imageInput,
  uploadEndImage,
  removeEndImage,
  pendingImageDelete,
  setPendingImageDelete,
  EndTitleComponent,
}) {
  const t = useI18n();
  return (
    <>
      <div className="bs-preferences bs-ending-settings">
        <div className="bs-field bs-ending-header">
          <h2>{t('结束停留画面', 'Ending screen')}</h2>
          <select
            aria-label={t('结束画面类型', 'Ending screen type')}
            disabled={busy}
            value={settings.endScreen || 'logo'}
            onChange={(e) => {
              if (e.target.value === 'image' && !settings.endImageId) {
                imageInput.current?.click();
                return;
              }
              save({ endScreen: e.target.value });
            }}
          >
            <option value="logo">{t('内置画面', 'Built-in screens')}</option>
            <option value="image">{t('我的图片', 'My images')}</option>
          </select>
        </div>
        {!!state.logos?.length && (
          <div className="bs-logo-options">
            {state.logos.map((logo) => (
              <button
                type="button"
                key={logo.id}
                disabled={busy}
                className={
                  settings.endScreen === 'logo' && settings.logoVariant === logo.id
                    ? 'is-selected'
                    : ''
                }
                aria-label={t(
                  `使用内置结束画面 ${localizedName(logo)}`,
                  `Use built-in ending screen ${localizedName(logo)}`,
                )}
                onClick={() => save({ endScreen: 'logo', logoVariant: logo.id })}
              >
                <img src={logo.url} alt="" style={{ objectFit: logo.fit || 'cover' }} />
                <span>
                  {localizedName(logo)}
                  {settings.endScreen === 'logo' && settings.logoVariant === logo.id ? ' ✓' : ''}
                </span>
              </button>
            ))}
          </div>
        )}
        <div className="bs-ending-preview">
          <div className="bs-ending-mini">
            <EndTitleComponent settings={settings} />
          </div>
          <div>
            <strong>
              {settings.endScreen === 'image'
                ? t('我的图片', 'My image')
                : localizedName(state.logos?.find((logo) => logo.id === settings.logoVariant)) ||
                  t('DeepSeek 标志', 'DeepSeek logo')}
            </strong>
            <button
              type="button"
              className="bs-primary"
              disabled={busy}
              onClick={() => imageInput.current?.click()}
            >
              {t('上传结束图片', 'Upload ending image')}
            </button>
            <small>PNG / JPEG / WebP · ≤ 20 MB</small>
          </div>
        </div>
        {settings.endScreen === 'image' && (
          <label className="bs-field">
            <span>{t('结束图片显示', 'Image fit')}</span>
            <select
              aria-label={t('结束图片显示', 'Image fit')}
              value={settings.endFit || 'cover'}
              disabled={busy}
              onChange={(e) => save({ endFit: e.target.value })}
            >
              <option value="contain">{t('完整显示', 'Fit entire image')}</option>
              <option value="cover">{t('铺满窗口', 'Fill window')}</option>
            </select>
          </label>
        )}
        {!!state.endImages?.length && (
          <div className="bs-end-library">
            {state.endImages.map((image) => (
              <div
                className={`bs-end-card ${settings.endScreen === 'image' && settings.endImageId === image.id ? 'is-selected' : ''}`}
                key={image.id}
              >
                <button
                  type="button"
                  disabled={busy}
                  aria-label={t(`使用结束图片 ${image.name}`, `Use ending image ${image.name}`)}
                  onClick={() => save({ endImageId: image.id, endScreen: 'image' })}
                >
                  <img src={image.url} alt="" />
                  <span>{image.name}</span>
                </button>
                {pendingImageDelete === image.id ? (
                  <span>
                    <button type="button" disabled={busy} onClick={() => removeEndImage(image)}>
                      {t('确认移除', 'Confirm removal')}
                    </button>
                    <button type="button" onClick={() => setPendingImageDelete(null)}>
                      {t('取消', 'Cancel')}
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    className="bs-delete"
                    aria-label={t(
                      `移除结束图片 ${image.name}`,
                      `Remove ending image ${image.name}`,
                    )}
                    onClick={() => setPendingImageDelete(image.id)}
                  >
                    {t('移除', 'Remove')}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <input
        ref={imageInput}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
        aria-label={t('上传结束图片', 'Upload ending image')}
        hidden
        onChange={(e) => {
          uploadEndImage(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </>
  );
}
