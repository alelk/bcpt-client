/**
 * Bcpt Rest API
 *
 * Created by Alex Elkin on 12.09.2017.
 */

import BcptConfig from '../util/BcptConfig'

import { schema } from 'normalizr'
import urlencode from 'urlencode'
import {extractTableName} from '../util/util'
import {deleteObject, getObject, postObject, putObject} from './fetchFunctions'

const personSchema = new schema.Entity('persons', {}, { idAttribute : value => value.externalId });
const personsSchema = new schema.Array(personSchema);
const personPageSchema = new schema.Entity('pages', {items:personsSchema}, { idAttribute : value => value.pageNumber });
const bloodDonationSchema = new schema.Entity('bloodDonations', {}, { idAttribute : value => value.externalId });
const bloodDonationsSchema = new schema.Array(bloodDonationSchema);
const bloodDonationPageSchema = new schema.Entity('pages', {items:bloodDonationsSchema}, { idAttribute : value => value.pageNumber });
const bloodInvoiceSchema = new schema.Entity('bloodInvoices', {}, { idAttribute : value => value.externalId });
const bloodInvoicesSchema = new schema.Array(bloodInvoiceSchema);
const bloodInvoicePageSchema = new schema.Entity('pages', {items:bloodInvoicesSchema}, { idAttribute : value => value.pageNumber });
const bloodInvoiceSeriesSchema = new schema.Entity('bloodInvoiceSeries', {}, { idAttribute : value => value.externalId });
const bloodInvoiceSeriesSetSchema = new schema.Array(bloodInvoiceSeriesSchema);
const bloodInvoiceSeriesPageSchema = new schema.Entity('pages', {items:bloodInvoiceSeriesSetSchema}, { idAttribute : value => value.pageNumber });
const bloodPoolSchema = new schema.Entity('bloodPools', {}, { idAttribute : value => value.externalId });
const bloodPoolsSchema = new schema.Array(bloodPoolSchema);
const bloodPoolPageSchema = new schema.Entity('pages', {items:bloodPoolsSchema}, { idAttribute : value => value.pageNumber });
const bloodPoolAnalysisSchema = new schema.Entity('bloodPoolAnalysis', {}, { idAttribute : value => value.externalId });
const bloodPoolAnalysisSetSchema = new schema.Array(bloodPoolAnalysisSchema);
const bloodPoolAnalysisPageSchema = new schema.Entity('pages', {items:bloodPoolAnalysisSetSchema}, { idAttribute : value => value.pageNumber });
const productBatchSchema = new schema.Entity('productBatches', {}, { idAttribute : value => value.externalId });
const productBatchesSchema = new schema.Array(productBatchSchema);
const productBatchPageSchema = new schema.Entity('pages', {items:productBatchesSchema}, { idAttribute : value => value.pageNumber });

const SchemaPage = {
    persons : personPageSchema,
    bloodDonations : bloodDonationPageSchema,
    bloodInvoices : bloodInvoicePageSchema,
    bloodInvoiceSeries : bloodInvoiceSeriesPageSchema,
    bloodPools : bloodPoolPageSchema,
    bloodPoolAnalysis : bloodPoolAnalysisPageSchema,
    productBatches : productBatchPageSchema
};

const SchemaTable = {
    persons : personsSchema,
    bloodDonations : bloodDonationsSchema,
    bloodInvoices: bloodInvoicesSchema,
    bloodInvoiceSeries: bloodInvoiceSeriesSetSchema,
    bloodPools : bloodPoolsSchema,
    bloodPoolAnalysis : bloodPoolAnalysisSetSchema,
    productBatches : productBatchesSchema
};

const SchemaTableEntity = {
    persons : personSchema,
    bloodDonations : bloodDonationSchema,
    bloodInvoices: bloodInvoiceSchema,
    bloodInvoiceSeries: bloodInvoiceSeriesSchema,
    bloodPools : bloodPoolSchema,
    bloodPoolAnalysis : bloodPoolAnalysisSchema,
    productBatches : productBatchSchema
};

export const sortedAsParams = (sorted) => {
    return Array.isArray(sorted) ? sorted.map(s => "sortBy=" + s.id + ":" + (s.desc ? 'desc' : 'asc')).join("&") : '';
};

export const filteredAsParams = (filtered) => {
    return Array.isArray(filtered) ? filtered.map(f => "filter=" + (f.id || f.key) + ":" + urlencode(f.value)).join("&") : '';
};

export const getTablePage = function (tableId, pageNumber, itemsPerPage, sorted, filtered) {
    const tableName = extractTableName(tableId);
    const url = BcptConfig.get("rest-api-uri") + tableName + "/page/" + pageNumber + "?itemsPerPage=" + itemsPerPage +
        "&" + sortedAsParams(sorted) + "&" + filteredAsParams(filtered);
    console.log("Get table page: " + url);
    return getObject(
        url,
        SchemaPage[tableName]
    )
};

export const getTableEntity = function (tableId, externalId) {
    const tableName = extractTableName(tableId);
    return getObject(BcptConfig.get("rest-api-uri") + tableName + "/" + externalId, SchemaTableEntity[tableName])
};

export const getTable = function (tableId) {
    const tableName = extractTableName(tableId);
    return getObject(BcptConfig.get("rest-api-uri") + tableName + "/", SchemaTable[tableName])
};

export const postTableEntity = function (tableId, data) {
    const tableName = extractTableName(tableId);
    return postObject(BcptConfig.get("rest-api-uri") + tableName + "/", data, SchemaTableEntity[tableName])
};

export const putTableEntity = function (tableId, externalId, data) {
    const tableName = extractTableName(tableId);
    return putObject(BcptConfig.get("rest-api-uri") + tableName + "/" + (externalId || ''), data, SchemaTableEntity[tableName])
};

export const deleteTableEntity = function (tableId, externalId) {
    const tableName = extractTableName(tableId);
    return deleteObject(BcptConfig.get("rest-api-uri") + tableName + "/", {externalId})
};