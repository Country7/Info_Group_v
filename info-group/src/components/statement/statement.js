import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import WithService from '../hoc/with-service';
import PageHeader from '../pages/page-header';
import StatTableGovernance from './stat-table-governance';
import StatTableGroups from './stat-table-groups';
import StatTableCtragts from './stat-table-ctragts';
import DateTimeModalClass from '../modals/date-time-modal-class';
import DateTimePeriodModalClass from '../modals/date-time-period-modal';

class Statement extends Component {
  state = {
    classTable: [
      'table-danger',
      'table-warning',
      'table-success',
      'table-primary',
      'table-info',
      'table-secondary'
    ],
    dateTimeModalShow: false,
    dateTimePeriodModalShow: false,
    docId: "", 
    received: true, 
    ctragtId: "", 
    dateTimeModalTitle: "", 
    availableDateTime: "",
    availableExecuted: [],
    docsAlert: false,
  }

  //-------------------------------------------------------------------------

  componentDidMount() {
    this.verticalScroll();
  }

  //-------------------------------------------------------------------------

  verticalScroll = () => {
    const cardsFlashing = document.querySelectorAll('.card-body-flash');
    localStorage.setItem('docsAlert', cardsFlashing.length);

    const scrollTarget = cardsFlashing[0];
    if ( scrollTarget != null ) {
      setTimeout( () => {
        const topOffset = 80, 
              elementPosition = scrollTarget.getBoundingClientRect().top,
              offsetPosition = window.pageYOffset + elementPosition - topOffset;
        window.scrollTo(0, offsetPosition);
        this.props.setOffsetTop(offsetPosition);
      }, 800);
    }
  }

  //-------------------------------------------------------------------------

  verticalScrollDelay = () => {
    setTimeout( () => {
      const cardsFlashing = document.querySelectorAll('.card-body-flash');
      localStorage.setItem('docsAlert', cardsFlashing.length);

      const scrollTarget = cardsFlashing[0];
      if ( scrollTarget != null ) {
        const topOffset = 80, 
              elementPosition = scrollTarget.getBoundingClientRect().top,
              offsetPosition = window.pageYOffset + elementPosition - topOffset;
        if (offsetPosition !== this.props.store.offsetTop) {
          window.scrollTo(0, offsetPosition);
          this.props.setOffsetTop(offsetPosition);
        }
      }
    }, 2500);
  }

  //-------------------------------------------------------------------------

  horizontalScrollTable = () => {
    setTimeout( () => {
      const table = document.querySelector("#table-groups"),
            tdsNameDoc = document.querySelectorAll('.name-doc'),
            tdReceived = document.querySelector('#td-received');
      if ((table !== null) && (tdsNameDoc !== null) && (tdReceived !== null)) {
        let tdsNameDocFlashing = null;
        tdsNameDoc.forEach( tds => {
          if ((tds.classList.contains('card-body-flash')) && (tdsNameDocFlashing == null)) {
            tdsNameDocFlashing = tds;
          }
        })
        if (tdsNameDocFlashing !== null) {
          let offsetLeft = tdsNameDocFlashing.offsetLeft - tdsNameDocFlashing.offsetWidth * 2 - tdReceived.offsetWidth;
          if (offsetLeft < 0) { offsetLeft = 0 }
          if (offsetLeft !== this.props.store.offsetLeft) {
            table.parentNode.scrollLeft = offsetLeft;
            this.props.setOffsetLeft(offsetLeft);
          }
        }
      }
    }, 2500);
  }
  
  //-------------------------------------------------------------------------

