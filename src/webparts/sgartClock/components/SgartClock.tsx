import * as React from 'react';
import styles from './SgartClock.module.scss';
import { ISgartClockProps } from './ISgartClockProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { isNullOrWhiteSpace } from '../Helper';
import { Notches, Reorder } from '../ISgartClockWebPartProps';

const RADIANT_1 = Math.PI / 30;
const SIZE = 512;
const CENTER = SIZE / 2;
const RADIUS_MAX = CENTER - 25;
const NOTCHES_LENGHT_1 = 10;
const NOTCHES_LENGHT_5 = 30;
const NOTCHES_LENGHT_15 = 40;
const NOTCHES_WIDTH_1 = 5;
const NOTCHES_WIDTH_5 = 10;
const NOTCHES_WIDTH_15 = 15;

export default class SgartClock extends React.Component<ISgartClockProps, {}> {

  private hourRef = React.createRef<SVGLineElement>();
  private minuteRef = React.createRef<SVGLineElement>();
  private secondRef = React.createRef<SVGLineElement>();
  private digitalClockRef = React.createRef<SVGTextElement>();
  private arrMinutes: number[] = [];

  public constructor(props: ISgartClockProps) {
    super(props);

    for (let i = 0; i < 60; i++)
      this.arrMinutes.push(i);
  }

  componentDidMount(): void {
    setInterval(this.updateClock, 250);

    this.updateClock();
  }

  public render(): React.ReactElement<ISgartClockProps> {
    const {
      title,
      size,
      showHandSeconds,
      backgroundColor,
      borderColor,
      handHoursColor,
      handMinutesColor,
      handSecondsColor,
      handPointColor,
      clockTextReorder,
      clockText,
      clockTextColor,
      digitalClockReorder,
      digitalClockColor,
      //isDarkTheme,
      //environmentMessage,
      hasTeamsContext,
      //userDisplayName
    } = this.props;

    const isTitleVisible = !isNullOrWhiteSpace(title);
    const sizeStr = size <= 0 ? "100%" : `${size}px`;

    return (
      <section className={`${styles.sgartClock} ${hasTeamsContext ? styles.teams : ''}`}>
        {isTitleVisible && (
          <div className={styles.title}>
            <span role="heading">{escape(title)}</span>
          </div>
        )}
        <svg version="1.1" viewBox={`0 0 ${SIZE} ${SIZE}`} xmlns="http://www.w3.org/2000/svg" width={sizeStr} height={sizeStr}>
          {/* sfondo e bordo esterno */}
          <g>
            <circle cx="256" cy="256" r="255" fill={borderColor} />
            <circle cx="256" cy="256" r="240" fill={backgroundColor} />
          </g>
          {this.getNotchesMinutes()}
          {/* text and digital clock background */}
          <g>
            {clockTextReorder === Reorder.Background &&
              <text x="256" y="155" text-lenght="300" text-anchor="middle" className={styles.svgText} fill={clockTextColor}>{clockText}</text>
            }
            {digitalClockReorder === Reorder.Background &&
              <text x="256" y="357" text-lenght="300" text-anchor="middle" className={styles.svgText} fill={digitalClockColor} ref={this.digitalClockRef}>00:00:00</text>
            }
          </g>
          {/* lancette ore, minuti e secondi con relativo id per animazione in JavaScript */}
          <g>
            <line x1="256" y1="256" x2="256" y2="430" stroke={handHoursColor} stroke-width="15" ref={this.hourRef} />
            <line x1="256" y1="256" x2="256" y2="70" stroke={handMinutesColor} stroke-width="10" ref={this.minuteRef} />
            {showHandSeconds && <line x1="256" y1="256" x2="430" y2="256" stroke={handSecondsColor} stroke-width="5" ref={this.secondRef} />}
            <circle cx="256" cy="256" r="15" fill={handPointColor} />
          </g>
          {/* text and digital clock foreground */}
          <g>
            {clockTextReorder === Reorder.Foreground &&
              <text x="256" y="155" text-lenght="300" text-anchor="middle" className={styles.svgText} fill={clockTextColor}>{clockText}</text>
            }
            {digitalClockReorder === Reorder.Foreground &&
              <text x="256" y="357" text-lenght="300" text-anchor="middle" className={styles.svgText} fill={digitalClockColor} ref={this.digitalClockRef}>00:00:00</text>
            }
          </g>
        </svg>


      </section>
    );
  }

  private getNotchesMinutes = (): React.ReactElement<SVGAElement> => {
    const { showNotches, notches1Color, notches5Color, notches15Color } = this.props;

    if (showNotches === Notches.None) {
      return (<g />);
    }

    const elements = this.arrMinutes.map((_, index) => {

      let len = NOTCHES_LENGHT_1;
      let w = NOTCHES_WIDTH_1;
      let color = notches1Color;
      let show: boolean = showNotches === Notches.Minutes1;

      if (index === 0 || index === 15 || index === 30 || index === 45) {
        len = NOTCHES_LENGHT_15;
        w = NOTCHES_WIDTH_15;
        color = notches15Color;
        show = showNotches === Notches.Minutes15 || showNotches === Notches.Minutes5 || showNotches === Notches.Minutes1;
      } else if (index === 5 || index === 10 || index === 20 || index === 25
        || index === 35 || index === 40 || index === 50 || index === 55) {
        len = NOTCHES_LENGHT_5;
        w = NOTCHES_WIDTH_5;
        color = notches5Color;
        show = showNotches === Notches.Minutes5 || showNotches === Notches.Minutes1;
      }

      if (show === false) {
        return null;
      }

      const rad = RADIANT_1 * (index + 45);
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      const radius1 = RADIUS_MAX - len;
      const x1 = CENTER + cos * radius1;
      const y1 = CENTER + sin * radius1;

      const radius2 = RADIUS_MAX;
      const x2 = CENTER + cos * radius2;
      const y2 = CENTER + sin * radius2;
      return (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} stroke-width={w} key={index} />
      );
    });

    return (
      <g> {elements}</g >
    );
  }

  private setCoordsRefs = (element: React.RefObject<SVGLineElement>, num60: number, radius: number): void => {
    const rad = RADIANT_1 * (num60 + 45);

    const x = CENTER + Math.cos(rad) * radius;
    const y = CENTER + Math.sin(rad) * radius;

    if (element?.current) {
      // aggiorno le coordinate
      element.current.setAttribute("x2", x.toString());
      element.current.setAttribute("y2", y.toString());
    }
  };


  private updateClock = (): void => {
    const { digitalClockReorder, showHandSeconds, showDigitalClockSeconds } = this.props;

    const dt = new Date();

    // second
    const radiusSecond = 210;
    const seconds = dt.getSeconds();
    if (showHandSeconds) {
      this.setCoordsRefs(this.secondRef, seconds, radiusSecond);
    }

    // minutes
    const radiusMinutes = 186;
    const minutes = dt.getMinutes();
    this.setCoordsRefs(this.minuteRef, minutes, radiusMinutes);

    // hours
    const radiusHours = 150;
    const hours = dt.getHours();
    const hoursRad = (60 / 12) * (hours % 12) + (minutes * 5 / 60);
    this.setCoordsRefs(this.hourRef, hoursRad, radiusHours);

    // text

    if (digitalClockReorder !== Reorder.Hidden) {
      if (this.digitalClockRef.current) {
        this.digitalClockRef.current.innerHTML = (hours < 10 ? "0" : "") + hours
          + ":" + (minutes < 10 ? "0" : "") + minutes
          + (showDigitalClockSeconds ? ":" + (seconds < 10 ? "0" : "") + seconds : "");
      }
    }
  }


}
