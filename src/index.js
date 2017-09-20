import './index.css';
import RootContainer from './containers/RootContainer';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore'

import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory'
import '../node_modules/material-design-icons/iconfont/material-icons.css'

const history = createHistory();
const store = configureStore(history);

ReactDOM.render(<RootContainer store={store} history={history}/>, document.getElementById('root'));
registerServiceWorker();
