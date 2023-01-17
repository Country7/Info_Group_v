
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import WithService from '../hoc/with-service';

import PageHeader from '../pages/page-header';
import EventsList from './events-list';

class DocsProgress extends Component {

  //-------------------------------------------------------------------------

  componentDidMount() {
    const cardsFlashing = document.querySelectorAll('.card-body-flash');
    
    const scrollTarget = cardsFlashing[0];
    if ( scrollTarget != null ) {
      setTimeout( () => {
        const topOffset = 105, 
              elementPosition = scrollTarget.getBoundingClientRect().top,
              offsetPosition = elementPosition - topOffset;
        window.scrollBy({ top: offsetPosition, behavior: 'smooth' });
      }, 1000);
    }
  }

  //-------------------------------------------------------------------------

  render () {

    const { documents, docs } = this.props.store;

    if ((documents == "") || (docs == ""))  {
      return;
    }

    return (
      <>
        <PageHeader 
          headerTitle={'Расчет времени, контроль прохождения информации'} />

        <EventsList docsProgress={ docs } />
      </>
    )
  }
}

const mapStateToProps = (store) => {
  return { store }
}

const mapDispatchToProps = actions;

export default WithService ()( connect(mapStateToProps, mapDispatchToProps)(DocsProgress) );

