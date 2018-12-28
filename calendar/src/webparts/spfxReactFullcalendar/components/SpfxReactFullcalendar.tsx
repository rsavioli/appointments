import * as React from 'react';
import styles from './SpfxReactFullcalendar.module.scss';
import { ISpfxReactFullcalendarProps } from './ISpfxReactFullcalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { Image } from 'office-ui-fabric-react/lib/Image';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { IPanelState } from './IPanelState';
import { ITask } from './ITask';
import { IImage } from './IImage';

import { TimePicker } from 'react-input-moment';

import * as $ from 'jquery';
import * as moment from 'moment';
import 'fullcalendar';
import * as FC from 'fullcalendar';

import 'react-times/css/material/default.css';
import 'react-times/css/classic/default.css';

import Utilities from '../utilities/utils';

require('./input.css');
require('../../../../node_modules/fullcalendar/dist/fullcalendar.min.css');

export default class SpfxReactFullcalendar extends React.Component<ISpfxReactFullcalendarProps, IPanelState> {

  constructor(props: ISpfxReactFullcalendarProps, state: IPanelState) {
    super(props);
    this.state = {
      showPanel: false,
      Title: "",
      StartDate: "",
      EndDate: "",
      AssetName: "",
      ImageUrl: "",
      m: moment(),
      _data: {}
    };
  }

  public componentDidMount(): void {
    // apply on save
    this.displayTasks();
  }

  public componentDidUpdate(): void {
    // apply on save
    this.displayTasks();
  }

  public onFocus(param): void {
    console.log(param)
  }

  public onBlur(param): void {
    console.log(param)
  }

  /* DatePicker */

  private _onParseDateFromString = (value: string): Date => {
    var parseDate = moment(value, 'DD/MM/YYYY');

    if (!parseDate.isValid()) return null;

    return parseDate.toDate();
  }

  public render(): React.ReactElement<ISpfxReactFullcalendarProps> {
    return (
      <div className={styles.spfxReactFullcalendar}>

        <div className="ms-Grid">
          <div style={{ marginBottom: '20px' }}></div>
          <div className="ms-Grid-row">
            <div id="calendar"></div>
          </div>
        </div>

        <Panel isBlocking={false} isOpen={this.state.showPanel} onDismiss={this.onPanelClosed.bind(this)} type={PanelType.custom}
          customWidth="500px" closeButtonAriaLabel="Close">
          <h2 className="ms-fontSize-xl">Apontamento</h2>

          <TextField
            label="Cliente"
            iconProps={{ iconName: 'People' }}
          />

          <TextField
            label="Matter"
            iconProps={{ iconName: 'CheckList' }}
          />

          <DatePicker
            label='Início'
            firstDayOfWeek={1}
            allowTextInput={true}
            strings={Utilities.DayPickerStrings}
            isRequired={true}
            parseDateFromString={this._onParseDateFromString}
          />

          <div className="wrapper">
            <TextField
              label="Horas"
              iconProps={{ iconName: 'Timer' }}
              value={Utilities.parseTime(this.state.m)}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              readOnly
            />
            <TimePicker
              moment={this.state.m}
              onChange={mom => this.setState({ m: mom })}
              showSeconds={false}
              locale="pt-br"
            />
          </div>

          <TextField
            label="Descrição"
            multiline
            resizable={false}
            iconProps={{ iconName: 'Message' }}
          />

          <div style={{ marginTop: '50px' }}>
            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg3">
              <DefaultButton
                style={{ backgroundColor: '#0078d4' }}
                primary={true}
                onClick={null}
                iconProps={{ iconName: 'Save' }}
                text='Salvar'
              />
            </div>

            <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg5">
              <DefaultButton
                style={{ backgroundColor: '#0078d4' }}
                primary={true}
                onClick={null}
                iconProps={{ iconName: 'Save' }}
                text='Salvar / Novo'
              />
            </div>

            <DefaultButton
              style={{ backgroundColor: '#c7e0f4', float: 'right' }}
              primary={true}
              onClick={null}
              iconProps={{ iconName: 'Cancel' }}
              text='Cancelar'
            />
          </div>
        </Panel>
      </div>
    );
  }

  private setShowPanel(showPanel: boolean) {
    this.setState({
      showPanel: showPanel
    });
  }

  private onPanelClosed() {
    this.setState({
      showPanel: false
    });
  }

  /* component adjust */

  private displayTasks(): void {
    $('#calendar').fullCalendar('destroy');
    $('#calendar').fullCalendar({
      weekends: true,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,basicWeek,basicDay'
      },
      displayEventTime: true,
      displayEventEnd: false,
      selectable: true,
      // open up the display form when a user clicks on an event
      eventClick: (calEvent: FC.EventObjectInput, jsEvent: MouseEvent, view: FC.View) => {

        const restQuery: string = `/_api/Web/Lists/GetByTitle('${escape(this.props.assetListName)}')/items(${calEvent.CarID})?$select=BookingImage`;
        this.props.spHttpClient.get(this.props.siteUrl + restQuery, SPHttpClient.configurations.v1, {
          headers: {
            'Accept': "application/json;odata.metadata=none"
          }
        })
          .then((response: SPHttpClientResponse): Promise<IImage> => {
            return response.json();
          })
          .then((item: IImage): void => {

            let imageUrl: string = "";
            if (item.BookingImage)
              imageUrl = item.BookingImage.Url;
            this.setState({
              Title: calEvent.title,
              StartDate: calEvent.CustomStartDate,
              EndDate: calEvent.CustomEndDate,
              AssetName: calEvent.AssetName,
              ImageUrl: imageUrl
            });

            this.setShowPanel(true);
          });
        return false;
      },
      // put the events on the calendar 
      events: (start: moment.Moment, end: moment.Moment, timezone: string, callback: Function): void => {
        let startDate: string = start.format('YYYY-MM-DD');
        startDate += 'T00:00:00.0000000Z';
        let endDate: string = end.format('YYYY-MM-DD');
        endDate += 'T00:00:00.0000000Z';

        const restQuery: string = `/_api/Web/Lists/GetByTitle('${escape(this.props.listName)}')/items?$select=*`;

        this.props.spHttpClient.get(this.props.siteUrl + restQuery, SPHttpClient.configurations.v1, {
          headers: {
            'Accept': "application/json;odata.metadata=none"
          }
        })
          .then((response: SPHttpClientResponse): Promise<{ value: ITask[] }> => {
            return response.json();
          })
          .then((data: { value: ITask[] }): void => {
            const events: FC.EventObjectInput[] = data.value.map((task: ITask): FC.EventObjectInput => {
              console.log(task.EventDate)
              return {
                title: task.Title,
                start: task.EventDate
              };
            });
            callback(events);
          });
      }
    });
  }

}
