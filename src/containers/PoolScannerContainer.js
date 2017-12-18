/**
 * Pool Scanner Container
 *
 * Created by Alex Elkin on 15.12.2017.
 */

import {changeDrawerState, tableRowChange} from '../actions/actions'
import {
    changeScanningConfig, addScannedDonation, removeScannedDonation, assignScannedDonationToPool
} from '../actions/poolScanningActions'
import PoolScaner from '../components/poolscanner/PoolScanner'

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const PoolScannerContainer = ({
    isDrawerOpened, changeDrawerState, poolScannerConfig, poolScannerErrors, changeScanningConfig, addScannedDonation,
    scannedDonations, bloodDonations, tableRowChange, removeScannedDonation, assignScannedDonationToPool
}) => {
    const scnDonations = bloodDonations && Object.keys(scannedDonations).map(key => scannedDonations[key])
            .sort((sd1, sd2) => sd2.timestamp - sd1.timestamp)
            .map(scannedDonation => Object.assign({}, scannedDonation, bloodDonations[scannedDonation.localId]));
    return (
        <PoolScaner onDrawerChangeDrawerVisibilityRequest={() => changeDrawerState({isDrawerOpened: !isDrawerOpened})}
                    poolScannerConfig={poolScannerConfig}
                    poolScannerErrors={poolScannerErrors}
                    onScannerConfigChange={changeScanningConfig}
                    onNewDonationScanned={addScannedDonation}
                    onRemoveScannedDonation={removeScannedDonation}
                    onAssignDonationToPool={assignScannedDonationToPool}
                    onChangeBloodDonation={(localId, changes) => tableRowChange("bloodDonations", localId, changes)}
                    scannedDonations={scnDonations}
        />
    )
};
PoolScannerContainer.propTypes = {
    isDrawerOpened: PropTypes.bool,
    changeDrawerState: PropTypes.func,
    poolScannerConfig: PropTypes.object,
    pollScannerErrors: PropTypes.object,
    changeScanningConfig: PropTypes.func,
    tableRowChange: PropTypes.func,
    addScannedDonation: PropTypes.func,
    removeScannedDonation: PropTypes.func,
    assignScannedDonationToPool: PropTypes.func,
    scannedDonations: PropTypes.object,
};
const mapStateToProps = (state, ownProps) => ({
    isDrawerOpened: state.drawer.isDrawerOpened,
    poolScannerConfig: state.poolScanningConfigs,
    poolScannerErrors: state.poolScanningErrors,
    scannedDonations: state.scannedDonations,
    bloodDonations: state.tableItems["bloodDonations"]
});
export default connect(
    mapStateToProps, {
        changeDrawerState, changeScanningConfig, addScannedDonation, tableRowChange, removeScannedDonation,
        assignScannedDonationToPool
    }
)(PoolScannerContainer);
