import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneLink,
  PropertyPaneSlider,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'SgartClockWebPartStrings';
import SgartClock from './components/SgartClock';
import { ISgartClockProps } from './components/ISgartClockProps';
import { ISgartClockWebPartProps, Notches, Reorder } from './ISgartClockWebPartProps';

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

        showNotches: this.properties.showNotches,
        notches1Color: this.properties.notches1Color,
        notches5Color: this.properties.notches5Color,
        notches15Color: this.properties.notches15Color,
        handHoursColor: this.properties.handHoursColor,
        handMinutesColor: this.properties.handMinutesColor,
        handSecondsColor: this.properties.handSecondsColor,
        handPointColor: this.properties.handPointColor,

        clockTextReorder: this.properties.clockTextReorder,
        clockText: this.properties.clockText,
        clockTextColor: this.properties.clockTextColor,

        digitalClockReorder: this.properties.digitalClockReorder,
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
    const notchesOptions = Object.keys(Notches)
      .map(item => { return { key: item, text: item } });

    const reorderOptions = Object.keys(Reorder)
      .map(item => { return { key: item, text: item } });

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

                PropertyPaneTextField('backgroundColor', {
                  label: "Background color"
                }),
                PropertyPaneTextField('borderColor', {
                  label: "Border color"
                }),
              ]
            },
            {
              groupName: strings.NotchesGroupName,
              groupFields: [
                PropertyPaneDropdown('showNotches', {
                  label: "Show",
                  options: notchesOptions
                }),

                PropertyPaneTextField('notches1Color', {
                  label: "1 minutes color"
                }),
                PropertyPaneTextField('notches5Color', {
                  label: "5 minutes color"
                }),
                PropertyPaneTextField('notches15Color', {
                  label: "15 minutes color"
                })
              ]
            },
            {
              groupName: strings.HandsGroupName,
              groupFields: [
                PropertyPaneTextField('handHoursColor', {
                  label: "Hours color"
                }),
                PropertyPaneTextField('handMinutesColor', {
                  label: "Minutes color"
                }),
                PropertyPaneTextField('handSecondsColor', {
                  label: "Seconds color"
                }),
                PropertyPaneTextField('handPointColor', {
                  label: "Hand point color"
                }),
                PropertyPaneToggle('showHandSeconds', {
                  label: 'Show seconds'
                })
              ]
            },
            {
              groupName: strings.TextGroupName,
              groupFields: [
                PropertyPaneDropdown('clockTextReorder', {
                  label: "Reorder",
                  options: reorderOptions
                }),
                PropertyPaneTextField('clockText', {
                  label: "Text"
                }),
                PropertyPaneTextField('clockTextColor', {
                  label: "Text color"
                })]
            },
            {
              groupName: strings.DigitalClockGroupName,
              groupFields: [
                PropertyPaneDropdown('digitalClockReorder', {
                  label: "Reorder",
                  options: reorderOptions
                }),
                PropertyPaneToggle('showDigitalClockSeconds', {
                  label: 'Show seconds'
                }),
                PropertyPaneTextField('digitalClockColor', {
                  label: "Color"
                })
              ]
            },
            {
              groupName: strings.AboutGroupName,
              groupFields: [
                PropertyPaneLink('linkField', {
                  text: "Sgart.it",
                  href: "https://www.sgart.it/IT/informatica/orologio-svg-javascript/post",
                  target: "_blank"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
