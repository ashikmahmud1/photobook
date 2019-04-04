// combine all the Action Creator export
export {
    increment,
    update
} from './CounterActionCreator';
export {
    setCurrentUpload,
    updateFilesList,
    updateState,
    uploadBlob,
    getUploadLink,
    processImage
}from './UploadActionCreator';
export {
    addPages,
    removePages,
    changeLayout,
    updatePageState,
    pageFileDrop,
    changePageText,
    zoomPage
}from './PageActionCreator';
