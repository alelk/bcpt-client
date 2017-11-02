/**
 * Dbf File Open Dialog
 *
 * Created by Alex Elkin on 01.11.2017.
 */

import React from 'react';
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class FileOpenDialog extends React.Component {

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
        this.setState({isDialogOpened: true, file:undefined, isValid:false, errorMessage: undefined})
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
            errorMessage: file ? isValid ? undefined : "Выбран неверный файл" : "Выберите файл"
        })
    }

    validate(file) {
        const {fileType} = this.props;
        return fileType ? file && fileType === file.type : file;
    }

    actions() {
        const {submitLabel} = this.props;
        return [
            <FlatButton
                label="Отмена"
                primary={true}
                onClick={this.onDialogClose}
            />,
            <FlatButton
                label={submitLabel || "Открыть"}
                disabled={!this.state.isValid}
                primary={true}
                keyboardFocused={true}
                onClick={this.onSubmit}
            />,
        ];
    }

    render() {
        const {buttonLabel, title} = this.props;
        const {isDialogOpened, errorMessage} = this.state;
        return (
            <div>
                <RaisedButton label={buttonLabel || "Выбрать файл"} onClick={this.onDialogOpen} />
                <Dialog
                    className="FileOpenDialog"
                    title={title || buttonLabel || "Выбор файла"}
                    actions={this.actions()}
                    modal={false}
                    open={isDialogOpened}
                    onRequestClose={this.onDialogClose}
                >
                    <input type="file"
                           onChange={this.onFileSelected}
                           style={{width:'100%'}}>

                    </input>
                    {errorMessage && <label style={{color:'red'}}>{errorMessage}</label>}
                </Dialog>
            </div>
        );
    }
}

FileOpenDialog.propTypes = {
    buttonLabel : PropTypes.string,
    title : PropTypes.string,
    submitLabel : PropTypes.string,
    fileType : PropTypes.string,
    onSubmit : PropTypes.func
};

export default FileOpenDialog;