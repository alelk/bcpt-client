/**
 * Root Container
 *
 * Created by Alex Elkin on 12.09.2017.
 */
import PersonsContainer from './table/PersonsContainer'
import BloodDonationsContainer from './table/BloodDonationsContainer'
import BloodInvoicesContainer from './table/BloodInvoicesContainer'
import BloodInvoiceSeriesContainer from './table/BloodInvoiceSeriesContainer'
import BloodPoolsContainer from './table/BloodPoolsContainer'
import BloodPoolAnalysisContainer from './table/BloodPoolAnalysisContainer'
import ProductBatchesContainer from './table/ProductBatchesContainer'
import DrawerContainer from './DrawerContainer'
import DataImporterContainer from './DataImporterContainer'
import HomePageContainer from './HomePageContainer'

import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Route, Link } from 'react-router-dom'
import { ConnectedRouter} from 'react-router-redux'
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';

const tableLinks = [
    {link:"/table/persons", title:"Доноры", iconName:"person"},
    {link:"/table/bloodDonations", title:"Пакеты с плазмой", iconName:"invert_colors"},
    {link:"/table/bloodInvoices", title:"Накладные", iconName:"format_list_bulleted"},
    {link:"/table/bloodInvoiceSeries", title:"Серии ПДФ", iconName:"picture_as_pdf"},
    {link:"/table/bloodPools", title:"Пулы", iconName:"poll"},
    {link:"/table/bloodPoolAnalysis", title:"Анализы пулов", iconName:"colorize"},
    {link:"/table/productBatches", title:"Загрузки", iconName:"call_merge"},
];
const toolLinks = [
    {link:"/import", title:"Импорт данных", iconName:"file_upload"}
];

const renderMenuItem = (link, label, iconName) => (
    <MenuItem key={link}>
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
                    {renderMenuItem("/", "Главная", "home")}
                    <Divider />
                    {tableLinks.map(link => renderMenuItem(link.link, link.title, link.iconName))}
                    <Divider />
                    {toolLinks.map(link => renderMenuItem(link.link, link.title, link.iconName))}
                </DrawerContainer>
                <div>
                    <Route exact path='/' render={() => <HomePageContainer tableLinks={tableLinks} toolLinks={toolLinks}/>}/>
                    <Route path='*/table/persons' component={PersonsContainer}/>
                    <Route path='*/table/bloodDonations' component={BloodDonationsContainer}/>
                    <Route path='*/table/bloodInvoices' component={BloodInvoicesContainer}/>
                    <Route path='*/table/bloodInvoiceSeries' component={BloodInvoiceSeriesContainer}/>
                    <Route path='*/table/bloodPools' component={BloodPoolsContainer}/>
                    <Route path='*/table/bloodPoolAnalysis' component={BloodPoolAnalysisContainer}/>
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