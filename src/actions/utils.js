/**
 * Utils
 *
 * Created by Alex Elkin on 14.12.2017.
 */

export const getTableRowByLocalIdOrExternalId = (tableItems, localId) => {
    let existingLocalId = tableItems && tableItems[localId] ? localId : undefined;
    if (!existingLocalId)
        existingLocalId = tableItems && Object.keys(tableItems).find(key => tableItems[key].externalId === localId);
    return existingLocalId && {...tableItems[existingLocalId], localId: existingLocalId};
};