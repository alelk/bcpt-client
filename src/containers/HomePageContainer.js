/**
 * Home Page Container
 *
 * Created by Alex Elkin on 15.11.2017.
 */
import {changeDrawerState} from '../actions/actions'
import AppPage from '../components/AppPage'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { Link } from 'react-router-dom'
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import {GridList, GridTile} from 'material-ui/GridList';
import {Card, CardTitle, CardText} from 'material-ui/Card';

const HomePageContainer = ({changeDrawerState, isDrawerOpened, tableLinks, toolLinks}) => (
    <AppPage className="HomePage"
             title="Главная"
             onDrawerChangeDrawerVisibilityRequest={() => changeDrawerState({isDrawerOpened: !isDrawerOpened})}>
        {tableLinks &&
        <Card>
            <CardTitle title="Blood Centre Product Tracker" titleStyle={{textAlign:'center'}}/>
            <CardText>
                <GridList cols={4} padding={20} style={{textAlign:"center"}}>
                    {tableLinks.map((link, key) => (
                        <Link key={key} to={link.link} style={{textDecoration:'none'}}>
                            <GridTile title={link.title}>
                                <Avatar size={70} style={{marginTop:30}}
                                        backgroundColor="#893"
                                        icon={<FontIcon className="material-icons">{link.iconName}</FontIcon>}/>
                            </GridTile>
                        </Link>
                    ))}
                </GridList>
            </CardText>
            <CardText>
                <GridList cols={4} padding={20} style={{textAlign:"center"}}>
                    {toolLinks.map((link, key) => (
                        <Link key={key} to={link.link} style={{textDecoration:'none'}}>
                            <GridTile title={link.title}>
                                <Avatar size={70} style={{marginTop:30}}
                                        backgroundColor="#827"
                                        icon={<FontIcon className="material-icons">{link.iconName}</FontIcon>}/>
                            </GridTile>
                        </Link>
                    ))}
                </GridList>
            </CardText>
        </Card>
        }
        <div style={{position:'fixed',right:10, bottom: 10, color: "#555"}}>2017 Alex Elkin elckinne@gmail.com</div>
    </AppPage>
);
const linkType = PropTypes.shape({
    link : PropTypes.string,
    iconName : PropTypes.string,
    title : PropTypes.string
});
HomePageContainer.propTypes = {
    isDrawerOpened : PropTypes.bool,
    changeDrawerState : PropTypes.func,
    tableLinks : PropTypes.arrayOf(linkType),
    toolLinks : PropTypes.arrayOf(linkType)
};
const mapStateToProps = (state, ownProps) => ({
    isDrawerOpened: state.drawer.isDrawerOpened
});
export default connect(
    mapStateToProps,
    {
        changeDrawerState
    }
)(HomePageContainer);