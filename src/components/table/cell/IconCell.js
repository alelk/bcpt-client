/**
 * Icon Cell
 *
 * Created by Alex Elkin on 18.10.2017.
 */
import './Cell.css'

import React from 'react'
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon'

const IconCell = ({original, column}) => {
    return (
        <div key={original.localId} className={`Cell${(original.isDeleted && ' deleted') || ''}`}>
            <FontIcon className="material-icons rowIcon">{column.iconName}</FontIcon>
        </div>
    )
};


IconCell.propTypes = {
    original : PropTypes.shape({
        localId: PropTypes.string,
        isDeleted: PropTypes.bool
    }),
    column : PropTypes.shape({
        iconName: PropTypes.string
    }),
};

export default IconCell;