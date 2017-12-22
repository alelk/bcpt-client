/**
 * Blood Pool Analysis Table
 *
 * Created by Alex Elkin on 23.11.2017.
 */

import TextCell from './cell/TextCell'
import ArrayCell from './cell/ArrayCell'
import IconCell from './cell/IconCell'
import DateTimeCell from './cell/DateTimeCell'
import TextFilter from './filter/TextFilter'
import Table from './Table'

import PropTypes from 'prop-types'

class BloodPoolAnalysisTable extends Table {

    columns() {
        return [
            {
                Header: "",
                accessor: "localId",
                iconName: "colorize",
                Cell: IconCell,
                width: 30,
                filterable: false
            }, {
                Header: "ID пула",
                accessor: "externalId",
                onChange: this.onValueChange,
                Cell: TextCell,
                isEditable: true,
                filterable: true,
                Filter: TextFilter
            }, {
                Header: "Номер пула",
                accessor: "poolNumber",
                Cell: TextCell,
                isEditable: false,
                filterable: false,
                sortable: false,
            }, {
                Header: "pH",
                accessor: "pH",
                onChange: this.onValueChange,
                Cell: TextCell,
                type: "number",
                isEditable: true,
                filterable: false,
                sortable: true,
                Filter: TextFilter
            },{
                Header: "Концентрация белка",
                accessor: "proteinConcentration",
                onChange: this.onValueChange,
                Cell: TextCell,
                type: "number",
                isEditable: true,
                filterable: false,
                sortable: true,
                Filter: TextFilter
            }, {
                Header: "Контейнеры с плазмой",
                accessor: "bloodDonations",
                iconName: "invert_colors",
                onClick: this.onBloodDonationsClick,
                Cell: ArrayCell,
                sortable: false,
                isEditable: false,
                filterable: false,
                minWidth: 180
            }, {
                Header: "ID загрузки",
                accessor: "productBatch",
                Cell: TextCell,
                isEditable: false,
                filterable: true,
                sortable: false,
                Filter: TextFilter
            }, {
                Header: "Последнее изменение",
                accessor: "updateTimestamp",
                inputType: "datetime-local",
                Cell: DateTimeCell,
                minWidth: 160
            }
        ];
    }
}
const dataItem = PropTypes.shape({
    isChecked : PropTypes.bool,
    localId : PropTypes.string,
    externalId : PropTypes.string,
    productBatch : PropTypes.string,
    pH : PropTypes.number,
    proteinConcentration: PropTypes.number,
    bloodDonations : PropTypes.arrayOf(PropTypes.string),
    poolNumber : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateTimestamp : PropTypes.string,
    errors : PropTypes.object | PropTypes.array
});
BloodPoolAnalysisTable.propTypes = {
    name : PropTypes.string,
    data : PropTypes.arrayOf(dataItem),
    checkedItems : PropTypes.arrayOf(dataItem),
    pagesCount: PropTypes.number,
    isFetching : PropTypes.bool,
    isEditing : PropTypes.bool,
    onChange : PropTypes.func,
    onCheckRow : PropTypes.func,
    onDeleteRow : PropTypes.func,
    onEditRow : PropTypes.func,
    onFetchData: PropTypes.func,
    onResetChanges : PropTypes.func,
    onRefreshData : PropTypes.func,
    onSaveChanges : PropTypes.func,
    onAddNewItem : PropTypes.func,
    onBloodDonationsClick: PropTypes.func,
    isSimpleTable : PropTypes.bool,
    subComponent : PropTypes.func,
    filtered : PropTypes.arrayOf(PropTypes.shape({id:PropTypes.string, value:PropTypes.string}))
};

export default BloodPoolAnalysisTable;