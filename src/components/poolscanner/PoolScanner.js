/**
 * Pool Scanner
 *
 * Created by Alex Elkin on 15.12.2017.
 */

import AppPage from '../AppPage'
import PoolScannerConfigs from './PoolScannerConfigs'
import DonationScanningField from './DonationsScanningField'

import BloodPool from './BloodPool'
import BloodDonation from './BloodDonation'

import React from 'react'
import PropTypes from 'prop-types'
import {Card, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

class PoolScanner extends React.Component {
    constructor(props) {
        super(props);
        this.onNewBloodDonation = this.onNewBloodDonation.bind(this);
        this.onAddBloodDonationToPool = this.onAddBloodDonationToPool.bind(this);
        this.deleteFromPool = this.deleteFromPool.bind(this);
    }

    onNewBloodDonation(externalId, amount) {
        const {onNewDonationScanned} = this.props;
        onNewDonationScanned && onNewDonationScanned(externalId, {amount});
    }

    onAddBloodDonationToPool(localId) {
        const {poolScannerConfig, onAssignDonationToPool} = this.props;
        const {productBatch, poolNumber} = poolScannerConfig;
        if (onAssignDonationToPool) onAssignDonationToPool(localId, productBatch, poolNumber);
    }

    deleteFromPool(bloodDonationId, poolNumber, productBatchId) {
        const {onRemoveDonationFromPool} = this.props;
        if (onRemoveDonationFromPool) onRemoveDonationFromPool(bloodDonationId, productBatchId, poolNumber);
    }

    renderScannedDonations() {
        const {scannedDonations, poolScannerConfig, onChangeBloodDonation, onRemoveScannedDonation} = this.props;
        return scannedDonations ? (
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {scannedDonations.filter(sd => !sd.isAssignedToPool).map(bd =>
                        <BloodDonation key={bd.localId}
                                       bloodDonation={bd}
                                       poolNumber={poolScannerConfig.poolNumber}
                                       onApply={this.onAddBloodDonationToPool}
                                       onDeleteBloodDonation={localId => onRemoveScannedDonation(localId)}
                                       onChangeBloodDonation={onChangeBloodDonation}/>
                    )}
                </div>
            ) : undefined;
    }

    renderScannedPools() {
        const {scannedPools, poolScannerConfig} = this.props;
        const {totalAmountLimit} = poolScannerConfig;
        return scannedPools && scannedPools.map((pool, key) => (
                <BloodPool key={key} bloodPool={pool} totalAmountLimit={totalAmountLimit} onDeleteBloodDonation={this.deleteFromPool}/>
            ))
    }

    renderApplyButton() {
        const {onApplyChanges, poolScannerState} = this.props;
        const {isSaving, noChanges} = poolScannerState;
        return (
            <FlatButton label={noChanges ? "Нет изменений" : isSaving ? "Сохранение изменений..." : "Сохранить изменения"}
                        icon={isSaving ? <FontIcon className="material-icons">loop</FontIcon> : undefined}
                        onClick={onApplyChanges}
            />
        )
    }

    render() {
        const {
            poolScannerConfig, poolScannerErrors, onScannerConfigChange, onDrawerChangeDrawerVisibilityRequest, poolScannerState
        } = this.props;
        const {error, message} = poolScannerState;

        return (
            <AppPage className="PoolScanner"
                     title="Сканирование пакетов с плазмой"
                     onDrawerChangeDrawerVisibilityRequest={onDrawerChangeDrawerVisibilityRequest}
                     iconElementRight={this.renderApplyButton()}
            >
                <Card>
                    <CardText>
                        {
                            (error || message) && <CardTitle subtitle={error || message} subtitleColor={error ? "#990000" : "#008800"}/>
                        }
                        <PoolScannerConfigs config={poolScannerConfig}
                                            errors={poolScannerErrors}
                                            onChange={onScannerConfigChange}/>
                        <DonationScanningField onNewBloodDonation={this.onNewBloodDonation}/>
                        {poolScannerErrors && poolScannerErrors.scannedDonationError &&
                        <div><label style={{color:'red'}}>{poolScannerErrors.scannedDonationError}</label></div>
                        }
                        {this.renderScannedDonations()}
                        {this.renderScannedPools()}
                    </CardText>
                </Card>
            </AppPage>
        )
    }
}

export const bloodDonationType = PropTypes.shape({
    localId : PropTypes.string,
    externalId : PropTypes.string,
    bloodInvoice : PropTypes.string,
    bloodPool : PropTypes.string,
    amount : PropTypes.number,
    timestamp : PropTypes.number,
});
export const poolScannerConfigType = PropTypes.shape({
    productBatch: PropTypes.string,
    bloodInvoiceSeries : PropTypes.string,
    bloodInvoice: PropTypes.string,
    poolNumber: PropTypes.number,
    totalAmountLimit: PropTypes.number
});
export const poolScannerErrorType = PropTypes.shape({
    productBatchError: PropTypes.string,
    bloodInvoiceSeriesError: PropTypes.string,
    bloodInvoiceError: PropTypes.string,
    poolNumberError: PropTypes.string,
    totalAmountLimitError: PropTypes.string,
    scannedDonationError: PropTypes.string,
});
PoolScanner.propTypes = {
    onDrawerChangeDrawerVisibilityRequest : PropTypes.func,
    poolScannerState: PropTypes.shape({
        isSaving: PropTypes.bool,
        noChanges: PropTypes.bool,
        error: PropTypes.string,
        message: PropTypes.string
    }),
    poolScannerConfig: poolScannerConfigType.isRequired,
    poolScannerErrors: poolScannerErrorType.isRequired,
    onScannerConfigChange: PropTypes.func,
    onNewDonationScanned: PropTypes.func,
    onRemoveScannedDonation: PropTypes.func,
    onChangeBloodDonation: PropTypes.func,
    onAssignDonationToPool: PropTypes.func,
    onRemoveDonationFromPool: PropTypes.func,
    onApplyChanges: PropTypes.func,
    scannedDonations:PropTypes.arrayOf(bloodDonationType),
    scannedPools:PropTypes.arrayOf(PropTypes.shape({
        localId : PropTypes.string,
        externalId : PropTypes.string,
        totalAmount : PropTypes.number,
        timestamp : PropTypes.number,
        bloodDonations: PropTypes.arrayOf(bloodDonationType)
    }))
};
export default PoolScanner;