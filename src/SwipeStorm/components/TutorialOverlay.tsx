import { t } from '../i18n';

export function TutorialOverlay() {
  return (
    <div className="ss-tutorial" aria-hidden>
      <div className="ss-tutorial__row">
        <div className="ss-tutorial__arrow ss-tutorial__arrow--l">←</div>
        <div className="ss-tutorial__label ss-tutorial__label--l">{t('tut_swipe_left')}</div>
        <div className="ss-tutorial__spacer" />
        <div className="ss-tutorial__label ss-tutorial__label--r">{t('tut_swipe_right')}</div>
        <div className="ss-tutorial__arrow ss-tutorial__arrow--r">→</div>
      </div>
    </div>
  );
}
