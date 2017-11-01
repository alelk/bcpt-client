/**
 * Root Container
 *
 * Created by Alex Elkin on 12.09.2017.
 */
import PersonsContainer from './table/PersonsContainer'
import BloodDonationsContainer from './table/BloodDonationsContainer'
import BloodInvoicesContainer from './table/BloodInvoicesContainer'
import BloodPoolsContainer from './table/BloodPoolsContainer'
import ProductBatchesContainer from './table/ProductBatchesContainer'
import DrawerContainer from './DrawerContainer'
import DataImporterContainer from './DataImporterContainer'

import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Route, Link } from 'react-router-dom'
import { ConnectedRouter} from 'react-router-redux'
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';

const renderMenuItem = (link, label, iconName) => (
    <MenuItem>
        <Link to={link}>
            <FlatButton label={label} secondary style={{width: "100%", textAlign:"left", color: "#7e22c1"}}
                        icon={<FontIcon className="material-icons">{iconName}</FontIcon>}
            />
        </Link>
    </MenuItem>
);

const Root = ({store, history}) => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                <DrawerContainer>
                    {renderMenuItem("/table/persons", "Доноры", "person")}
                    {renderMenuItem("/table/bloodDonations", "Пакеты с плазмой", "invert_colors")}
                    {renderMenuItem("/table/bloodInvoices", "Накладные", "format_list_bulleted")}
                    {renderMenuItem("/table/bloodPools", "Пулы", "poll")}
                    {renderMenuItem("/table/productBatches", "Загрузки", "call_merge")}
                    <Divider />
                    {renderMenuItem("/import", "Импорт данных", "file_upload")}
                </DrawerContainer>
                <div>
                    <Route path='*/table/persons' component={PersonsContainer}/>
                    <Route path='*/table/bloodDonations' component={BloodDonationsContainer}/>
                    <Route path='*/table/bloodInvoices' component={BloodInvoicesContainer}/>
                    <Route path='*/table/bloodPools' component={BloodPoolsContainer}/>
                    <Route path='*/table/productBatches' component={ProductBatchesContainer}/>
                    <Route path='*/import' component={DataImporterContainer}/>
                </div>
            </div>
        </ConnectedRouter>
    </Provider>
);

Root.propTypes = {
    store : PropTypes.object.isRequired,
    history : PropTypes.object.isRequired
};

export default Root;