import './index.css';
import RootContainer from './containers/RootContainer';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore'

import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './material-icons/material-icons.css'

const history = createHistory();
const store = configureStore(history);

const App = () => (
    <MuiThemeProvider>
        <RootContainer store={store} history={history}/>
    </MuiThemeProvider>
);

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
