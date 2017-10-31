/**
 * Cell Utils
 *
 * Created by Alex Elkin on 10.10.2017.
 */

export const onCellChange = (value, column, row) => {
    column.onChange && column.onChange(value, row, column);
};

export const getErrorIfExists = (original, column) => {
    const error = Array.isArray(original.errors) && original.errors.find(err => err && err.field === column.id);
    return error ? error.defaultMessage : undefined;
};