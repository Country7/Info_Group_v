import { createStore } from 'redux';
import reducer from './reducers/reduser';

const store = createStore(reducer);

export default store;
