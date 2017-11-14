/**
 * BCPT Web Socket API
 *
 * Created by Alex Elkin on 10.11.2017.
 */

import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import BcptConfig from '../util/BcptConfig'
import {importProcessSchema} from './bcptImporterApi'
import { normalize} from 'normalizr'

export const createStompClient = () => {
    return new Stomp.over(new SockJS(BcptConfig.get("rest-api-uri") + 'bcpt-websocket'));
};

export const subscribeImporterProcesses = (stompClient, callback) => {
    return stompClient.subscribe(
        "/socket-output/importer/",
        (message) => callback && message && message.body && callback(normalize(JSON.parse(message.body), importProcessSchema))
    );
};