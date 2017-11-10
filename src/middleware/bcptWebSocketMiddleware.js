/**
 * BCPT Web Socket Middleware
 *
 * Created by Alex Elkin on 10.11.2017.
 */

import {connectStompClient} from '../actions/webSocketActions'
import {createStompClient, subscribeImporterProcess} from '../api/bcptWebSocketApi'
import {validateCallApiTypes, validateIsString} from './util'

export const CALL_BCPT_WEB_SOCKET = 'CALL_BCPT_WEB_SOCKET';

let stompClient = null;

const _importerSubscriptions = {};

export default store => nextProcedure => action => {

    const callApi = action[CALL_BCPT_WEB_SOCKET];
    if (typeof callApi === 'undefined') return nextProcedure(action);

    const {types, method, importerProcessId} = callApi;
    validateIsString(method, "Expected a method signature");
    validateCallApiTypes(types);

    const actionWith = data => {
        const newAction = Object.assign({}, action, data);
        delete newAction[CALL_BCPT_WEB_SOCKET];
        return newAction;
    };

    const _subscribeImporterProcess = (importerProcessId) => {
        if (_importerSubscriptions[importerProcessId]) return;
        console.log("Subscribe importer process : " + importerProcessId);
        _importerSubscriptions[importerProcessId] = subscribeImporterProcess(stompClient, importerProcessId, (message) => {
            let processStatus = JSON.parse(message.body);
            //todo add functionality
            console.log("Process status ", processStatus)
        });
    };

    const [requestType, successType, failureType] = types;
    nextProcedure(actionWith({type: requestType, importerProcessId}));

    if (/connect/.test(method)) {
        if (stompClient) {
            nextProcedure(actionWith({type: successType, message: "Stomp Client is already connected."}));
            return;
        }
        stompClient = createStompClient();
        stompClient.connect({}, () => {
            stompClient.debug = null;
            const {importerSubscriptions} = store.getState();
            Object.keys(importerSubscriptions).forEach(key => {
                if (importerSubscriptions[key].subscribers > 0)
                    _subscribeImporterProcess(key)
            });
            nextProcedure(actionWith({type: successType}));
        }, (exc) => {
            nextProcedure(actionWith({type: failureType, error: "Unable to connect BCMS Stomp client: " + exc}))
        })
    } else if (/^subscribe.*/.test(method)) {
        if (!stompClient) {
            store.dispatch(connectStompClient());
            nextProcedure(actionWith({type: successType}));
        } else if (/^subscribeImporterProcess/.test(method)) {
            nextProcedure(actionWith({type: successType}));
            _subscribeImporterProcess(importerProcessId);
        }
    } else if (/^unsubscribeImporterProcess/.test(method)) {
        const {importerSubscriptions} = store.getState();
        if (importerSubscriptions[importerProcessId]
            && importerSubscriptions[importerProcessId].subscribers <= 0
            && _importerSubscriptions[importerProcessId]) {
            _importerSubscriptions[importerProcessId].unsubscribe();
            nextProcedure(actionWith({type: successType}));
        } else {
            nextProcedure(actionWith({type: failureType,
                error: "Unable to unsubscribe  importer process '" + importerProcessId + "': No subscription found."
            }));
        }
    } else {
        nextProcedure(actionWith({type: failureType, error: "Unexpected method: " + method}));
    }
}