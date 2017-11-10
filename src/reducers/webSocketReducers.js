/**
 * Web Socket Reducers
 *
 * Created by Alex Elkin on 10.11.2017.
 */

import {
    ACTION_SUBSCRIBE_IMPORT_PROCESS_REQUEST
} from '../actions/importerActions'

import {objectWith} from './util'

export const stompClient = (state = {}, action) => {
    return state;
};

const subscriptionWith = (state, subscriptionId, changes) => {
    const subscription = objectWith(state[subscriptionId]);
    subscription.subscribers = (subscription.subscribers || 0) + 1;
    return objectWith(state, {[subscriptionId] : objectWith(subscription, changes)})
};

export const importerSubscriptions = (state = {}, action) => {
    const {type, importerProcessId} = action;
    if (ACTION_SUBSCRIBE_IMPORT_PROCESS_REQUEST === type && importerProcessId)
        return subscriptionWith(state, importerProcessId, undefined);
    return state;
};