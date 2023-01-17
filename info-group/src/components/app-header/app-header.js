import React from 'react';
import { Outlet } from 'react-router-dom';
import NavTabs from '../nav-tabs/nav-tabs';


const AppHeader = () => {
  return (
    <>
      <div style={{height: "4px"}}></div>
      <NavTabs />  
      <audio id="snd-alert" 
            webkit-playsinline="true"
            playsInline={ true }
            autoPlay={ true }
            muted="muted">
        <source src="./snd/message2.mp3" />
      </audio>
      <Outlet />
    </>
  )
};

export default AppHeader;