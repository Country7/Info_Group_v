import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import WithService from '../hoc/with-service';
import Table from 'react-bootstrap/Table';


class StatistTable extends Component {
  
  state = {
    widthTable: 100,
  }


  render () {

    const docs = this.props.store.docs;
    if (docs == "") { return }

    let num = 0;
    const wcolnum =  "4%",
          wcoltitle = "36%",
          wcolleft = "30%",
          wcolright = "15%",
          wcolinleft = "50%",
          wcolinright = "50%";
          
    return (
      <>
        <Table
          responsive
          hover
          bordered 
          size="xl" 
          style={
              { "width": `${ this.state.widthTable }%` }
          }
          className="table-shadow"
        >
          <thead style={{"borderBottom": "2px solid currentColor"}}>
            <tr className={`text-center text-uppercase tr-shadow`}  
                style={ {"backgroundColor": this.props.backgroundColor,
                        "WebkitPrintColorAdjust":"exact"} } >
              <th colSpan={ 5 } >
                { this.props.title }
              </th>
            </tr>

            <tr className="align-middle text-center">
              <th rowSpan={2} style={{"width": wcolnum}}>
                № п/п
              </th>
              <th rowSpan={2} style={{"width": wcoltitle}}>
                Наименование документов
              </th>
              <th>
                Время "С"+
              </th>
              <th rowSpan={2} style={{"width": wcolleft}}>
                Контрагент
              </th>
              <th rowSpan={2} style={{"width": wcolright}}>
                Исполнено
              </th>
            </tr>
            <tr  className="align-middle text-center">
              <th>
                Время астр.
              </th>
            </tr>
          </thead>
          
          { 
            docs.map( ( doc, key ) => {
              if ( doc.status === this.props.status ) {
                num++
                const receivedCount = doc.receivedTime.length,
                      colCount = 2 + doc.receivedTime.length + doc.deliveryTime.length,
                      colCountMin = colCount -1;
                
                return (
                  <tbody key={`doc${key}`} style={{"borderTop": 0}} >
                    <tr>
                      <td className="text-center" rowSpan={ colCount }>
                        { `${num}.` }
                      </td>
                      <td rowSpan={ colCount }>
                        { doc.title }
                      </td>
                      <td className="text-center">
                        { doc.tdTimeAliasH }
                      </td>
                      <td colSpan={ 2 } className="text-center table-warning">
                        Поступило от:
                      </td>
                    </tr>

                    {
                      doc.receivedTime.map( ( ctragt, indx ) => {
                        let tdExecuted = [];
                        
                        if (doc.end == "") {
                          tdExecuted = ctragt.executed.map( exec => {
                            if ( exec.time !== "" ) {
                              const { remadedTime, remadedDate } = this.props.infoService.getRemadedDateTime(exec.time);
                              return `${remadedDate} г. ${remadedTime}`;
                            }
                          })
                        } else if ( ctragt.received !== "" ) {
                          const { remadedTime, remadedDate } = this.props.infoService.getRemadedDateTime(ctragt.received);
                          tdExecuted.push(`${remadedDate} г. ${remadedTime}`);
                        }

                        if (indx == 0) {
                          return (
                            <tr key={`rctragt${indx}`}>
                              <td rowSpan={ colCountMin } className="text-center">
                                { `${doc.tdTimeAstroHDate} г. ${doc.tdTimeAstroHTime}` }
                              </td>
                              <td>
                                { this.props.store.counteragents.find( ctragtPrimary => ctragtPrimary.id === ctragt.ctragtId).title }
                              </td>
                              <td className="text-center">
                                { tdExecuted.map( (time, k) => {
                                  return (
                                    <div key={`t${k}`} className="text-center">
                                      { time }
                                    </div>
                                  )
                                } ) }
                              </td>
                            </tr>
                          )
                        }

                        return (
                          <tr key={`rctragt${indx}`}>
                            <td>
                              { this.props.store.counteragents.find( ctragtPrimary => ctragtPrimary.id === ctragt.ctragtId).title }
                            </td>
                            <td className="text-center">
                              { tdExecuted.map( (time, k) => {
                                  return (
                                    <div key={`t${k}`} className="text-center">
                                      { time }
                                    </div>
                                  )
                              } ) }
                            </td>
                          </tr>
                        );
                      }) 
                    }


                    { (receivedCount < 1) 
                      ? (
                        <tr key={`noctragt`}>
                          <td rowSpan={ colCountMin } className="text-center">
                            { `${doc.tdTimeAstroHDate} г. ${doc.tdTimeAstroHTime}` }
                          </td>
                          <td colSpan={ 2 } className="text-center table-warning">
                            Доведено до:
                          </td>
                        </tr>
                      )
                      : (
                        <tr key={`noctragt`}>
                          <td colSpan={ 2 } className="text-center table-warning">
                            Доведено до:
                          </td>
                        </tr>
                      )
                    }

                    {
                      doc.deliveryTime.map( ( ctragt, indx ) => {

                        let tdExecuted = [];
                        
                        if (doc.end == "") {
                          tdExecuted = ctragt.executed.map( exec => {
                            if ( exec.time !== "" ) {
                              const { remadedTime, remadedDate } = this.props.infoService.getRemadedDateTime(exec.time);
                              return `${remadedDate} г. ${remadedTime}`;
                            }
                          })
                        } else if ( ctragt.delivery !== "" ) {
                          const { remadedTime, remadedDate } = this.props.infoService.getRemadedDateTime(ctragt.delivery);
                          tdExecuted.push(`${remadedDate} г. ${remadedTime}`);
                        }

                        return (
                          <tr key={`rctragt${indx}`}>
                            <td>
                              { this.props.store.counteragents.find( ctragtPrimary => ctragtPrimary.id === ctragt.ctragtId).title }
                            </td>
                            <td className="text-center">
                              { tdExecuted.map( (time, k) => {
                                  return (
                                    <div key={`t${k}`} className="text-center">
                                      { time }
                                    </div>
                                  )
                              } ) }
                            </td>
                          </tr>
                        );
                      }) 
                    }

                  </tbody>
                );
              } 
            }) 
          }
        </Table>
        <div>&nbsp;</div>
        <div>&nbsp;</div>
      </>
    ) 
  }
}

const mapStateToProps = (store) => {
  return { store }
}

const mapDispatchToProps = actions;

export default WithService ()( connect(mapStateToProps, mapDispatchToProps)(StatistTable) );
