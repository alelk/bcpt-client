/**
 * BCPT Web Socket Middleware
 *
 * Created by Alex Elkin on 10.11.2017.
 */

import {connectStompClient} from '../actions/webSocketActions'
import {createStompClient, subscribeImporterProcesses} from '../api/bcptWebSocketApi'
import {validateCallApiTypes, validateIsString} from './util'
import {updateImporterProcesses} from '../actions/importerActions'

export const CALL_BCPT_WEB_SOCKET = 'CALL_BCPT_WEB_SOCKET';

let stompClient = null;

let importerProcessesSubscription = null;

export default store => nextProcedure => action => {

    const callApi = action[CALL_BCPT_WEB_SOCKET];
    if (typeof callApi === 'undefined') return nextProcedure(action);

    const {types, method} = callApi;
    validateIsString(method, "Expected a method signature");
    validateCallApiTypes(types);

    const actionWith = data => {
        const newAction = Object.assign({}, action, data);
        delete newAction[CALL_BCPT_WEB_SOCKET];
        return newAction;
    };

    const _subscribeImporterProcesses = () => {
        if (importerProcessesSubscription) return;
        importerProcessesSubscription = subscribeImporterProcesses(stompClient, (response) => {
            store.dispatch(updateImporterProcesses(response));
        });
    };

    const [requestType, successType, failureType] = types;
    nextProcedure(actionWith({type: requestType}));

    if (/connect/.test(method)) {
        if (stompClient) {
            nextProcedure(actionWith({type: successType, message: "Stomp Client is already connected."}));
            return;
        }
        stompClient = createStompClient();
        stompClient.connect({}, () => {
            stompClient.debug = null;
            const {stompClientSubscriptions} = store.getState();
            if (stompClientSubscriptions.importer && stompClientSubscriptions.importer.subscribers > 0)
                _subscribeImporterProcesses();
            nextProcedure(actionWith({type: successType}));
        }, (exc) => {
            nextProcedure(actionWith({type: failureType, error: "Unable to connect BCMS Stomp client: " + exc}))
        })
    } else if (/^subscribe.*/.test(method)) {
        if (!stompClient) {
            store.dispatch(connectStompClient());
            nextProcedure(actionWith({type: successType}));
        } else if (/^subscribeImporterProcesses/.test(method)) {
            nextProcedure(actionWith({type: successType}));
            _subscribeImporterProcesses();
        }
    } else if (/^unsubscribeImporterProcesses/.test(method)) {
        if (importerProcessesSubscription) {
            importerProcessesSubscription.unsubscribe();
            nextProcedure(actionWith({type: successType}));
        } else {
            nextProcedure(actionWith({type: failureType,
                error: "Unable to unsubscribe  importer processes: No subscription found."
            }));
        }
    } else {
        nextProcedure(actionWith({type: failureType, error: "Unexpected method: " + method}));
    }
}