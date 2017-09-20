/**
 * Root Container
 *
 * Created by Alex Elkin on 12.09.2017.
 */
import PersonsContainer from './PersonsContainer'
import TableContainer from './TableContainer'

import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

const Root = ({store, history}) => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <Route path='/table/:tableName' component={TableContainer}/>
                <Route exact path='/abv' component={PersonsContainer}/>
            </div>
        </ConnectedRouter>
    </Provider>
);

Root.propTypes = {
    store : PropTypes.object.isRequired,
    history : PropTypes.object.isRequired
};

export default Root;