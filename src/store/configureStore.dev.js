/**
 * Configure development store
 *
 * Created by Alex Elkin on 12.09.2017.
 */

import bcptRestApiMiddleware from '../middleware/bcptRestApiMiddleware'
import rootReducer from '../reducers/reducers'

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'

const configureStore = (history, preloadedState) => {
    return createStore(
        rootReducer,
        preloadedState,
        compose(
            applyMiddleware(
                thunk,
                bcptRestApiMiddleware,
                routerMiddleware(history),
                createLogger()
            )
        )
    )
};

export default configureStore;