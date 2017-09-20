/**
 * Bcpt Rest API
 *
 * Created by Alex Elkin on 12.09.2017.
 */

import BcptConfig from '../util/BcptConfig'

import { normalize, schema } from 'normalizr'

const personSchema = new schema.Entity('persons', {}, { idAttribute : value => value.externalId });
const personsSchema = new schema.Array(personSchema);

const SchemaTable = {
    persons : personsSchema,
};

const SchemaTableEntity = {
    persons : personSchema
};

export const getTable = function (tableName) {
    return getObject(BcptConfig.get("rest-api-uri") + tableName + "/", SchemaTable[tableName])
};

export const getTableEntity = function (tableName, externalId) {
    return getObject(BcptConfig.get("rest-api-uri") + tableName + "/" + externalId, SchemaTableEntity[tableName])
};

export const postTableEntity = function (tableName, data) {
    return postObject(BcptConfig.get("rest-api-uri") + tableName + "/", data, SchemaTableEntity[tableName])
};

export const putTableEntity = function (tableName, externalId, data) {
    return putObject(BcptConfig.get("rest-api-uri") + tableName + "/" + (externalId || ''), data, SchemaTableEntity[tableName])
};

export const deleteTableEntity = function (tableName, externalId) {
    return deleteObject(BcptConfig.get("rest-api-uri") + tableName + "/" + (externalId || ''), undefined)
};

const putObject = function (uri, json, schema) {
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

const postObject = function (uri, json, schema) {
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

const getObject = function(uri, schema) {
    return fetchBcptApi(uri, undefined, schema);
};

const deleteObject = function(uri) {
    return fetchBcptApi(uri, {method:'delete'}, undefined);
};

const fetchBcptApi = function (uri, requestBody, schema) {
    return fetch(uri, requestBody).then(response =>
        response.json().then(json => {
            if (!response.ok) return Promise.reject(json);
            return schema !== undefined ? normalize(json, schema) : json;
        })
    );
};