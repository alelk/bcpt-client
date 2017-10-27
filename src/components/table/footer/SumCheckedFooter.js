/**
 * Sum Checked Footer
 *
 * Created by Alex Elkin on 27.10.2017.
 */

import React from 'react'
import './SumCheckedFooter.css'

const SumCheckedFooter = ({data, column}) => {
    const checkedItems = data && data.filter(d => d.isChecked);
    const sum = checkedItems && checkedItems.reduce((total, item) => total + item[column.id], 0);
    return sum ? (
        <div className="SumCheckedFooter">
            <label><span className="label">Всего: </span><span className="value">{sum}</span></label>
        </div>
    ) : undefined;
};

export default SumCheckedFooter;