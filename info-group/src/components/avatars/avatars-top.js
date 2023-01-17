import { connect } from 'react-redux';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { NavLink } from 'react-router-dom';
import Clock from '../clock/clock';


const AvatarsTop = ({ counteragents }) => {
    if ((!counteragents) && (counteragents == '')) {
        counteragents = [];
    }
    return (
        <>
        <div className="d-flex justify-content-between d-print-none">
        <div className="d-flex align-items-center">
            <ul className="avatars">
            {
                counteragents.map(ca => {
                    if ( (ca.src === "") || (ca.id < 11) || ((ca.id > 16) && (ca.id !== "23")) ){
                        return "";
                    }
                    return (
                        <li key={`at${ca.id}`}>
                            <NavLink to="">
                                <OverlayTrigger
                                    placement="top"
                                    animation="true"
                                    overlay={
                                        <Tooltip id="tt2-top">
                                            &nbsp;<strong>{ ` ${ ca.title } ` }</strong>&nbsp;
                                        </Tooltip>
                                        }
                                    >
                                    <img alt={ ca.title } 
                                        className="avatar" 
                                        src={ca.src}/>
                                </OverlayTrigger>  
                            </NavLink>  
                        </li>
                    )
                })
            }
            </ul>
            <button className="btn btn-round flex-shrink-0" 
                data-toggle="modal" 
                data-target="#user-manage-modal">
                <i className="material-icons">add</i>
            </button>
                
        </div> 
            <Clock />
        </div>
        </>
    )
}

const mapStateToProps = ({counteragents}) => {
    return{ counteragents }
}

export default connect(mapStateToProps)(AvatarsTop);