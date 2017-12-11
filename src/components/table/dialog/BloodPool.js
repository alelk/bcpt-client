/**
 * Blood Pool
 *
 * Created by Alex Elkin on 30.11.2017.
 */
import {bloodDonationType} from '../BloodDonationsTable'

import React from 'react';
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper';
import LinearProgress from 'material-ui/LinearProgress';
import Chip from 'material-ui/Chip';

const BloodPool = ({bloodPool, totalAmountLimit, onDeleteBloodDonation, productBatchId}) => {
    const {poolNumber, totalAmount, bloodDonations} = bloodPool;
    return (
        <Paper style={{width: '100%', margin: '20px 0'}} zDepth={3}>
            <div>
                <span>Загрузка</span>
                <span style={{fontSize: '2em', padding: 10}}>{productBatchId}</span>
                <span>Пул №</span>
                <span style={{fontSize: '2em', padding: 10}}>{poolNumber}</span>
                <span>Объём:</span>
                <span style={{fontSize: '2em', padding: 10}}>{totalAmount} мл.</span>
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {bloodDonations && Object.keys(bloodDonations).map(bloodDonationId => {
                    const {amount, localId, externalId} = bloodDonations[bloodDonationId];
                    return (
                        <Chip key={bloodDonationId} style={{margin: 6}}
                              onRequestDelete={onDeleteBloodDonation && (() => onDeleteBloodDonation(localId, poolNumber))}>
                            {externalId} ({amount} мл.)
                        </Chip>
                    )
                })}
            </div>
            {totalAmountLimit && <LinearProgress mode="determinate" min={0} max={totalAmountLimit} value={parseInt(totalAmount, 10)}/>}
        </Paper>
    )
};
BloodPool.propTypes = {
    bloodPool: PropTypes.shape({
        poolNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        totalAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        bloodDonations: PropTypes.objectOf(bloodDonationType)
    }),
    productBatchId: PropTypes.string,
    totalAmountLimit: PropTypes.number,
    onDeleteBloodDonation: PropTypes.func
};
export default BloodPool;