import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import WithService from '../hoc/with-service';
import AvatarsTop from '../avatars/avatars-top';
import ProgressBar from '../progress-bar/progress-bar'
import DateTimeModalC from '../modals/date-time-modal-c';
import AuthModal from '../modals/authorization-modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

class PageHeader extends Component { 
  
  state = {
    dateTimeModalShow: false,
    authModalShow: false
  }

  //-------------------------------------------------------------------------

  handleDateTimeModalShow = () => {
    if (localStorage.getItem('watchword') === 'q9FGpS') {
      this.setState( () => { 
        return { dateTimeModalShow: true } 
      });
    }
  }

  //-------------------------------------------------------------------------

  handleAuthModalShow = () => {
    this.setState( () => { 
      return { authModalShow: true } 
    });
  }

  //-------------------------------------------------------------------------

  handleAuthModalClose = (stat) => {
    if (stat) {
      const inpName = document.querySelector('#inp-auth-name').value;
      const inpPass = document.querySelector('#inp-auth-password').value;
      if ((inpName === "master") && (inpPass === "masterkey" )) {
        localStorage.setItem('watchword', 'q9FGpS');
        localStorage.setItem('account', 'Мастер');
      } else if ((inpName === "admin") && (inpPass === "qwe" )) {
        localStorage.setItem('watchword', 'U3pk5m');
        localStorage.setItem('account', 'Администратор');
      } else if ((inpName === "leader") && (inpPass === "123" )) {
        localStorage.setItem('watchword', '6MqSLk');
        localStorage.setItem('account', 'Руководитель');
      } else {
        localStorage.removeItem('watchword');
        localStorage.removeItem('account');
      }
    }
    this.setState( () => { 
      return { authModalShow: false } 
    });
  }

  //-------------------------------------------------------------------------

  handleDateTimeModalClose = (stat) => {
    const { store } = this.props,
          { sourcedata } = store;
    if (stat) {
      let duration = sourcedata.duration;
      const durationInp = document.querySelector('#inp-duration').value;
      if (durationInp !== "") {
        let durDays = durationInp.split('-')[0],
            durTime = durationInp.split('-')[1],
            durHour = durTime.split(':')[0],
            durMins = durTime.split(':')[1];
        if (( !isNaN(durDays) ) && ( !isNaN(durHour) ) && ( !isNaN(durMins) )) {
          durDays = (durDays.length === 2) ? durDays : '0'+ durDays;
          durHour = (durHour.length === 2) ? durHour : '0'+ durHour;
          durMins = (durMins.length === 2) ? durMins : '0'+ durMins;
          durDays = (durDays.length > 2) ? durDays.slice(-2) : durDays;
          durHour = (durHour.length > 2) ? durHour.slice(-2) : durHour;
          durMins = (durMins.length > 2) ? durMins.slice(-2) : durMins;
          duration = `${durDays}-${durHour}:${durMins}`;
        }
      } 

      const dateTime = document.querySelector('#datetimeC').value,
            { dateH, timeH } = this.props.infoService.getRemadedDateTimeToSourcedata(dateTime),
            newSourcedata = { ...sourcedata,
                              dateH,
                              timeH,
                              duration };

      this.props.infoService.patchSourcedata (newSourcedata);
      this.props.sourcedataLoaded(newSourcedata);

console.log(`handleDateTimeModalClose - dateTime = ${dateTime}`);

      if (document.querySelector('#clear-switch').checked) {
        this.clearInteredData( this.props.store.documents );
      }
    } 

    this.setState( () => { 
      return { dateTimeModalShow: false } 
    });
  }


  //-------------------------------------------------------------------------

  clearInteredData =  (docs) => {
    const newDocs = docs.map( doc => {
      const newReceivedTime = doc.receivedTime.map( ctragt => {
        const newCtragt = { ...ctragt,
                            received: "",
                            executed: [],
                            checkPlan: "" };
        return newCtragt;
      });
      const newDeliveryTime = doc.deliveryTime.map( ctragt => {
        const newCtragt = { ...ctragt,
                            delivery: "",
                            executed: [],
                            checkPlan: ""  };
        return newCtragt;
      });
      const newDoc = { id: doc.id,
                      eventId: doc.eventId,
                      sectionsId: doc.sectionsId,
                      title: doc.title,
                      alias: doc.alias,
                      type: doc.type,
                      start: doc.start,
                      end: doc.end,
                      everydayTimePresents: (doc.everydayTimePresents != null) ? doc.everydayTimePresents : [],
                      receivedTime: newReceivedTime,
                      deliveryTime: newDeliveryTime,
                      everydayCurrentPeriod: ""};
      
      setTimeout( () => {this.props.infoService.patchDoc(newDoc);}, (100 * +doc.id)); 
      this.props.addDocToDocuments (newDoc);
      return newDoc;
    });
    localStorage.removeItem('docsAlert');
  } 
  
  //-------------------------------------------------------------------------
  //-------------------------------------------------------------------------


  render () {

    const { headerTitle } = this.props,
          { dateTimeH, durationH, today, sourcedata } = this.props.store;

    const { dayRes, monthRes, yearRes, timeRes } = this.props.infoService.getDateTimeHStr(dateTimeH),
          { hours, mins } = this.props.infoService.getDurationHours(durationH),
          width = this.props.infoService.getWidthProgressBar(dateTimeH, durationH, today),
          availableDateTime = `${ sourcedata.dateH }T${ sourcedata.timeH }`,
          duration = sourcedata.duration;
    const watchword = localStorage.getItem('watchword');
    let klassButton = (( watchword === 'q9FGpS') || ( watchword === 'U3pk5m') ) ? "btn-primary" : "";
    const accountTooltip = (localStorage.getItem('account') !== null) ? localStorage.getItem('account') : "Не авторизован";

    return (
      <>
        <AuthModal 
          show={ this.state.authModalShow }
          onHide={ this.handleAuthModalClose }
        />

        <DateTimeModalC
          title={ "Время получения сигнала:" }
          availableDateTime={ availableDateTime } 
          duration={ duration }
          show={ this.state.dateTimeModalShow }
          onHide={ this.handleDateTimeModalClose }
        />

        <div className="page-header">
          <div id="scrollto" className="d-flex justify-content-between align-items-center" >
            <h1>{ headerTitle }</h1>
              <OverlayTrigger
                  placement="top"
                  delay={{ show: 50, hide: 50 }}
                  overlay={
                    <Tooltip id="tt-top" className="" >
                        <strong>{ accountTooltip }</strong>
                    </Tooltip>
                    }
              >
                <button className={ `btn btn-round d-print-none ${ klassButton }` } 
                        onClick={ this.handleAuthModalShow } >
                  <i className="material-icons" style={{"fontSize": "1.8rem"}} >how_to_reg</i>
                </button>
              </OverlayTrigger>
              
          </div>
          <p className="lead p-hvr" onClick={ this.handleDateTimeModalShow } style={{ "cursor": "pointer" }} >
            {`Исходные данные: сигнал поступил - ${dayRes} ${monthRes} ${yearRes} г., 
              в ${timeRes}, продолжительность работы - ${hours} ${mins}`}
          </p>
          <AvatarsTop /> 
          <ProgressBar propsData={ {width, hours, mins} }/> 
        </div> 
      </>
    )
  }
}

const mapStateToProps = ( store ) => {
  return { store }
}

const mapDispatchToProps = actions;

export default WithService ()( connect(mapStateToProps, mapDispatchToProps)(PageHeader) );