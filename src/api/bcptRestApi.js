/**
 * Bcpt Rest API
 *
 * Created by Alex Elkin on 12.09.2017.
 */

import BcptConfig from '../util/BcptConfig'

import { normalize, schema } from 'normalizr'
import urlencode from 'urlencode'

const personSchema = new schema.Entity('persons', {}, { idAttribute : value => value.externalId });
const personsSchema = new schema.Array(personSchema);
const personPageSchema = new schema.Entity('pages', {items:personsSchema}, { idAttribute : value => value.pageNumber });

const bloodDonationSchema = new schema.Entity('bloodDonations', {}, { idAttribute : value => value.externalId });
const bloodDonationsSchema = new schema.Array(bloodDonationSchema);
const bloodInvoiceSchema = new schema.Entity('bloodInvoices', {}, { idAttribute : value => value.externalId });
const bloodInvoicesSchema = new schema.Array(bloodInvoiceSchema);
const bloodPoolSchema = new schema.Entity('bloodPools', {}, { idAttribute : value => value.externalId });
const bloodPoolsSchema = new schema.Array(bloodPoolSchema);
const productBatchSchema = new schema.Entity('productBatches', {}, { idAttribute : value => value.externalId });
const productBatchesSchema = new schema.Array(productBatchSchema);

const SchemaPage = {
    persons : personPageSchema
};

const SchemaTable = {
    persons : personsSchema,
    bloodDonations : bloodDonationsSchema,
    bloodInvoices: bloodInvoicesSchema,
    bloodPools : bloodPoolsSchema,
    productBatches : productBatchesSchema
};

const SchemaTableEntity = {
    persons : personSchema,
    bloodDonations : bloodDonationSchema,
    bloodInvoices: bloodInvoiceSchema,
    bloodPools : bloodPoolSchema,
    productBatches : productBatchSchema
};

export const sortedAsParams = (sorted) => {
    return Array.isArray(sorted) ? sorted.map(s => "sortBy=" + s.id + ":" + (s.desc ? 'desc' : 'asc')).join("&") : '';
};

export const filteredAsParams = (filtered) => {
    return Array.isArray(filtered) ? filtered.map(f => "filter=" + f.id + ":" + urlencode(f.value)).join("&") : '';
};

export const getTablePage = function (tableName, pageNumber, itemsPerPage, sorted, filtered) {
    const url = BcptConfig.get("rest-api-uri") + tableName + "/page/" + pageNumber + "?itemsPerPage=" + itemsPerPage +
        "&" + sortedAsParams(sorted) + "&" + filteredAsParams(filtered);
    console.log("Get table page: " + url);
    return getObject(
        url,
        SchemaPage[tableName]
    )
};

export const getTableEntity = function (tableName, externalId) {
    return getObject(BcptConfig.get("rest-api-uri") + tableName + "/" + externalId, SchemaTableEntity[tableName])
};

export const getTable = function (tableName) {
    return getObject(BcptConfig.get("rest-api-uri") + tableName + "/", SchemaTable[tableName])
};

export const postTableEntity = function (tableName, data) {
    return postObject(BcptConfig.get("rest-api-uri") + tableName + "/", data, SchemaTableEntity[tableName])
};

export const putTableEntity = function (tableName, externalId, data) {
    return putObject(BcptConfig.get("rest-api-uri") + tableName + "/" + (externalId || ''), data, SchemaTableEntity[tableName])
};

export const deleteTableEntity = function (tableName, externalId) {
    return deleteObject(BcptConfig.get("rest-api-uri") + tableName + "/", {externalId})
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

const deleteObject = function(uri, json) {
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

const getObject = function(uri, schema) {
    return fetchBcptApi(uri, undefined, schema);
};

const fetchBcptApi = function (uri, requestBody, schema) {
    return fetch(uri, requestBody).then(response =>
        response.json().then(json => {
            if (!response.ok) return Promise.reject(json);
            return schema !== undefined ? normalize(json, schema) : json;
        })
    );
};