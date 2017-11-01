/**
 * Dbf File import Dialog
 *
 * Created by Alex Elkin on 01.11.2017.
 */

import React from 'react';
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class DbfFileImportDialog extends React.Component {

    constructor(props) {
        super(props);
        this.onDialogOpen = this.onDialogOpen.bind(this);
        this.onDialogClose = this.onDialogClose.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onFileSelected = this.onFileSelected.bind(this);
        this.state = {
            isDialogOpened: false,
            isValid: false,
        }
    }

    onDialogOpen() {
        this.setState({isDialogOpened: true})
    }

    onDialogClose() {
        this.setState({isDialogOpened: false});
    }

    onSubmit() {
        const {onSubmit} = this.props;
        onSubmit && onSubmit(this.state.file);
        this.setState({isDialogOpened: false});
    }

    onFileSelected(e) {
        const file = e.target.files[0];
        const isValid = this.validate(e.target.files[0]);
        this.setState({
            file,
            isValid,
            errorMessage: file ? isValid ? undefined : "Выбран неверный файл: ожидается файл формата txt (UTF-8)" : "Выберите файл"
        })
    }

    validate(file) {
        return file && /text\/plain/i.test(file.type);
    }

    actions() {
        return [
            <FlatButton
                label="Отмена"
                primary={true}
                onClick={this.onDialogClose}
            />,
            <FlatButton
                label="Импортировать"
                disabled={!this.state.isValid}
                primary={true}
                keyboardFocused={true}
                onClick={this.onSubmit}
            />,
        ];
    }

    render() {
        const {buttonLabel} = this.props;
        return (
            <div>
                <RaisedButton label={buttonLabel || "Импорт DBF-файла"} onClick={this.onDialogOpen} />
                <Dialog
                    className="DbfFileImportDialog"
                    title="Импорт данных DBF-файла"
                    actions={this.actions()}
                    modal={false}
                    open={this.state.isDialogOpened}
                    onRequestClose={this.onDialogClose}
                >
                    <input id="dataImporterFileInput"
                           type="file"
                           onChange={this.onFileSelected}
                           style={{width:'100%'}}>

                    </input>
                    {this.state.errorMessage && <label style={{color:'red'}}>{this.state.errorMessage}</label>}
                </Dialog>
            </div>
        );
    }
}

DbfFileImportDialog.propTypes = {
    buttonLabel : PropTypes.string,
    onSubmit : PropTypes.func
};

export default DbfFileImportDialog;