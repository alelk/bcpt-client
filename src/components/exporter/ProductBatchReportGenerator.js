/**
 * Product Batch Report Generator
 *
 * Created by Alex Elkin on 24.11.2017.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardTitle, CardText, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class ProductBatchReportExporter extends React.Component {

    constructor(props) {
        super(props);
        this.onProductBatchExternalIdChanged = this.onProductBatchExternalIdChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onTargetFormatChange = this.onTargetFormatChange.bind(this);
        this.state = {
            productBatchExternalId: this.props.productBatchExternalId,
            targetFormat : this.props.targetFormat || "PDF"
        }
    }

    onProductBatchExternalIdChanged(e) {
        this.setState({productBatchExternalId : e.target.value})
    }

    onTargetFormatChange(e, i, value) {
        this.setState({targetFormat:value})
    }

    onSubmit() {
        this.props.onSubmit && this.props.onSubmit(this.state.productBatchExternalId, this.state.targetFormat);
    }

    render() {
        const {productBatchExternalId} = this.props;
        return (
            <Card>
                <CardTitle title="Генерация отчёта о загрузке"/>
                <CardText>
                    <TextField floatingLabelText="ID загрузки"
                               defaultValue={productBatchExternalId}
                               fullWidth
                               onChange={this.onProductBatchExternalIdChanged}/>
                    <SelectField value={this.state.targetFormat}
                                 floatingLabelText="Формат файла"
                                 fullWidth
                                 onChange={this.onTargetFormatChange}>
                        <MenuItem value="PDF" primaryText="Документ PDF (.pdf)"/>
                        <MenuItem value="DOCX" primaryText="Документ MS Word (.docx)"/>
                        <MenuItem value="XLS" primaryText="Документ MS Excel (.xls)"/>
                    </SelectField>
                </CardText>
                <CardActions>
                    <FlatButton label="Сгенерировать отчёт" primary onClick={this.onSubmit}/>
                </CardActions>
            </Card>
        )
    }
}

ProductBatchReportExporter.propTypes = {
    productBatchExternalId : PropTypes.string,
    targetFormat : PropTypes.string,
    onSubmit : PropTypes.func
};

export default ProductBatchReportExporter;