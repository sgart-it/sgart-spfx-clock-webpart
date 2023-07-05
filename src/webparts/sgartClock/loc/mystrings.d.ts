declare interface ISgartClockWebPartStrings {
  PropertyHeaderDescription: string;
  PresentationGroupName: string;
  
  WebPartTitleLabel: string;

  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
}

declare module 'SgartClockWebPartStrings' {
  const strings: ISgartClockWebPartStrings;
  export = strings;
}
