/**
 * Util
 *
 * Created by Alex Elkin on 25.10.2017.
 */

export const extractTableName = (tableId) => /^(\w+)(~[\w_-]+)?$/g.exec(tableId)[1];

export const isSubtable = (tableId) => /^(\w+)(~[\w_-]+)$/g.test(tableId);