/**
 * Configure development store
 *
 * Created by Alex Elkin on 12.09.2017.
 */

import bcptRestApiMiddleware from '../middleware/bcptRestApiMiddleware'
import bcptUploaderMiddleware from '../middleware/bcptUploaderMiddleware'
import bcptImporterMiddleware from '../middleware/bcptImporterMiddleware'
import bcptWebSocketMiddleware from '../middleware/bcptWebSocketMiddleware'
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
                bcptUploaderMiddleware,
                bcptImporterMiddleware,
                bcptWebSocketMiddleware,
                routerMiddleware(history),
                createLogger()
            )
        )
    )
};

export default configureStore;