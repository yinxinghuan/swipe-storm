import { activeCartridge } from '../cartridge';

export function TutorialOverlay() {
  return (
    <div className="ss-tutorial" aria-hidden>
      <div className="ss-tutorial__row">
        <div className="ss-tutorial__arrow ss-tutorial__arrow--l">←</div>
        <div className="ss-tutorial__label ss-tutorial__label--l">{activeCartridge.copy.tutorialLeft}</div>
        <div className="ss-tutorial__spacer" />
        <div className="ss-tutorial__label ss-tutorial__label--r">{activeCartridge.copy.tutorialRight}</div>
        <div className="ss-tutorial__arrow ss-tutorial__arrow--r">→</div>
      </div>
    </div>
  );
}
