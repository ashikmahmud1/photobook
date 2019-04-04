import * as actionTypes from './ActionTypes';
// import request from '../../utils/request';
//
// const GET_UPLOAD_LINK = "https://myra-get-upload-link.azurewebsites.net/api/GetUploadLink";
// const PROCESS_IMAGE_URL = "https://myra-queue-process-image.azurewebsites.net/api/ProcessImageNow";

// action creators

// *************** synchronous action creators *************************

export const addPages = () => {
    return {type: actionTypes.ADD_PAGE};
};

export const removePages = () => {
    return {type: actionTypes.REMOVE_PAGE};
};

export const changeLayout = (payload) => {
    return {type: actionTypes.CHANGE_LAYOUT, payload: payload};
};

export const updatePageState = (payload) => {
    return {type: actionTypes.PAGE_STATE_UPDATE, payload: payload};
};

export const pageFileDrop = (payload) => {
    return {type: actionTypes.PAGE_FILE_DROP, payload: payload}
};

export const changePageText = (payload) => {
    return {type: actionTypes.CHANGE_PAGE_TEXT, payload: payload}
};
export const zoomPage = (payload) => {
    return {type: actionTypes.ZOOM_PAGE, payload: payload}
};


// ******************************* asynchronous action creators *****************************
