/**
 * Cell Utils
 *
 * Created by Alex Elkin on 10.10.2017.
 */

export const onCellChange = (value, column, row) => {
    column.onChange && column.onChange(value, row, column);
};