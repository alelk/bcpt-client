/**
 * Web Socket Reducers
 *
 * Created by Alex Elkin on 10.11.2017.
 */

import {
    ACTION_CONNECT_STOMP_CLIENT_REQUEST,
    ACTION_CONNECT_STOMP_CLIENT_SUCCESS,
    ACTION_CONNECT_STOMP_CLIENT_FAILURE
} from '../actions/webSocketActions'

import {
    ACTION_SUBSCRIBE_IMPORT_PROCESSES_REQUEST,
    ACTION_UNSUBSCRIBE_IMPORT_PROCESSES_REQUEST
} from '../actions/importerActions'

import {objectWith} from './util'

export const stompClient = (state = {}, action) => {
    const {type} = action;
    if (type === ACTION_CONNECT_STOMP_CLIENT_REQUEST)
        return objectWith(state, {isConnected: false, isConnecting: true});
    else if (type === ACTION_CONNECT_STOMP_CLIENT_SUCCESS)
        return objectWith(state, {isConnected: true, isConnecting: false});
    else if (type === ACTION_CONNECT_STOMP_CLIENT_FAILURE)
        return objectWith(state, {isConnected: false, isConnecting: false});
    return state;
};

const subscriptionWith = (state, subscriptionType, changes) => {
    const subscription = objectWith(state[subscriptionType]);
    return objectWith(state, {[subscriptionType] : objectWith(subscription, changes)})
};

export const stompClientSubscriptions = (state = {}, action) => {
    const {type} = action;
    if (type == ACTION_SUBSCRIBE_IMPORT_PROCESSES_REQUEST)
        return subscriptionWith(state, "importer", {subscribers : (state.importer ? state.importer.subscribers + 1 : 1)});
    if (type == ACTION_UNSUBSCRIBE_IMPORT_PROCESSES_REQUEST)
        return subscriptionWith(state, "importer", {
            subscribers : (state.importer && state.importer.subscribers > 0 ? state.importer.subscribers - 1 : 0)
        });
    return state;
};