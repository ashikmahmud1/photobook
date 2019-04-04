import React, {Component, Fragment} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Dropzone from "react-dropzone";
import {connect} from 'react-redux';
import {toFileWithPath} from '../../utils/fileselector';
import {Button} from "reactstrap";
import * as actionCreators from '../../store/actions/UploadActionCreator';
import './upload.css';
import {IMAGE_SERVER_URL} from '../PageFileUploader';

class Upload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            imagePreviewUrls: []
        };
    }

    // ******************** Life cycle Method ***************
    componentDidMount() {
        const AccountName = localStorage.getItem("name");
        const token = localStorage.getItem("token");
        const CurrentFolder = window.location.pathname.replace(/\/upload/, "");
        if (localStorage.getItem('sidebar_images')) {
            let sidebar_images = JSON.parse(localStorage.getItem('sidebar_images'));
            this.props.updateState({field: "sidebar_images", value: sidebar_images});
        }
        this.props.updateState({field: "CurrentFolder", value: unescape(CurrentFolder)});
        this.props.updateState({field: "AccountName", value: AccountName});
        this.props.updateState({field: "token", value: token});
    }

    // ******************* When File Will Be Dropped to the DropZone area *****************

    // in the second parameters we will get the rejectedFiles. in this case which have no use
    onDropHandler = (files) => {
        // first need to check if the file with the file name already exist or not
        // if the file with the filename not exist then concat the files
        this.setState({
            files: this.state.files.concat(files),
            dragged: false
        });
        // this will help to show the image preview
        this.createImageUrl();
        // convert the image file to blob
        this.createBlob();
    };

    // ******************* CREATE BLOB FROM IMAGE ***********************
    createBlob = () => {
        const fileBlobs = [];
        this.state.files.forEach((file) => {
            // check if the file type is blob then no need to convert it blob again
            if (file.constructor === Blob) {
                fileBlobs.push(file);
            } else {
                fileBlobs.push(toFileWithPath(file));
            }
        });
        this.setState({
            files: fileBlobs
        });
        this.updateFilesArray(this.state.files);
    };

    // ******************** REMOVE SELECTED IMAGE ******************
    onRemoveImageHandler = (event, index) => {
        // stopPropagation will be helpful when bubbles of event handler
        event.stopPropagation();
        // remove the item from imagePreviewUrls as well as files
        const sidebar_images = [...this.props.sidebar_images];
        if (index !== -1) {
            sidebar_images.splice(index, 1);
            localStorage.setItem('sidebar_images', JSON.stringify(sidebar_images));
            this.props.updateState({field: "sidebar_images", value: sidebar_images});
        }
    };

    // *********************** UPDATE FILE LIST **************************
    updateFilesArray = (files) => {
        //convert files array to map with file paths as keys
        this.props.updateFilesList({
            files: files.reduce((map, file) => {
                map[file.path] = file;
                return map
            }, {}),
            files_count: files.length
        });
    };

    // *********************** UPLOAD FILE ***************************
    componentWillReceiveProps(nextProps) {
        const {files_count, uploaded_count} = nextProps;
        if (files_count !== 0 && files_count === uploaded_count) {
            this.clearUploadedPhotos();
        }
    };


    // *********************** REMOVE ALL THE SELECTED FILES **********************
    onRemoveAllHandler = () => {
        let sidebar_images = [];
        localStorage.setItem('sidebar_images', JSON.stringify(sidebar_images));
        this.props.updateState({field: "sidebar_images", value: sidebar_images});
        this.setState({files: [], imagePreviewUrls: []});
        this.updateFilesArray([]);
    };

    // *********************** FOR DISPLAYING IMAGE PREVIEW ON THE LEFT SIDE *******************
    createImageUrl() {
        // clear the previously created image preview urls state
        this.setState({imagePreviewUrls: []});
        this.state.files.forEach((file) => {
            let reader = new FileReader();
            reader.onloadend = () => {
                this.setState(prevState => ({
                    imagePreviewUrls: [...prevState.imagePreviewUrls, reader.result]
                }));
            };

            reader.readAsDataURL(file);
        });
    }

    // ************************ SAVE UPLOADED FILE IN THE LOCAL STORAGE *************************
    // so that later time we can add this uploaded photo in the photo book app
    clearUploadedPhotos = () => {
        this.setState({files: [], imagePreviewUrls: []});
    };


    render() {
        // ****** we can't set the state here ********
        // const {dragged} = this.state;
        // const {files, files_count, uploaded_files, current_uploads, uploaded_count, latest_uploaded} = this.props;
        // const no_files = files_count === 0;
        // const to_be_uploaded = files_count - uploaded_count;
        const {imagePreviewUrls} = this.state;
        const {sidebar_images} = this.props;

        const previewStyle = {
            display: 'inline-block',
            width: '80%',
        };
        return (
            <div>
                <div className='upload-title-box'>
                    <div className='text-center upload-top-title'>UPLOAD IMAGE</div>
                    {sidebar_images.length > 0 &&
                    <Fragment>
                        <button type='button' className='btn-remove-all'
                                onClick={this.onRemoveAllHandler}>
                            <FontAwesomeIcon icon="trash"/>
                        </button>
                    </Fragment>
                    }
                </div>
                <hr/>
                <Dropzone onDrop={this.onDropHandler}
                          accept='image/jpeg,image/gif,image/png'
                          className='dropzone'
                          activeClassName='active-dropzone'>
                    {({getRootProps, getInputProps}) => (
                        <section>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div
                                    className={`upload-div drag-drop ${this.state.files.length > 0 || sidebar_images.length > 0 ? 'dropped' : ''}`}>
                                    <div className='content'>
                                        <div className='upload-title'>Drag photos here</div>
                                        <Button>Choose photos</Button>
                                    </div>
                                    {/************** Display the files which is currently uploading *****************/}
                                    {imagePreviewUrls.length > 0 &&
                                    <Fragment>
                                        {imagePreviewUrls.map((previewUrl, key) => (
                                            <div className='text-center preview-image-div' key={key}>
                                                <img
                                                    alt="Preview"
                                                    key={key}
                                                    src={previewUrl}
                                                    style={previewStyle}
                                                />
                                            </div>
                                        ))}
                                    </Fragment>
                                    }

                                    {/***************** Show all the files which is already uploaded **********************/}
                                    {sidebar_images.length > 0 &&
                                    <Fragment>
                                        {sidebar_images.map((image, key) => (
                                            <div className='text-center preview-image-div' key={key}>
                                                <button type='button' className='btn-remove-image'
                                                        onClick={(event) => this.onRemoveImageHandler(event, key)}>
                                                    <FontAwesomeIcon icon="trash"/>
                                                </button>
                                                <img
                                                    alt="Preview"
                                                    key={key}
                                                    id={image.file_id}
                                                    src={IMAGE_SERVER_URL + image.file_reference + '200'}
                                                    style={previewStyle}
                                                />
                                            </div>
                                        ))}
                                    </Fragment>
                                    }
                                </div>
                            </div>
                        </section>
                    )}
                </Dropzone>
            </div>
        )
    }
}

// Map Redux state to component props
function mapStateToProps(state) {
    return {
        token: state.UploadReducer.token,
        files: state.UploadReducer.files,
        current_uploads: state.UploadReducer.current_uploads,
        uploaded_files: state.UploadReducer.uploaded_files,
        AccountName: state.UploadReducer.AccountName,
        CurrentFolder: state.UploadReducer.CurrentFolder,
        files_count: state.UploadReducer.files_count,
        uploaded_count: state.UploadReducer.uploaded_count,
        latest_uploaded: state.UploadReducer.latest_uploaded,
        sidebar_images: state.UploadReducer.sidebar_images
    }
}

// Map Redux action to component props
function mapDispatchToProps(dispatch) {
    return {
        updateFilesList: (payload) => dispatch(actionCreators.updateFilesList(payload)),
        setCurrentUpload: (payload) => dispatch(actionCreators.setCurrentUpload(payload)),
        updateState: (payload) => dispatch(actionCreators.updateState(payload))
    }
}

//connecting out component with the redux store
const UploadContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Upload);

export default UploadContainer;
