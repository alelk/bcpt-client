/**
 * Common Fetch Functions
 *
 * Created by Alex Elkin on 02.11.2017.
 */
import { normalize} from 'normalizr'

export const putObject = function (uri, json, schema) {
    return fetchBcptApi(uri, {
        method: 'put',
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin':'*',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    }, schema)
};

export const postObject = function (uri, json, schema) {
    return fetchBcptApi(uri, {
        method: 'post',
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin':'*',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    }, schema)
};

export const deleteObject = function(uri, json) {
    return fetchBcptApi(uri, {
        method:'delete',
        mode: 'cors',
        headers: {
            'Access-Control-Allow-Origin':'*',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    }, undefined);
};

export const getObject = function(uri, schema) {
    return fetchBcptApi(uri, undefined, schema);
};

export const fetchBcptApi = function (uri, requestBody, schema) {
    return fetch(uri, requestBody).then(response =>
        response.json().then(json => {
            if (!response.ok) return Promise.reject(json);
            return schema ? normalize(json, schema) : json;
        })
    );
};