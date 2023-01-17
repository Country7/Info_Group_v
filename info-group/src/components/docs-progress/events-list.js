import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import WithService from '../hoc/with-service';

import DocsList from './docs-list';


class EventsList extends Component {
  state = {
    filtrTask: "Вид списка...",
    arrFilterTask: ["Полный вид", "Уменьшить исп..."],
  }

  onClickFilterTask = (evt) => {
    document.querySelector("#filter-task").classList.toggle("show");
    this.props.setFilterTask(evt.target.innerHTML);
  }

  render () {

    const { events, dateTimeH } = this.props.store,
          { docsProgress } = this.props;

    const docs = docsProgress;

    let filtr_task = 0;
    filtr_task = this.state.arrFilterTask.findIndex( filtr => filtr == this.props.store.filtrTask);
    if (filtr_task < 0) { filtr_task = 0 }


    return (
      <div className="tab-content"> 
        <div className="tab-pane fade show active" id="tasks" role="tabpanel" data-filter-list="card-list-body">
          
          <div className="row content-list-head">
            <div className="col-auto">
              <h3>Мероприятия</h3>
              <button className="btn btn-round" 
                      data-toggle="modal" 
                      data-target="#task-add-modal" >
                <i className="material-icons">add</i>
              </button>


              
            </div>

              <div className="dropdown show col-2">
                <button
                  aria-haspopup="true"
                  type="button"
                  className="form-control input-group-text text-muted"
                  style={{"borderRadius": "10rem"}}
                  data-toggle="dropdown"
                  aria-expanded="true"
                  onClick={() => document.querySelector("#filter-task").classList.toggle("show")} 
                  >
                    <i className="material-icons" style={{"fontSize": "16px", "marginTop": "-2px"}} >filter_list</i>
                    &nbsp;
                    {this.props.store.filtrTask}
                </button>  
                <ul id="filter-task" 
                    className="dropdown-menu dropdown-menu-right" 
                    style={{"marginRight": "24px", "cursor": "pointer"}}>
                  <li><div className="dropdown-item" 
                        onClick={ this.onClickFilterTask } >
                          { this.state.arrFilterTask[0] }
                  </div></li>
                  <li><div className="dropdown-item text-danger" 
                        onClick={ this.onClickFilterTask } >
                          { this.state.arrFilterTask[1] }
                  </div></li>
                </ul>
              </div>
            </div>
          
          { events.map( (event, indx) => {
              return (
                <div key={`ev${indx}`} className="content-list-body"> 
                  <div className="card-list"> 

                    <DocsList eventId={ event.id } docsEventsList={ docs } filtr={filtr_task} /> 

                  </div> 
                </div>
              )
          }) }
        </div> 
      </div> 
    )
  }
}

const mapStateToProps = (store) => {
  return { store }
}

const mapDispatchToProps = actions;

export default WithService ()( connect(mapStateToProps, mapDispatchToProps)(EventsList) );

