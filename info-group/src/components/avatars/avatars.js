import { connect } from 'react-redux';
import { useContext } from 'react';
import InfoServiceContext from '../service-context';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { NavLink } from 'react-router-dom';

const Avatars = ({ doc, counteragents }) => {

  const infoService = useContext(InfoServiceContext);
  
  return (
    <>
      <ul className="avatars" style={{ "whiteSpace": "nowrap" }}>
        { doc.receivedTime.map( ( ctrgntDoc, indx ) => {
          const ctragtGlob = counteragents.find(ctrgntG => ctrgntG.id === ctrgntDoc.ctragtId);
          return (
            <li key={ `av${ ctrgntDoc.ctragtId }` }>
              
              <NavLink to='/' >
                <OverlayTrigger
                  placement="top"
                  animation="true"
                  overlay={
                    <Tooltip >
                      &nbsp;<strong>{ `${ ctragtGlob.title }` }</strong>&nbsp;<br/>
                      { (( ctrgntDoc.received !== "") && (ctrgntDoc.received !== null))
                          && <>
                          <strong>{ infoService.getRemadedDateTime(ctrgntDoc.received).remadedDate }</strong>&nbsp;&nbsp;
                          { infoService.getRemadedDateTime(ctrgntDoc.received).remadedTime }
                          </>
                      }
                    </Tooltip>
                  }
                >
                  <img alt={ ctragtGlob.title } 
                    className="avatar" 
                    src={ ((ctrgntDoc.received !== "") && (ctrgntDoc.received !== null)) 
                        ? ctragtGlob.src
                        : `.${ctragtGlob.src.split('.')[1]}__.png` 
                    }
                  />
                </OverlayTrigger>
              </NavLink>
            </li>
          )
        })}

        { doc.deliveryTime.map( ( ctrgntDoc, indx ) => {
          const ctragtGlob = counteragents.find(ctrgntG => ctrgntG.id === ctrgntDoc.ctragtId);
          return (
            <li key={ `av${ ctrgntDoc.ctragtId }` }>
              
              <NavLink to='/' >
                <OverlayTrigger
                  placement="top"
                  animation="true"
                  overlay={
                    <Tooltip >
                      &nbsp;<strong>{ `${ ctragtGlob.title }` }</strong>&nbsp;<br/>
                      { (( ctrgntDoc.delivery !== "") && (ctrgntDoc.delivery !== null))
                          && <>
                          <strong>{ infoService.getRemadedDateTime(ctrgntDoc.delivery).remadedDate }</strong>&nbsp;&nbsp;
                          { infoService.getRemadedDateTime(ctrgntDoc.delivery).remadedTime }
                          </>
                      }
                    </Tooltip>
                  }
                >
                <img alt={ ctragtGlob.title } 
                  className="avatar" 
                  src={ ((ctrgntDoc.delivery !== "") && (ctrgntDoc.delivery !== null)) 
                      ? ctragtGlob.src
                      : `.${ctragtGlob.src.split('.')[1]}__.png` 
                  }
                />
                </OverlayTrigger>
              </NavLink>
            </li>
          )
        })}
        
      </ul>
    </>
  )
}

const mapStateToProps = ({ counteragents }) => {
    return{
        counteragents,
    }
}

export default connect(mapStateToProps)(Avatars);