/**
 * File Uploader
 *
 * Created by Alex Elkin on 02.11.2017.
 */

import FileOpenDialog from '../dialog/FileOpenDialog'
import FilesTable, {fileType} from './FilesTable'

import React from 'react'
import PropTypes from 'prop-types'
import {Card, CardTitle, CardText} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';

class FileUploader extends React.Component {

    constructor(props) {
        super(props);
        this.onUploadFile = this.onUploadFile.bind(this);
        this.onTabChange = this.onTabChange.bind(this);
        this.renderCategory = this.renderCategory.bind(this);
        this.onFetchFiles = this.onFetchFiles.bind(this);
        this.state = {}
    }

    componentDidMount() {
        this.onTabChange(FileUploader.firstCategoryName(this.props))
    }

    componentWillReceiveProps(nextProps) {
        if (FileUploader.firstCategoryName(nextProps)!== FileUploader.firstCategoryName(this.props))
            this.onTabChange(FileUploader.firstCategoryName(nextProps))
    }

    static firstCategoryName(props) {
        return props && props.categories && props.categories[0] && props.categories[0].name;
    }

    onUploadFile(file, category) {
        this.props.onUploadFile && this.props.onUploadFile(file, category);
    }

    onTabChange(categoryName) {
        this.setState({categoryName});
        this.onFetchFiles(categoryName);
    }

    onFetchFiles(category) {
        this.props.onFetchFiles && this.props.onFetchFiles(category);
    }

    renderCategory(category) {
        const {name, displayName, fileType, fileExtension, isFetching, files} = category;
        const {onDownloadFile, onRemoveFile, onClickFile} = this.props;
        const label = `Загрузить файл${displayName ? ' ' + displayName : ""}`;
        return (
            <Tab key={name} label={displayName} value={name}>
                <FilesTable data={files}
                            isFetching={isFetching}
                            onDownload={onDownloadFile && (fileName => onDownloadFile(name, fileName))}
                            onFileSelect={onClickFile && (fileName => onClickFile(name, fileName))}
                            onRemove={onRemoveFile && (fileName => onRemoveFile(name, fileName))}/>
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
    onClickFile : PropTypes.func,
    onUploadFile: PropTypes.func,
    onFetchFiles: PropTypes.func,
    onDownloadFile : PropTypes.func,
    onRemoveFile : PropTypes.func
};

export default FileUploader;
