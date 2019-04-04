import React, {Fragment} from 'react';
import * as actionCreators from "../../store/actions";
import {connect} from "react-redux";
import Dropzone from "react-dropzone";
import './page_file_uploader.css';
import {toFileWithPath} from "../../utils/fileselector";

const onDropHandler = (acceptedFiles, rejectedFiles, payload) => {
    console.log(payload);
    console.log(acceptedFiles);
    // from the acceptedFiles get the first file.
    if (acceptedFiles.length > 0) {
        // create a blob with this file
        createBlob(acceptedFiles[0], payload);
    }
};
// ******************* CREATE BLOB FROM IMAGE ***********************
const createBlob = (file, payload) => {
    const {page_index, image} = payload;
    const fileBlobs = [];
    // we need to declare an object file_info where we will store the information about the file
    let file_info = {file: file, page_index: page_index, image: image};
    payload.updatePageState({field: 'file_info', value: file_info});


    const blob = toFileWithPath(file);
    fileBlobs.push(blob);
    //convert files array to map with file paths as keys
    payload.updateFilesList({
        files: fileBlobs.reduce((map, file) => {
            map[file.path] = file;
            return map
        }, {}),
        files_count: fileBlobs.length
    });
};
const onDragOverHandler = () => {

};
const onDragLeaveHandler = () => {

};
const onDropImageHandler = (event, payload) => {
    // console.log(event);
    let div = document.createElement('div');
    div.innerHTML = event.dataTransfer.getData("text/html");
    let target_elements = div.getElementsByTagName('img');
    if (target_elements.length > 0) {
        payload.file_id = target_elements[0].id;
        payload.pageFileDrop(payload);
        payload.updateState(payload.sidebar_images);
    }
    // remove the div node from the document
    div.remove();
};
const PageFileUploader = (props) => {
    const {page_index, image, sidebar_images, pageFileDrop, updateState, updateFilesList, updatePageState} = props;
    return (
        <Fragment>

            {/******************************For Uploading File We need to know which page the image will upload as well as which image
             needs to be change ********************************/}
            <Dropzone
                onDrop={(acceptedFiles, rejectedFiles) => onDropHandler(acceptedFiles, rejectedFiles, {
                    page_index,
                    image,
                    updateFilesList,
                    updatePageState
                })}
                onDragOver={() => onDragOverHandler}
                onDragLeave={() => onDragLeaveHandler}
                accept='image/jpeg,image/gif,image/png'
                className='dropzone'
                activeClassName='active-dropzone'>
                {({getRootProps, getInputProps}) => (
                    <section className='drop-section'>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div className={`upload-single drag-drop ${props.className}`}
                                 onDrop={(event) => onDropImageHandler(event, {
                                     page_index,
                                     image,
                                     sidebar_images,
                                     pageFileDrop,
                                     updateState
                                 })}>
                            </div>
                        </div>
                    </section>
                )}
            </Dropzone>
        </Fragment>
    )
};

// Map Redux state to component props
function mapStateToProps(state) {
    return {
        pages: state.PageReducer.pages,
        sidebar_images: state.UploadReducer.sidebar_images
    }
}

// Map Redux action to component props
function mapDispatchToProps(dispatch) {
    return {
        pageFileDrop: (payload) => dispatch(actionCreators.pageFileDrop(payload)),
        updateState: (payload) => dispatch(actionCreators.updateState(payload)),
        updateFilesList: (payload) => dispatch(actionCreators.updateFilesList(payload)),
        updatePageState: (payload) => dispatch(actionCreators.updatePageState(payload))
    }
}

//connecting out component with the redux store
const PageFileUploaderContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PageFileUploader);

export default PageFileUploaderContainer;
export const IMAGE_SERVER_URL = "https://myra.blob.core.windows.net/files/";
export const MAX_UPLOAD_LIMIT = 5;
