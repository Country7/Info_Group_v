import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import WithService from '../hoc/with-service';
import Table from 'react-bootstrap/Table';
import InTooltip from '../in-tooltip/in-tooltip';

class StatTableCtragts extends Component {

  state = {
    sectionId: "03",
  }

  formingCols = (docs) => {
    if (docs.length == 1) {
      docs.push( [], [] );
    } else if (docs.length == 2) {
      docs.push( [] );
    }
    let firstCol = 17,
        colWidth =  (100 - firstCol) / docs.length ,
        colCount = docs.length + 1,
        colRemains = 0,
        widthTable = 99.7,
        coeff = 1;

    if ( docs.length > 5 ) {
      widthTable = 100 + (docs.length - 5) * (firstCol - 0.7) ;
      coeff = 100 / widthTable;
      colWidth = ( (widthTable - (firstCol * coeff)) / docs.length ) * coeff -0.5; 
      colCount = 6;
      colRemains = (docs.length - 5) ;
      firstCol = firstCol * coeff;
    }

    return { firstCol, colWidth, colCount, colRemains, widthTable };
  }

  localData = (docs) => {
    const { counteragents } = this.props.store;
    let localCtragts = [],
        rdDocs = [];
    docs.forEach(doc => {
      let receivedCount = 0,
          deliveryCount = 0;
      if ( (doc !== null) && (doc != "") ) {
        doc.receivedTime.forEach( docCtragt => {
          ++receivedCount;
          if ( localCtragts.findIndex( item => item.ctragtId === docCtragt.ctragtId ) < 0 ) {
            const ctragt = counteragents.find( ctragt => ctragt.id === docCtragt.ctragtId );
            docCtragt = { ...docCtragt, ...ctragt  };
            localCtragts.push( docCtragt );
          }
        });
        doc.deliveryTime.forEach( docCtragt => {
          ++deliveryCount;
          if ( localCtragts.findIndex( item => item.ctragtId === docCtragt.ctragtId ) < 0 ) {
            const ctragt = counteragents.find( ctragt => ctragt.id === docCtragt.ctragtId );
            docCtragt = { ...docCtragt, ...ctragt  };
            localCtragts.push( docCtragt );
          }
        });
        if (receivedCount > deliveryCount) {
          rdDocs.push({ docId: doc.id, rd: "Поступило"});
        } else if (receivedCount < deliveryCount) {
          rdDocs.push({ docId: doc.id, rd: "Доведено"});
        } else {
          rdDocs.push({ docId: doc.id, rd: "Пост./довед."});
        }
      }
    });
    return { localCtragts, rdDocs };
  }

