export interface ISgartClockProps {
  componentId: string;
  title: string;
  size: number;
  
  showHandSeconds: boolean;
    
  backgroundColor: string;
  borderColor: string;
  notchesColor: string;
  fourthColor: string;
  handHoursColor: string;
  handMinutesColor: string;
  handSecondsColor: string;
  handPointColor: string;

  clockText:string;
  clockTextColor:string;

  showDigitalClock: boolean;
  showDigitalClockSeconds: boolean;
  digitalClockColor: string;


  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
