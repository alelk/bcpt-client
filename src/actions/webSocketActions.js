/**
 * Web Socket Actions
 *
 * Created by Alex Elkin on 10.11.2017.
 */

import {CALL_BCPT_WEB_SOCKET} from '../middleware/bcptWebSocketMiddleware'

export const ACTION_CONNECT_STOMP_CLIENT_REQUEST = 'ACTION_CONNECT_STOMP_CLIENT_REQUEST';
export const ACTION_CONNECT_STOMP_CLIENT_SUCCESS = 'ACTION_CONNECT_STOMP_CLIENT_SUCCESS';
export const ACTION_CONNECT_STOMP_CLIENT_FAILURE = 'ACTION_CONNECT_STOMP_CLIENT_FAILURE';

const connectStompClientWithApi = () => ({
    [CALL_BCPT_WEB_SOCKET] : {
        types : [ACTION_CONNECT_STOMP_CLIENT_REQUEST, ACTION_CONNECT_STOMP_CLIENT_SUCCESS, ACTION_CONNECT_STOMP_CLIENT_FAILURE],
        method : 'connect'
    }
});

export const connectStompClient = () => dispatch => dispatch(connectStompClientWithApi());