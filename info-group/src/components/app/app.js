import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import * as actions from '../../actions/actions';
import WithService from '../hoc/with-service';

import DocsProgress from '../docs-progress/docs-progress';
import AppHeader from '../app-header';
import Statement from '../statement';
import Statistics from '../statistics';
import InfoForms from '../forms/forms';


class App extends Component {

  state = {
    time: "00:00:00",
    amPm: "am"
  }; 

  //-------------------------------------------------------------------------

  componentDidMount() {
    this.firstLoadDatas();
    
    setTimeout( () => {this.updateDatas()}, 400);
    this.timerId = setInterval(() => {
      this.updateDatas();
    } , 1000);

    const cardsFlashing = document.querySelectorAll('.card-body-flash');
    localStorage.setItem('docsAlert', cardsFlashing.length);

    this.timerCardsFlash = setInterval(() => {
      const cardsFlashing = document.querySelectorAll('.card-body-flash');
      
      if (cardsFlashing.length !== +localStorage.getItem('docsAlert')) {
        if (cardsFlashing.length > +localStorage.getItem('docsAlert')) {
          const audioAlert = document.querySelector('#snd-alert');
          audioAlert.currentTime = 0;
          audioAlert.volume = 0.2;
          audioAlert.muted = false;
          audioAlert.play();

          const scrollTarget = cardsFlashing[0];
          if ( scrollTarget != null ) {
            setTimeout( () => {
              const topOffset = ( scrollTarget.classList.contains("card-body") ) ? 105 : 80, 
                    elementPosition = scrollTarget.getBoundingClientRect().top,
                    offsetPosition = window.pageYOffset + elementPosition - topOffset;
              window.scrollTo(0, offsetPosition);
              this.props.setOffsetTop(offsetPosition);
            }, 1000);

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
                table.parentNode.scrollLeft = offsetLeft;
                this.props.setOffsetLeft(offsetLeft);
              }
            }
          }
        }
        localStorage.setItem('docsAlert', cardsFlashing.length);
      }
    } , 500);
  }

  //-------------------------------------------------------------------------
  
  componentWillUnmount() {
    clearInterval(this.timerId)
    clearInterval(this.timerCardsFlash)
  };

  //-------------------------------------------------------------------------
  
  firstLoadDatas = () => {
    this.getTime();

    const { 
      sourcedataLoaded,
      sectionsLoaded,
      counteragentsLoaded,
      documentsLoaded,
      eventsLoaded } = this.props;
    this.props.infoService.getSourcedata ()
      .then( res => sourcedataLoaded(res));
    this.props.infoService.getSections ()
      .then( res => sectionsLoaded(res));
    this.props.infoService.getCounteragents ()
      .then( res => counteragentsLoaded(res));
    this.props.infoService.getDocuments ()
      .then( res => documentsLoaded(res));
    this.props.infoService.getEvents ()
      .then( res => eventsLoaded(res));
    console.log('App - firstLoadDatas');
  }

  //-------------------------------------------------------------------------
  
  updateDatas = () => {
    this.getTime();

    if ( ((+(this.state.time.slice(-1))) % 2) === 0 ) {
      const { documentsLoaded } = this.props;
      this.props.infoService.getDocuments()
        .then( res => documentsLoaded(res));
    }

    if ( ((+(this.state.time.slice(-2))) % 10) === 0 ) {
      const { sourcedataLoaded } = this.props;
      this.props.infoService.getSourcedata()
        .then( res => sourcedataLoaded(res));
    }
    console.log(`App - updateDatas`);

    if (this.props.store.documents != "") {
      const { dateTimeH } = this.props.store,
            { updateEverydayCurrentPeriod,
              updateAstroDateTime,
              updateStyleReceivedAndDelivery,
              updateDocsProgress } = this.props.infoService;

      const docs_EvCurPer =  updateEverydayCurrentPeriod( this.props.store.documents ),
            docs_EvCurPer_Astro =  updateAstroDateTime(docs_EvCurPer, dateTimeH),
            docs_EvCurPer_Astro_Style  = updateStyleReceivedAndDelivery(docs_EvCurPer_Astro, dateTimeH),
            docsProgress = updateDocsProgress(docs_EvCurPer_Astro_Style, dateTimeH);

      this.props.docsLoaded(docsProgress);
    }
  }

  //-------------------------------------------------------------------------

  getTime = () => {
    const takeTwelve = n => n > 12 ?  n  - 12 : n,
          addZero = n => n < 10 ? "0" +  n : n;
    let d, h, m, s, t, amPm;
    d = new Date();
    h = addZero(/*takeTwelve(*/d.getHours()/*)*/); 
    m = addZero(d.getMinutes()); 
    s = addZero(d.getSeconds());
        t = `${h}:${m}:${s}`;
    amPm = d.getHours() >= 12 ? "pm" : "am";

    this.setState(() => {
        return { time: t, 
                 amPm: amPm };
    });
  }

  //-------------------------------------------------------------------------

  onClickBtnUp = () => {
    window.scrollTo(0,0);
  }

  //-------------------------------------------------------------------------

  onClickBtnDown = () => {
    const scrollHeight = document.documentElement.clientHeight - document.documentElement.clientHeight / 10; 
    window.scrollBy({ top: scrollHeight, behavior: 'smooth' });
  }

  //-------------------------------------------------------------------------


  render () {

    const navBtnUp = document.querySelector("#nav-btn-up"),
          navBtnDown = document.querySelector("#nav-btn-down");

    let leftPos = 30,
        rightPos = 30;
    if ((document.querySelector("#app-rect") !== null) && (navBtnUp !== null)) {
      const btnWidth = Math.max(navBtnUp.offsetWidth, navBtnDown.offsetWidth);
      leftPos = document.querySelector("#app-rect").getBoundingClientRect().left / 2;
      rightPos = document.querySelector("#app-rect").getBoundingClientRect().right + leftPos - btnWidth;
    }

    let scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );

    if  (navBtnUp !== null) {
      if (window.pageYOffset === 0) {
        navBtnUp.style.display = "none";
      } else {
        navBtnUp.style.display = "block";
      }
    }
    if  (navBtnDown !== null) {
      if ((window.pageYOffset + document.documentElement.clientHeight) == scrollHeight) {
        navBtnDown.style.display = "none";
      } else {
        navBtnDown.style.display = "block";
      }
    }
    

    return (
      <div className="app">
      <div className="layout layout-nav-side">
      <div className="main-container"> 
          <div className="container"> 
            <div className="row justify-content-center"> 
              <div className="col-12" id="app-rect">  
                <Routes>
                  <Route path="/" element={<AppHeader total={50}/>}>
                    <Route index='/' element={<DocsProgress />} />
                    <Route path="statement" element={<Statement updateDatas={this.updateDatas} />} />
                    <Route path="statistics" element={<Statistics updateDatas={this.updateDatas} />} />
                    <Route path="forms" element={<InfoForms />} />
                  </Route>
                </Routes>

                <button id="nav-btn-down"
                  onClick={ this.onClickBtnDown }
                  className="btn btn-round flex-shrink-0 d-print-none" 
                  style={{"position": "fixed", "top": "50%", "left": `${leftPos}px`}} >
                    <i className="material-icons" 
                      style={{"fontSize": "1.8rem"}} >
                        expand_more</i> 
                </button>
                <button id="nav-btn-up"
                  onClick={ this.onClickBtnUp }
                  className="btn btn-round flex-shrink-0 d-print-none" 
                  style={{"position": "fixed", "top": "50%", "left": `${rightPos}px`}} >
                    <i className="material-icons"
                      style={{"fontSize": "1.8rem"}}>
                        keyboard_double_arrow_up</i> 
                </button>
              </div>  
            </div> 
          </div> 
      </div> 
      </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return { store }
}

const mapDispatchToProps = actions;

export default WithService ()( connect(mapStateToProps, mapDispatchToProps)(App) );