  handleDateTimeModalShow = (docId, received, ctragtId, dateTimeModalTitle, availableDateTime, docEnd) => {
    const documents = this.props.store.documents;
    if ((localStorage.getItem('watchword') === 'q9FGpS') || (localStorage.getItem('watchword') === 'U3pk5m')) {
      this.setState( () => { 
        return { docId, 
                received, 
                ctragtId, 
                dateTimeModalTitle, 
                availableDateTime } 
      });
      if (docEnd !== "") { 
        this.setState( () => { 
          return { dateTimeModalShow: true } 
        });
      } else {             
        const availableExecuted = this.props.infoService.getAvailablePeriods(documents, docId, received, ctragtId);

        let executed = [];
        availableExecuted.forEach( exec => {
          const firstDate = this.props.infoService.getRemadedDateTime( exec.period.split('=')[0]).remadedDate,
                firstTime = this.props.infoService.getRemadedDateTime( exec.period.split('=')[0]).remadedTime,
                secondDate = this.props.infoService.getRemadedDateTime( exec.period.split('=')[1]).remadedDate,
                secondTime = this.props.infoService.getRemadedDateTime( exec.period.split('=')[1]).remadedTime,
                periodStr = `${firstDate} ${firstTime} - ${secondDate} ${secondTime}`
          executed.unshift({ ...exec, periodStr });
        })

        this.setState( () => { 
          return { dateTimePeriodModalShow: true,
                  availableExecuted: executed } 
        });
      }
    }
  }

  //-------------------------------------------------------------------------

  handleDateTimeModalClose = (stat) => {
    if (stat) {
      const dateTime = document.querySelector('#datetime').value;
      if (this.state.received) {
        if (document.querySelector('#all-ctragts-switch').checked) {
          this.patchDocsReceivedTime (this.state.docId, dateTime);
        } else {
          this.patchDocsReceived(this.state.docId, this.state.ctragtId, dateTime);
        }
        this.props.updateDatas();
      } else {
        if (document.querySelector('#all-ctragts-switch').checked) {
          this.patchDocsDeliveryTime (this.state.docId, dateTime);
        } else {
          this.patchDocsDelivery(this.state.docId, this.state.ctragtId, dateTime);
        }
        this.props.updateDatas();
      }
      this.verticalScrollDelay();
      this.horizontalScrollTable();
    }
    this.setState( () => { 
      return { dateTimeModalShow: false } 
    });
  }

  //-------------------------------------------------------------------------

  handleDateTimePeriodModalClose = (stat) => {
    if (stat) {
      const dateTime = document.querySelector('#datetime-period').value,
            period = document.querySelector('#select-period').value,
            execIn = { period: period, time: dateTime };
console.log(`handleDateTimePeriodModalClose - period = ${period}, dateTime = ${dateTime}`);

      if (this.state.received) {
        if (document.querySelector('#all-ctragts-period-switch').checked) {
          this.patchDocsReceivedTimeExecutedAllCtragts(this.state.docId, execIn);
        } else {
          this.patchDocsReceivedTimeExecuted (this.state.docId, this.state.ctragtId, execIn);
        }
      } else {
        if (document.querySelector('#all-ctragts-period-switch').checked) {
          this.patchDocsDeliveryTimeExecutedAllCtragts(this.state.docId, execIn);
        } else {
          this.patchDocsDeliveryTimeExecuted (this.state.docId, this.state.ctragtId, execIn);
        }
      }
      this.props.updateDatas();
      this.verticalScrollDelay();
      this.horizontalScrollTable();
    }
    this.setState( () => { 
      return { dateTimePeriodModalShow: false } 
    });
  }

  //-------------------------------------------------------------------------

  patchDocsReceived = (docId, ctragtId, dateTime) => {
    const docAvailable = this.props.store.documents.find( doc => doc.id === docId);
    const ctragtIndex = docAvailable.receivedTime.findIndex( ctragt => ctragt.ctragtId === ctragtId ), 
          ctragtInDoc = docAvailable.receivedTime.find( ctragt => ctragt.ctragtId === ctragtId ),
          newCtragt = { ...ctragtInDoc, received: dateTime },
          newAllCtragts =  [
            ...docAvailable.receivedTime.slice(0, ctragtIndex),
            newCtragt,
            ...docAvailable.receivedTime.slice(ctragtIndex + 1),
            ],
          newDoc = {
            ...docAvailable,
            receivedTime: newAllCtragts
          };
    this.props.infoService.patchDoc (newDoc);
    this.props.addDocToDocuments (newDoc);
  }

  //-------------------------------------------------------------------------

