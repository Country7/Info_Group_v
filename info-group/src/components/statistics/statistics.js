import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import WithService from '../hoc/with-service';
import Table from 'react-bootstrap/Table';
import PageHeader from '../pages/page-header';
import StatistTable from './statist-table';


class Statistics extends Component {
  
  state = {
    classTable: [
      'table-danger',
      'table-warning',
      'table-success',
      'table-primary',
      'table-info',
      'table-secondary'
    ],
    widthTable: 100,
  }


  render () {

    const docs = this.props.store.docs;
    if (docs == "") { return }

    let countExecuted = 0,    
        countWithDelay = 0,   
        countExpired = 0,     
        countIsExecution = 0, 
        countOther = 0;       
    docs.forEach( doc => {
      switch (doc.status) {
        case 'executed': countExecuted++;
          break;
        case 'with-delay': countWithDelay++;
          break;
        case 'expired': countExpired++;
          break;
        case 'is-execution': countIsExecution++;
          break;
        case 'other': countOther++;
          break;
        default: return;
      };
    });
    

    return (
      <>
        <PageHeader 
          headerTitle={'Ведомость контроля прохождения информации'} />
        
        <div className="content-list-body">

          <ol className="list-group list-group-activity" style={ {"marginBottom": "0.5rem"} }>
            <li className="list-group-item" style={ {"backgroundColor": "#c3e6cb"} } >
              <div className="media align-items-center">
                <ul className="avatars">
                  <li>
                    <div className="avatar bg-primary">
                      <i className="material-icons">playlist_add_check</i>
                    </div>
                  </li>
                </ul>
                <div className="media-body">
                  <div>
                    <span className="h4 SPAN-filter-by-text" data-filter-by="text">
                      {`Исполнено в срок: ${countExecuted}`}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ol>

          <ol className="list-group list-group-activity" style={ {"marginBottom": "0.5rem"} }>
            <li className="list-group-item" style={ {"backgroundColor": "#ffeeba"} } >
              <div className="media align-items-center">
                <ul className="avatars">
                  <li>
                    <div className="avatar bg-primary">
                      <i className="material-icons">playlist_add_check</i>
                    </div>
                  </li>
                </ul>
                <div className="media-body">
                  <div>
                    <span className="h4 SPAN-filter-by-text" data-filter-by="text">
                      {`Исполнено с задержкой: ${countWithDelay}`}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ol>

          <ol className="list-group list-group-activity" style={ {"marginBottom": "0.5rem"} }>
            <li className="list-group-item" style={ {"backgroundColor": "#f5c6cb"} } >
              <div className="media align-items-center">
                <ul className="avatars">
                  <li>
                    <div className="avatar bg-primary">
                      <i className="material-icons">playlist_add_check</i>
                    </div>
                  </li>
                </ul>
                <div className="media-body">
                  <div>
                    <span className="h4 SPAN-filter-by-text" data-filter-by="text">
                      {`Просрочено: ${countExpired}`}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ol>

          <ol className="list-group list-group-activity" style={ {"marginBottom": "0.5rem"} }>
            <li className="list-group-item" style={ {"backgroundColor": "#bee5eb"} } >
              <div className="media align-items-center">
                <ul className="avatars">
                  <li>
                    <div className="avatar bg-primary">
                      <i className="material-icons">playlist_add_check</i>
                    </div>
                  </li>
                </ul>
                <div className="media-body">
                  <div>
                    <span className="h4 SPAN-filter-by-text" data-filter-by="text">
                      {`Находится на исполнении: ${countIsExecution}`}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          </ol>
          
        </div>

        <h3>
          &nbsp;
        </h3>

        {(countExecuted !== 0) 
          && <StatistTable 
              title={'Исполнено в срок'} 
              status={ 'executed' } 
              classTable={'table-success'} 
              backgroundColor={"#c3e6cb"} />}

        {(countWithDelay !== 0) 
          && <StatistTable 
              title={'Исполнено с задержкой'} 
              status={ 'with-delay' } 
              classTable={'table-warning'} 
              backgroundColor={"#ffeeba"} />}

        {(countExpired !== 0) 
          && <StatistTable 
              title={'Просрочено'} 
              status={ 'expired' } 
              classTable={'table-danger'} 
              backgroundColor={"#f5c6cb"} />}

        {(countIsExecution !== 0) 
          && <StatistTable 
              title={'Находится на исполнении'} 
              status={ 'is-execution' } 
              classTable={'table-info'} 
              backgroundColor={"#bee5eb"} />}

        {(countOther !== 0) 
          && <StatistTable 
              title={'Остальные'} 
              status={ 'other' } 
              classTable={'table-secondary'} 
              backgroundColor={"#d6d8db"} />}
      </>
    ) 
  }
}

const mapStateToProps = (store) => {
  return { store }
}

const mapDispatchToProps = actions;

export default WithService ()( connect(mapStateToProps, mapDispatchToProps)(Statistics) );
