/**
 * BCPT Web Socket API
 *
 * Created by Alex Elkin on 10.11.2017.
 */

import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import BcptConfig from '../util/BcptConfig'

export const createStompClient = () => {
    return new Stomp.over(new SockJS(BcptConfig.get("rest-api-uri") + 'bcpt-websocket'));
};

export const subscribeImporterProcess = (stompClient, processId, callback) => {
    return stompClient.subscribe("/socket-output/importer/" + processId, callback);
};