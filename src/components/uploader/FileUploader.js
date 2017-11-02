/**
 * File Uploader
 *
 * Created by Alex Elkin on 02.11.2017.
 */

import FileOpenDialog from '../dialog/FileOpenDialog'
import UploadsTable, {fileType} from './UploadsTable'

import React from 'react'
import PropTypes from 'prop-types'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';

class FileUploader extends React.Component {

    constructor(props) {
        super(props);
        this.onUploadFile = this.onUploadFile.bind(this);
        this.onTabChange = this.onTabChange.bind(this);
        this.renderCategory = this.renderCategory.bind(this);
        this.state = {}
    }

    onUploadFile(file, category) {
        this.props.onUploadFile && this.props.onUploadFile(file, category);
    }

    onTabChange(categoryName) {
        this.setState({categoryName})
    }

    renderCategory(category) {
        const {name, displayName, fileType, fileExtension, isFetching, files} = category;
        const label = `Загрузить файл${displayName ? ' ' + displayName : ""}`;
        return (
            <Tab key={name} label={displayName} value={name}>
                <UploadsTable data={files} isFetching={isFetching}/>
                <FileOpenDialog onSubmit={file => this.onUploadFile(file, category)}
                                buttonLabel={label}
                                title={`${label}${fileExtension ? ' (.' + fileExtension + ')':''}`}
                                fileType={fileType}
                                submitLabel="Загрузить"/>
            </Tab>
        )
    }

    render() {
        const {categories, title, subtitle} = this.props;
        return (
            <Card>
                <CardTitle title={title} subtitle={subtitle}/>
                <CardText>
                    <Tabs value={this.state.categoryName} onChange={this.onTabChange}>
                        {categories && categories.map(this.renderCategory)}
                    </Tabs>
                </CardText>
            </Card>
        )
    }
}

export const categoryType = PropTypes.shape({
    files: PropTypes.arrayOf(fileType),
    isFetching : PropTypes.bool,
    name: PropTypes.string,
    displayName: PropTypes.string,
    fileType: PropTypes.string,
    fileExtension: PropTypes.string
});

FileUploader.propTypes = {
    categories : PropTypes.arrayOf(categoryType),
    title : PropTypes.string,
    subtitle: PropTypes.string,
    onUploadFile: PropTypes.func
};

export default FileUploader;