  render () {

    const { classTable, docsStatement, store } = this.props,
          { sections } = store;

    if (sections == "") {
      return;
    }
    
    const docs = docsStatement.filter( doc => (doc.sectionsId === this.state.sectionId) ),
          sectionAlias = sections.find( sec => (sec.id == this.state.sectionId) ).alias;

    const { firstCol, colWidth, colCount, colRemains, widthTable } = this.formingCols(docs);
  
    const { localCtragts, rdDocs } = this.localData(docs);

    return (
      <>
        
        <Table  responsive 
                bordered 
                hover 
                size="xl" 
                style={
                    { "width": `${ widthTable }%` }
                }
                className="table-gov table-shadow"
        >
          <thead>
            <tr className={`text-center text-uppercase ${ classTable } tr-shadow`}  >
              <th colSpan={ colCount } >
                { sectionAlias }
              </th>
              {( docs.length > 5 ) && <td colSpan={ colRemains } ></td> }
            </tr>

            <tr className="align-middle">
              <th  style={{"width": `${ firstCol }%`, "background": "#fbfcfd", "borderBottom": "1px solid #fbfcfd" }} ></th>
              { docs.map( (doc, key) => {
                return (
                  <th key={`dt${key}`} 
                      className={ `text-center table-active ${ ((doc.progressWidth > 80) && (!doc.checked)) && "card-body-flash" }` }
                      style={{"width": `${ colWidth }%`}}
                  >
                    <InTooltip 
                      value={ doc.alias }
                      strongTooltip={ doc.title } 
                      interval={ "" }
                      normalTooltip={ "" }
                      klass=""
                      placement="bottom"
                    />
                  </th>
                )
              })}
            </tr>

            <tr className="align-middle">
              <th  style={{"width": `${ firstCol }%`, "background": "#fbfcfd", "borderBottom": "1px solid #fbfcfd"}} ></th>
              { docs.map( (doc, key) => {
                return (
                  <th key={`dt${key}`} className="text-center table-light" >
                    { doc.tdTimeAliasH }
                  </th>
                )
              })}
            </tr>

            <tr className="align-middle">
              <th  style={{"width": `${ firstCol }%`, "background": "#fbfcfd"}} ></th>
              { docs.map( (doc, key) => {
                return (
                  <th key={`dt${key}`} className="text-center table-active" >
                    <InTooltip 
                      value={ doc.tdTimeAstroH }
                      strongTooltip={ doc.tdTimeAstroHDate } 
                      interval={ ( <span>&nbsp;&nbsp;</span> ) }
                      normalTooltip={ doc.tdTimeAstroHTime }
                      klass=""
                    />
                  </th>
                )
              })}
            </tr>
        </thead>

        <tbody>
          
          <tr>
            <th className="text-center table-warning" style={{ "padding": "0.4rem" }}>
              Поступило/доведено:
            </th>

            { docs.map( (doc, dkey) => {
              const rdDoc = rdDocs.find( rdDoc => rdDoc.docId == doc.id);
              return (
                <td key={`rw${dkey}`} className="text-center table-warning" >
                  { rdDoc.rd }
                </td>
              )
              }
            )}

          </tr>

          {localCtragts.map( (ctragt, ckey) => {
            return (
              <tr key={`dt${ckey}`} >
                <th className="text-left" style={{ "background": "#fbfcfd" }} >
                  <InTooltip 
                    value={ ctragt.alias }
                    strongTooltip={ ctragt.title } 
                    interval={ "" }
                    normalTooltip={ "" }
                    klass=""
                  />
                </th>

                
                { docs.map( (doc, dkey) => {
                  if (doc != "") {

                    if ( doc.receivedTime.findIndex( ctragtDoc => ctragtDoc.ctragtId == ctragt.id ) !== -1 ){
                      const ctragtDoc = doc.receivedTime.find( ctragtDoc => ctragtDoc.ctragtId == ctragt.id );
                      const { remadedTime, remadedDate } = this.props.infoService.getRemadedDateTime(ctragtDoc.received);
                      let klass = "";
                      if (ctragtDoc.checkPlan !== "") {
                        klass = ctragtDoc.checkPlan;
                      } else if ((doc.progressWidth > 80) && (!doc.checked)){
                        klass = "table-receive-flash"
                      } else {
                        klass = "table-receive"
                      }
                      return (
                        <td key={`data${doc.id}-${ctragt.id}`} 
                          className={ `text-center ${ klass }` } 
                          style={{ "cursor": "pointer"}}
                          onClick={ () => this.props.handleDateTimeModalShow( doc.id, true, ctragt.id, ctragt.alias, ctragtDoc.received, doc.end) }
                        >
                          {
                            ctragtDoc.received !== ""
                            && <InTooltip 
                                value={ remadedTime }
                                strongTooltip={ remadedDate } 
                                interval={ ( <span>&nbsp;&nbsp;</span> ) }
                                normalTooltip={ remadedTime }
                                klass=""
                              />
                          }
                        </td>
                      )
                    } else if ( doc.deliveryTime.findIndex( deliveryTime => deliveryTime.ctragtId == ctragt.id ) !== -1 ) {
                      const ctragtDoc = doc.deliveryTime.find( deliveryTime => deliveryTime.ctragtId == ctragt.id );
                      const { remadedTime, remadedDate } = this.props.infoService.getRemadedDateTime(ctragtDoc.delivery);
                      const klass = ((doc.progressWidth > 80) && (ctragtDoc.checkPlan == "") && (!doc.checked)) ? "card-body-flash" : ctragtDoc.checkPlan;
                      
                      return (
                        <td key={`data${doc.id}-${ctragt.id}`} 
                          className={ `text-center ${ klass }` }
                          onClick={ () => this.props.handleDateTimeModalShow( doc.id, false, ctragt.id, ctragt.alias, ctragtDoc.delivery, doc.end) }
                          style={{ "cursor": "pointer" }} 
                        >
                          {
                            ctragtDoc.delivery !== ""
                            && <InTooltip 
                                value={ remadedTime }
                                strongTooltip={ remadedDate } 
                                interval={ ( <span>&nbsp;&nbsp;</span> ) }
                                normalTooltip={ remadedTime }
                                klass=""
                              />
                          }
                        </td>
                      )
                    } else {
                      return (
                        <td key={`data${doc.id}-${ctragt.id}`} className="text-center table-secondary" >
                        </td>
                      )
                    }
                  } else {
                    return (
                        <td key={`data${dkey}`} className="text-center table-secondary" >
                        </td>
                      )
                  }
                }) }
               </tr>
            )
          })}


        </tbody>
        </Table>

        <div>&nbsp;</div>
        <div>&nbsp;</div>
        { ( docs.length > 4 ) && <div>&nbsp;</div> }
        </>
    )
  }  
}

const mapStateToProps = (store) => {
  return { store }
}
  
const mapDispatchToProps = actions;
  
export default WithService ()( connect(mapStateToProps, mapDispatchToProps)(StatTableCtragts) );