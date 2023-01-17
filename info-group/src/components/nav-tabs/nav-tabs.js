import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';


const NavTabs = () => {
    return (
        <>
        <Nav className="nav nav-tabs nav-fill d-print-none" defaultActiveKey="/" role="tablist">
            <Nav.Item className="nav-item">
                <NavLink to='/' className="nav-link" 
                    data-toggle="tab" 
                    role="tab" 
                    aria-controls="tasks" 
                    aria-selected="true">Расчет времени</NavLink>  
            </Nav.Item>
            <Nav.Item className="nav-item">
                <NavLink to='statement' className="nav-link" 
                    data-toggle="tab" 
                    role="tab" 
                    aria-controls="files" 
                    aria-selected="false">Ведомость</NavLink>
            </Nav.Item>
            <Nav.Item className="nav-item">
                <NavLink to='statistics' className="nav-link" 
                    data-toggle="tab" 
                    role="tab" 
                    aria-controls="activity" 
                    aria-selected="false">Статистика</NavLink>
            </Nav.Item>
         </Nav>  
        
        </>
    )
}

export default NavTabs;