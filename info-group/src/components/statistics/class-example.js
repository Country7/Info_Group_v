import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import WithService from '../hoc/with-service';


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
  }



  render () {
    return (
      <>
        <h5>{ this.props.store.documents[0].title } </h5>
      </>
    ) 
  }
}

const mapStateToProps = (store) => {
  return { store }
}

const mapDispatchToProps = actions;

export default WithService ()( connect(mapStateToProps, mapDispatchToProps)(Statistics) );
