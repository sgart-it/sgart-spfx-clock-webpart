import { Notches, Reorder } from "../ISgartClockWebPartProps";

export interface ISgartClockProps {
  title: string;
  size: number;
  
  showHandSeconds: boolean;
    
  backgroundColor: string;
  borderColor: string;

  showNotches: Notches,
  notches1Color: string;
  notches5Color: string;
  notches15Color: string;

  handHoursColor: string;
  handMinutesColor: string;
  handSecondsColor: string;
  handPointColor: string;

  clockTextReorder: Reorder;
  clockText:string;
  clockTextColor:string;

  digitalClockReorder: Reorder;
  showDigitalClockSeconds: boolean;
  digitalClockColor: string;


  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
