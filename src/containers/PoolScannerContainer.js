/**
 * Pool Scanner Container
 *
 * Created by Alex Elkin on 15.12.2017.
 */

import {changeDrawerState, tableRowChange} from '../actions/actions'
import {
    changeScanningConfig, addScannedDonationAndAssignToPool as addScannedDonation, removeScannedDonation,
    assignScannedDonationToPool, removeDonationFromPool, saveScannedData
} from '../actions/poolScanningActions'
import PoolScaner from '../components/poolscanner/PoolScanner'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const PoolScannerContainer = ({
    isDrawerOpened, changeDrawerState, poolScannerConfig, poolScannerErrors, changeScanningConfig, addScannedDonation,
    scannedDonations, bloodDonations, tableRowChange, removeScannedDonation, assignScannedDonationToPool, bloodPools,
    scannedPools, removeDonationFromPool, saveScannedData, poolScannerState
}) => {
    const bloodDonationsByExternalId = bloodDonations ? Object.keys(bloodDonations)
            .map(key => Object.assign({localId: key}, bloodDonations[key]))
            .reduce((acc, bd) => Object.assign(acc, {[bd.externalId] : bd}), {}) : [];
    const scnDonations = bloodDonations && Object.keys(scannedDonations).map(key => scannedDonations[key])
            .sort((sd1, sd2) => sd2.timestamp - sd1.timestamp)
            .map(scannedDonation =>
                Object.assign(
                    {},
                    scannedDonation,
                    bloodDonations[scannedDonation.localId] || bloodDonationsByExternalId[scannedDonation.externalId]
                )
            );
    const scnPools = bloodPools && Object.keys(scannedPools).map(key => scannedPools[key])
            .sort((sp1, sp2) => sp2.timestamp - sp1.timestamp)
            .map(scannedPool =>
                Object.assign({}, scannedPool, bloodPools[scannedPool.localId] || bloodPools[scannedPool.externalId])
            ).map(bloodPool => {
                const _bloodDonations = (bloodPool.bloodDonations || []).map(donationId =>
                    bloodDonations[donationId] ? Object.assign({localId: donationId}, bloodDonations[donationId]) :
                        bloodDonationsByExternalId[donationId]
                );
                return Object.assign({}, bloodPool, {bloodDonations: _bloodDonations})
            });
    return (
        <PoolScaner onDrawerChangeDrawerVisibilityRequest={() => changeDrawerState({isDrawerOpened: !isDrawerOpened})}
                    poolScannerState={poolScannerState}
                    poolScannerConfig={poolScannerConfig}
                    poolScannerErrors={poolScannerErrors}
                    onScannerConfigChange={changeScanningConfig}
                    onNewDonationScanned={addScannedDonation}
                    onRemoveScannedDonation={removeScannedDonation}
                    onAssignDonationToPool={assignScannedDonationToPool}
                    onRemoveDonationFromPool={removeDonationFromPool}
                    onApplyChanges={saveScannedData}
                    onChangeBloodDonation={(localId, changes) => tableRowChange("bloodDonations", localId, changes)}
                    scannedDonations={scnDonations}
                    scannedPools={scnPools}
        />
    )
};
PoolScannerContainer.propTypes = {
    isDrawerOpened: PropTypes.bool,
    changeDrawerState: PropTypes.func,
    poolScannerState: PropTypes.object,
    poolScannerConfig: PropTypes.object,
    pollScannerErrors: PropTypes.object,
    changeScanningConfig: PropTypes.func,
    tableRowChange: PropTypes.func,
    addScannedDonation: PropTypes.func,
    removeScannedDonation: PropTypes.func,
    assignScannedDonationToPool: PropTypes.func,
    removeDonationFromPool: PropTypes.func,
    saveScannedData: PropTypes.func,
    scannedDonations: PropTypes.object,
};
const mapStateToProps = (state, ownProps) => ({
    isDrawerOpened: state.drawer.isDrawerOpened,
    poolScannerState: state.poolScanner,
    poolScannerConfig: state.poolScanningConfigs,
    poolScannerErrors: state.poolScanningErrors,
    scannedDonations: state.scannedDonations,
    scannedPools: state.scannedPools,
    bloodDonations: state.tableItems["bloodDonations"],
    bloodPools: state.tableItems["bloodPools"],
});
export default connect(
    mapStateToProps, {
        changeDrawerState, changeScanningConfig, addScannedDonation, tableRowChange, removeScannedDonation,
        assignScannedDonationToPool, removeDonationFromPool, saveScannedData
    }
)(PoolScannerContainer);
