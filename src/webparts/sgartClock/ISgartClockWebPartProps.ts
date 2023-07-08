export interface ISgartClockWebPartProps {
    webpartTitle: string;
    size: number;

    backgroundColor: string;
    borderColor: string;

    showNotches: Notches,
    notches1Color: string;
    notches5Color: string;
    notches15Color: string;

    showHandSeconds: boolean;
    handHoursColor: string;
    handMinutesColor: string;
    handSecondsColor: string;
    handPointColor: string;

    clockTextReorder: Reorder;
    clockText: string;
    clockTextColor: string;

    digitalClockReorder: Reorder;
    showDigitalClockSeconds: boolean;
    digitalClockColor: string;
}

export enum Notches {
    None = "None",
    Minutes15 = "Minutes15",
    Minutes5 = "Minutes5",
    Minutes1 = "Minutes1"
}

export enum Reorder {
    Hidden = "Hidden",
    Foreground = "Foreground",
    Background = "Background"
}