  patchDocsReceivedTime = (docId, dateTime) => {
    const docAvailable = this.props.store.documents.find( doc => doc.id === docId);
    const newReceivedTime = docAvailable.receivedTime.map( ctragt => {
      return { ...ctragt, received: dateTime }
    })
    const newDoc = { ...docAvailable, receivedTime: newReceivedTime };
    this.props.infoService.patchDoc (newDoc);
    this.props.addDocToDocuments (newDoc);
  }

  //-------------------------------------------------------------------------

  patchDocsReceivedTimeExecuted = (docId, ctragtId, execIn) => {
    const docAvailable = this.props.store.documents.find( doc => doc.id === docId);
    const ctragtIndex = docAvailable.receivedTime.findIndex( ctragt => ctragt.ctragtId === ctragtId ), 
          ctragtInDoc = docAvailable.receivedTime.find( ctragt => ctragt.ctragtId === ctragtId );

    const execIndex = ctragtInDoc.executed.findIndex( exec => exec.period == execIn.period);
    let newExecuted = ctragtInDoc.executed;
    if (execIndex == -1) { 
      newExecuted.push(execIn); 
    } else { 
      newExecuted = ctragtInDoc.executed.map( exec => {
        if (exec.period == execIn.period) {
          return execIn;
        } else {
          return exec;
        }
      });
    }
    
    const newCtragt = { ...ctragtInDoc, executed: newExecuted },
          newAllCtragts =  [
            ...docAvailable.receivedTime.slice(0, ctragtIndex),
            newCtragt,
            ...docAvailable.receivedTime.slice(ctragtIndex + 1),
            ],
          newDoc = {
            ...docAvailable,
            receivedTime: newAllCtragts
          };
    this.props.infoService.patchDoc (newDoc);
    this.props.addDocToDocuments (newDoc);
  }

  //-------------------------------------------------------------------------

  patchDocsReceivedTimeExecutedAllCtragts =  (docId, execIn) => {
    const docAvailable = this.props.store.documents.find( doc => doc.id === docId);
    const newReceivedTime = docAvailable.receivedTime.map( ctragt => {
      const execIndex = ctragt.executed.findIndex( exec => exec.period == execIn.period);
      let newExecuted = ctragt.executed;
      if (execIndex == -1) { 
        newExecuted.push(execIn); 
      } else { 
        newExecuted = ctragt.executed.map( exec => {
          if (exec.period == execIn.period) {
            return execIn;
          } else {
            return exec;
          }
        });
      }
      return { ...ctragt, executed: newExecuted }
    });
    const newDoc = {
            ...docAvailable,
            receivedTime: newReceivedTime
          };
    this.props.infoService.patchDoc (newDoc);
    this.props.addDocToDocuments (newDoc);
  }

  //-------------------------------------------------------------------------
  //-------------------------------------------------------------------------

  patchDocsDelivery = (docId, ctragtId, dateTime) => {
    const docAvailable = this.props.store.documents.find( doc => doc.id === docId);
    const ctragtIndex = docAvailable.deliveryTime.findIndex( ctragt => ctragt.ctragtId === ctragtId ), 
          ctragtInDoc = docAvailable.deliveryTime.find( ctragt => ctragt.ctragtId === ctragtId ),
          newCtragt = { ...ctragtInDoc, delivery: dateTime },
          newAllCtragts =  [
            ...docAvailable.deliveryTime.slice(0, ctragtIndex),
            newCtragt,
            ...docAvailable.deliveryTime.slice(ctragtIndex + 1),
            ],
          newDoc = {
            ...docAvailable,
            deliveryTime: newAllCtragts
          };
    this.props.infoService.patchDoc (newDoc);
    this.props.addDocToDocuments (newDoc);
  }

  //-------------------------------------------------------------------------

  patchDocsDeliveryTime = (docId, dateTime) => {
    const docAvailable = this.props.store.documents.find( doc => doc.id === docId);
    const newDeliveryTime = docAvailable.deliveryTime.map( ctragt => {
      return { ...ctragt, delivery: dateTime }
    })
    const newDoc = { ...docAvailable, deliveryTime: newDeliveryTime };
    this.props.infoService.patchDoc (newDoc);
    this.props.addDocToDocuments (newDoc);
  }

