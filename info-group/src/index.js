import '../src/scss/app.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import InfoService from './services/info-service';
import InfoServiceContext from './components/service-context';
import store from './store';

import './index.scss';
import App from './components/app';

const root = ReactDOM.createRoot(document.getElementById('root'));

const infoService = new InfoService();


root.render(
  <Provider store={store}>
      <InfoServiceContext.Provider value={infoService}> 
          <BrowserRouter>
              <App />
          </BrowserRouter>
      </InfoServiceContext.Provider>
</Provider>
);
