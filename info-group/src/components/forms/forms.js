import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import WithService from '../hoc/with-service';
import Table from 'react-bootstrap/Table';


class InfoForms extends Component {
  
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
    return (
      <>
        <Table  responsive 
          striped 
          bordered 
          hover 
          size="xl" 
          style={
              { "width": `${ this.state.widthTable }%` }
          }
          className="table-shadow"
          >



        </Table>
      </>
    ) 
  }
}

const mapStateToProps = (store) => {
  return { store }
}

const mapDispatchToProps = actions;

export default WithService ()( connect(mapStateToProps, mapDispatchToProps)(InfoForms) );