  //-------------------------------------------------------------------------

  patchDocsDeliveryTimeExecuted = (docId, ctragtId, execIn) => {
    const docAvailable = this.props.store.documents.find( doc => doc.id === docId);
    const ctragtIndex = docAvailable.deliveryTime.findIndex( ctragt => ctragt.ctragtId === ctragtId ), 
          ctragtInDoc = docAvailable.deliveryTime.find( ctragt => ctragt.ctragtId === ctragtId );

    const execIndex = ctragtInDoc.executed.findIndex( exec => exec.period == execIn.period);
    let newExecuted = ctragtInDoc.executed;
    if (execIndex == -1) { 
      newExecuted.push(execIn); 
    } else { 
      newExecuted = ctragtInDoc.executed.map( exec => {
        if (exec.period == execIn.period) {
          return execIn;
        } else {
          return exec;
        }
      });
    }
    
    const newCtragt = { ...ctragtInDoc, executed: newExecuted },
          newAllCtragts =  [
            ...docAvailable.deliveryTime.slice(0, ctragtIndex),
            newCtragt,
            ...docAvailable.deliveryTime.slice(ctragtIndex + 1),
            ],
          newDoc = {
            ...docAvailable,
            deliveryTime: newAllCtragts
          };
    this.props.infoService.patchDoc (newDoc);
    this.props.addDocToDocuments (newDoc);
  }

  //-------------------------------------------------------------------------

  patchDocsDeliveryTimeExecutedAllCtragts = (docId, execIn) => {
    const docAvailable = this.props.store.documents.find( doc => doc.id === docId);
    const newDeliveryTime = docAvailable.deliveryTime.map( ctragt => {
      const execIndex = ctragt.executed.findIndex( exec => exec.period == execIn.period);
      let newExecuted = ctragt.executed;
      if (execIndex == -1) { 
        newExecuted.push(execIn); 
      } else { 
        newExecuted = ctragt.executed.map( exec => {
          if (exec.period == execIn.period) {
            return execIn;
          } else {
            return exec;
          }
        });
      }
      return { ...ctragt, executed: newExecuted };
    });

    const newDoc = {
            ...docAvailable,
            deliveryTime: newDeliveryTime
          };
    this.props.infoService.patchDoc (newDoc);
    this.props.addDocToDocuments (newDoc);
  }

  //-------------------------------------------------------------------------
  //-------------------------------------------------------------------------

  render () {  

    const docs = this.props.store.docs;

    if (docs == "") {
      return;
    }


    return (
      <>
        <PageHeader 
          headerTitle={'Ведомость контроля прохождения информации'} />

        <DateTimeModalClass 
            docId={ this.state.docId } 
            title={ this.state.dateTimeModalTitle } 
            availableDateTime={ this.state.availableDateTime }
            show={ this.state.dateTimeModalShow }
            onHide={ this.handleDateTimeModalClose }
        />

        <DateTimePeriodModalClass 
            docId={ this.state.docId } 
            title={ this.state.dateTimeModalTitle } 
            availableDateTime={ this.state.availableDateTime }
            show={ this.state.dateTimePeriodModalShow }
            onHide={ this.handleDateTimePeriodModalClose }
            availableExecuted={ this.state.availableExecuted }
        />

        <StatTableGovernance 
          classTable={ this.state.classTable[0]} 
          docsStatement={ docs } 
          handleDateTimeModalShow={ this.handleDateTimeModalShow }
        />
        
        <StatTableGroups 
          classTable={ this.state.classTable[4]} 
          docsStatement={ docs } 
          handleDateTimeModalShow={ this.handleDateTimeModalShow }
        />
        
        <StatTableCtragts 
          classTable={ this.state.classTable[2]} 
          docsStatement={ docs } 
          handleDateTimeModalShow={ this.handleDateTimeModalShow }
        />
        
      </>
    )
  }
}

const mapStateToProps = (store) => {
  return { store }
}

const mapDispatchToProps = actions;

export default WithService ()( connect(mapStateToProps, mapDispatchToProps)(Statement) );


