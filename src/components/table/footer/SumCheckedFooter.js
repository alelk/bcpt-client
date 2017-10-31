/**
 * Sum Checked Footer
 *
 * Created by Alex Elkin on 27.10.2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import './SumCheckedFooter.css'

const SumCheckedFooter = ({checkedItems, column}) => {
    const sum = checkedItems && checkedItems.reduce((total, item) => total + item[column.id], 0);
    return sum ? (
            <div className="SumCheckedFooter">
                <label><span className="label">Всего: </span><span className="value">{sum}</span></label>
            </div>
        ) : null;
};
SumCheckedFooter.propTypes = {
    checkedItems: PropTypes.array,
    column: PropTypes.shape({
        id : PropTypes.string
    })
};
export default SumCheckedFooter;