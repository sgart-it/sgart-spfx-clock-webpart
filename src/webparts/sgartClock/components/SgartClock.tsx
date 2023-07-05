import * as React from 'react';
import styles from './SgartClock.module.scss';
import { ISgartClockProps } from './ISgartClockProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { isNullOrWhiteSpace } from '../Helper';

const PrefixHours = "sgart-clock-hours-";
const PrefixMinutes = "sgart-clock-minutes-";
const PrefixSeconds = "sgart-clock-seconds-";
const PrefixText = "sgart-clock-text-";

export default class SgartClock extends React.Component<ISgartClockProps, {}> {

  componentDidMount(): void {
    setInterval(this.updateClock, 250);

    this.updateClock();
  }

  public render(): React.ReactElement<ISgartClockProps> {
    const {
      componentId,
      title,
      size,
      showHandSeconds,
      backgroundColor,
      borderColor,
      notchesColor,
      fourthColor,
      handHoursColor,
      handMinutesColor,
      handSecondsColor,
      handPointColor,
      clockText,
      clockTextColor,
      showDigitalClock,
      digitalClockColor,
      //isDarkTheme,
      //environmentMessage,
      hasTeamsContext,
      //userDisplayName
    } = this.props;

    const isTitleVisible = !isNullOrWhiteSpace(title);
    const sizeStr = size <= 0 ? "100%" : `${size}px`;
    const isClockText = !isNullOrWhiteSpace(clockText);


    return (
      <section className={`${styles.sgartClock} ${hasTeamsContext ? styles.teams : ''}`}>
        {isTitleVisible && (
          <div className={styles.title}>
            <span role="heading">{escape(title)}</span>
          </div>
        )}
        <svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" width={sizeStr} height={sizeStr}>
          <g>
            {/* sfondo e bordo esterno */}
            <circle cx="256" cy="256" r="255" fill={borderColor} />
            <circle cx="256" cy="256" r="240" fill={backgroundColor} />
          </g>
          <g>
            {/* linee dei 5 minuti */}
            <line x1="256" y1="66" x2="256" y2="26" stroke={fourthColor} stroke-width="15" />
            <line x1="356" y1="82.795" x2="371" y2="56.814" stroke={notchesColor} stroke-width="10" />
            <line x1="429.205" y1="156" x2="455.186" y2="141" stroke={notchesColor} stroke-width="10" />
            <line x1="446" y1="256" x2="486" y2="256" stroke={fourthColor} stroke-width="15" />
            <line x1="429.205" y1="356" x2="455.186" y2="371" stroke={notchesColor} stroke-width="10" />
            <line x1="356" y1="429.205" x2="371" y2="455.186" stroke={notchesColor} stroke-width="10" />
            <line x1="256" y1="446" x2="256" y2="486" stroke={fourthColor} stroke-width="15" />
            <line x1="156" y1="429.205" x2="141" y2="455.186" stroke={notchesColor} stroke-width="10" />
            <line x1="82.795" y1="356" x2="56.814" y2="371" stroke={notchesColor} stroke-width="10" />
            <line x1="66" y1="256" x2="26" y2="256" stroke={fourthColor} stroke-width="15" />
            <line x1="82.795" y1="156" x2="56.814" y2="141" stroke={notchesColor} stroke-width="10" />
            <line x1="156" y1="82.795" x2="141" y2="56.814" stroke={notchesColor} stroke-width="10" />
          </g>
          <g>
            {/* lancette ore, minuti e secondi con relativo id per animazione in JavaScript */}
            <line x1="256" y1="256" x2="256" y2="430" stroke={handHoursColor} stroke-width="15" id={PrefixHours + componentId} />
            <line x1="256" y1="256" x2="256" y2="70" stroke={handMinutesColor} stroke-width="10" id={PrefixMinutes + componentId} />
            {showHandSeconds && <line x1="256" y1="256" x2="430" y2="256" stroke={handSecondsColor} stroke-width="5" id={PrefixSeconds + componentId} />}
          </g>
          <g>
            {/* cerchio lancette */}
            <circle cx="256" cy="256" r="15" fill={handPointColor} />
            {/* testi */}
            {isClockText && <text x="256" y="155" text-lenght="300" text-anchor="middle" className={styles.svgText} fill={clockTextColor}>{clockText}</text>}
            {showDigitalClock && <text x="256" y="357" text-lenght="300" text-anchor="middle" className={styles.svgText} fill={digitalClockColor} id={PrefixText + componentId}>00:00:00</text>}
          </g>
        </svg>


      </section>
    );
  }


  private setCoords = (centerX: number, centerY: number, elementId: string, num60: number, radius: number): void => {
    const rad = (Math.PI / 30) * (num60 + 45);

    const x = centerX + Math.cos(rad) * radius;
    const y = centerY + Math.sin(rad) * radius;
    //console.log(x, y);

    const elm = document.getElementById(elementId);
    if (elm) {
      // aggiorno le coordinate
      elm.setAttribute("x2", x.toString());
      elm.setAttribute("y2", y.toString());
    }
  };

  private updateClock = (): void => {
    const { componentId, showHandSeconds, showDigitalClock, showDigitalClockSeconds } = this.props;

    const width = 512;
    const height = 512;
    const centerX = width / 2;
    const centerY = height / 2;
    const dt = new Date();

    // second
    const radiusSecond = 200;
    const seconds = dt.getSeconds();
    if (showHandSeconds) {
      this.setCoords(centerX, centerY, PrefixSeconds + componentId, seconds, radiusSecond);
    }

    // minutes
    const radiusMinutes = 186;
    const minutes = dt.getMinutes();
    this.setCoords(centerX, centerY, PrefixMinutes + componentId, minutes, radiusMinutes);

    // hours
    const radiusHours = 150;
    const hours = dt.getHours();
    const hoursRad = (60 / 12) * (hours % 12) + (minutes * 5 / 60);
    this.setCoords(centerX, centerY, PrefixHours + componentId, hoursRad, radiusHours);

    // text

    if (showDigitalClock) {
      const elmClockText = document.getElementById(PrefixText + componentId);
      if (elmClockText) {
        elmClockText.innerHTML = (hours < 10 ? "0" : "") + hours
          + ":" + (minutes < 10 ? "0" : "") + minutes
          + (showDigitalClockSeconds ? ":" + (seconds < 10 ? "0" : "") + seconds : "");
      }
    }
  }


}