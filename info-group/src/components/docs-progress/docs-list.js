import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import WithService from '../hoc/with-service';
import { NavLink } from 'react-router-dom';
import Avatars from '../avatars/avatars';
import AvatarsMini from '../avatars/avatars-mini';


class DocsList extends Component {


  render () {

    const { eventId, docsEventsList, filtr } = this.props,
          { events } = this.props.store,
          event = events.find( evt => evt.id === eventId ),
          comment = `Начало мероприятия - ${event.start}, продолжительность ${event.duration}`,
          docs = docsEventsList;

    return (
      <>
        <div className="card-list-head"> 
          <div style={{display: 'block'}}>
            <h6 style={{"fontWeight": "550"}}>{ event.title }</h6>
            <span className="text-small">{ comment }</span>
            <br></br><span className="text-small"> &nbsp;</span>
          </div>
          <div className="dropdown">
            <button className="btn-options" 
                type="button" 
                id="cardlist-dropdown-button-1" 
                data-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="false">
                <i className="material-icons">more_vert</i>
            </button>
            <div className="dropdown-menu dropdown-menu-right">
                <a className="dropdown-item" >Rename</a>
                <a className="dropdown-item text-danger" >Archive</a>
            </div>
          </div>
        </div>

        <div className="card-list-body filter-list-1654011964559 filter-list-1654020808203">
          { docs.map( doc => {
            if ( (eventId == doc.eventId) && 
                  ((filtr == 0) || ((filtr == 1) && (doc.status != "executed") && (doc.status != "with-delay"))  ) ) {
              return (
                <div key={`dl${doc.id}`} className="card card-task"> 

                  <div className="progress">
                    <div className={`progress-bar ${doc.klass}`}
                          role="progressbar" 
                          style={{width:`${doc.progressWidth}%`}}
                          aria-valuenow="25" 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                    >
                    </div>
                  </div>

                  <div className={`card-body ${ ((doc.progressWidth > 80) && (!doc.checked)) && "card-body-flash" }`}> 
                    <div className="card-title">
                      <NavLink to='/' className="card-title-a" >
                        <h6 data-filter-by="text" 
                            className="H6-filter-by-text"
                            style={{"marginBottom": "0.25rem"}} >{ doc.title }</h6>
                      </NavLink>
                      <span className="text-small">
                        док-т - {doc.type}, 
                        исп. {doc.tdTimeAliasH}&nbsp; 
                        -&nbsp;{doc.tdTimeAstroH}&nbsp;&nbsp;{doc.tdTimeAstroHDate}, 
                        &nbsp;&nbsp;&nbsp;{doc.remainedStr}
                      </span>
                    </div>

                    <div className="card-meta"> 
                      <Avatars key={`a${doc.id}`} 
                              doc={ doc } />

                      <div className="d-flex align-items-center">
                        <i className="material-icons">playlist_add_check</i>
                        <span>{ doc.fraction }</span>
                      </div>
                      <div className="dropdown card-options">
                        <button className="btn-options" 
                                type="button" id="task-dropdown-button-1" 
                                data-toggle="dropdown" 
                                aria-haspopup="true" 
                                aria-expanded="false">
                          <i className="material-icons">more_vert</i>
                        </button>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a className="dropdown-item" href="#">Mark as done</a>
                            <div className="dropdown-divider"></div>
                          <a className="dropdown-item text-danger" href="#">Archive</a>
                        </div>
                      </div>
                    </div> 
                  </div> 

                </div>
              )
            } else if ((eventId == doc.eventId) && 
                        ((filtr == 1) && ((doc.status == "executed") || (doc.status == "with-delay")) ) ) {
              return (
                <div key={`dl${doc.id}`} className="card card-task" style={{"marginBottom": "0.55rem"}}> 

                  <div className="progress">
                    <div className={`progress-bar ${doc.klass}`}
                          role="progressbar" 
                          style={{width:`${doc.progressWidth}%`}}
                          aria-valuenow="25" 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                    >
                    </div>
                  </div>

                  <div className="card-body" style={{"paddingTop": "0.35rem", "paddingBottom": "0.15rem"}}> 
                    <div className="card-title">
                      <NavLink to='/' className="card-title-a" >
                        <h6 data-filter-by="text" 
                            className="H6-filter-by-text text-muted"
                            style={{"fontWeight": "normal"}} >
                              { `${doc.title.slice(0, 100)} ...` }
                        </h6>
                      </NavLink>
                    </div>
                  
                    <div className="card-meta"> 
                      <AvatarsMini key={`a${doc.id}`} 
                                  doc={ doc } />

                      <div className="d-flex align-items-center">
                        <i className="material-icons">playlist_add_check</i>
                      </div>
                      <div className="dropdown card-options">
                        <button className="btn-options" 
                                type="button" id="task-dropdown-button-1" 
                                data-toggle="dropdown" 
                                aria-haspopup="true" 
                                aria-expanded="false">
                          <i className="material-icons">more_vert</i>
                        </button>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a className="dropdown-item" href="#">Mark as done</a>
                            <div className="dropdown-divider"></div>
                          <a className="dropdown-item text-danger" href="#">Archive</a>
                        </div>
                      </div>
                    </div> 

                  </div> 
                </div>

              )
            } 
          })}
        </div>
      </>   
    )
  }
}


const mapStateToProps = (store) => {
  return { store }
}

const mapDispatchToProps = actions;

export default WithService ()( connect(mapStateToProps, mapDispatchToProps)(DocsList) );
