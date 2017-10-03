/**
 * Root Container
 *
 * Created by Alex Elkin on 12.09.2017.
 */
import PersonsContainer from './PersonsContainer'
import TableContainer from './TableContainer'
import DrawerContainer from './DrawerContainer'

import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Route, Link } from 'react-router-dom'
import { ConnectedRouter} from 'react-router-redux'

const Root = ({store, history}) => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <DrawerContainer>
                    <Link to='/table/persons'><i className="material-icons">person</i>Доноры</Link>
                    <Link to='/table/bloodDonations'><i className="material-icons">invert_colors</i>Пакеты с плазмой</Link>
                    <Link to='/table/bloodInvoices'><i className="material-icons">format_list_bulleted</i>Накладные</Link>
                    <Link to='/table/bloodPools'><i className="material-icons">poll</i>Пулы</Link>
                    <Link to='/table/productBatches'><i className="material-icons">call_merge</i>Загрузки</Link>
                </DrawerContainer>
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