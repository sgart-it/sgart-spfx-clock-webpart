import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneSlider,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'SgartClockWebPartStrings';
import SgartClock from './components/SgartClock';
import { ISgartClockProps } from './components/ISgartClockProps';
import { ISgartClockWebPartProps } from './ISgartClockWebPartProps';

export default class SgartClockWebPart extends BaseClientSideWebPart<ISgartClockWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<ISgartClockProps> = React.createElement(
      SgartClock,
      {
        title: this.properties.webpartTitle,
        size: this.properties.size,

        showHandSeconds: this.properties.showHandSeconds,

        backgroundColor: this.properties.backgroundColor,
        borderColor: this.properties.borderColor,
        notchesColor: this.properties.notchesColor,
        fourthColor: this.properties.fourthColor,
        handHoursColor: this.properties.handHoursColor,
        handMinutesColor: this.properties.handMinutesColor,
        handSecondsColor: this.properties.handSecondsColor,
        handPointColor: this.properties.handPointColor,
        
        clockText: this.properties.clockText,
        clockTextColor: this.properties.clockTextColor,

        showDigitalClock: this.properties.showDigitalClock,
        showDigitalClockSeconds: this.properties.showDigitalClockSeconds,
        digitalClockColor: this.properties.digitalClockColor,


        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error('Unknown host');
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyHeaderDescription
          },
          groups: [
            {
              groupName: strings.PresentationGroupName,
              groupFields: [
                PropertyPaneTextField('webpartTitle', {
                  label: strings.WebPartTitleLabel
                }),
                PropertyPaneSlider('size', {
                  label: 'Size',
                  min: 0,
                  max: 1000
                }),
                PropertyPaneToggle('showHandSeconds',{
                  label: 'show hand seconds'
                }),

                PropertyPaneTextField('backgroundColor', {
                  label: "Background color"
                }),
                PropertyPaneTextField('borderColor', {
                  label: "Border color"
                }),
                PropertyPaneTextField('notchesColor', {
                  label: "Notches color"
                }),
                PropertyPaneTextField('fourthColor', {
                  label: "Fourth color"
                }),
                PropertyPaneTextField('handHoursColor', {
                  label: "Hand hours color"
                }),
                PropertyPaneTextField('handMinutesColor', {
                  label: "Hand minutes color"
                }),
                PropertyPaneTextField('handSecondsColor', {
                  label: "Hand seconds color"
                }),
                PropertyPaneTextField('handPointColor', {
                  label: "Hand point color"
                }),

                PropertyPaneTextField('clockText', {
                  label: "Text"
                }),
                PropertyPaneTextField('clockTextColor', {
                  label: "Text color"
                }),

                PropertyPaneToggle('showDigitalClock',{
                  label: 'Show digital clock'
                }),
                PropertyPaneToggle('showDigitalClockSeconds',{
                  label: 'Show digital clock seconds'
                }),
                PropertyPaneTextField('digitalClockColor', {
                  label: "Digital clock color"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
