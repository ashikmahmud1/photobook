import React, {Component, Fragment} from 'react';
import './home.css';
import Page from '../../components/Page';
import * as actionCreators from "../../store/actions";
import {connect} from "react-redux";
import {Modal, ModalBody} from 'reactstrap';
import {MAX_UPLOAD_LIMIT} from "../../components/PageFileUploader";

class Home extends Component {

    componentDidMount() {
        if (localStorage.getItem('photo_book')) {
            const photo_book = JSON.parse(localStorage.getItem('photo_book'));
            this.props.updatePageState({field: 'pages', value: photo_book.pages});
            this.props.updatePageState({field: 'front', value: photo_book.front});
            this.props.updatePageState({field: 'back', value: photo_book.back});
        } else {
            // initially we will have 20 pages and front and back. that means total 22 pages
            const photo_book = {};
            photo_book.pages = [];
            let image_object = {
                path: '',
                file_id: '',
                file_reference: '',
                file_name: '',
                resolutions: '',
                date_taken: '',
                date_created: ''
            };
            photo_book.front = {
                layout: '1',
                image1: image_object,
                image2: image_object,
                image3: image_object,
                text1: "",
                text2: ""
            };
            photo_book.back = {
                layout: '5',
                image1: image_object,
                image2: image_object,
                image3: image_object,
                text1: "",
                text2: ""
            };
            photo_book.locked = true;
            let layout_no = 2;
            for (let i = 1; i <= 20; i++) {
                layout_no = layout_no === 6 ? 1 : layout_no;
                photo_book.pages.push({
                    layout: `${layout_no}`,
                    image1: image_object,
                    image2: image_object,
                    image3: image_object,
                    text1: "",
                    text2: ""
                });
                layout_no++;
            }
            localStorage.setItem('photo_book', JSON.stringify(photo_book));
            this.props.updatePageState({field: 'pages', value: photo_book.pages});
            this.props.updatePageState({field: 'front', value: photo_book.front});
            this.props.updatePageState({field: 'back', value: photo_book.back});
        }
    }

    // *********************** UPLOAD FILE ***************************
    componentWillReceiveProps(nextProps) {
        const {current_uploads, files_count, files, file_info, uploaded_count, AccountName, uploaded_files, CurrentFolder} = nextProps;
        if (files_count !== 0 && files_count === uploaded_count) {
            this.clearUploadedPhotos();
        }
        // keep current_uploads queue full
        const current_uploads_count = Object.keys(current_uploads).length;
        if (current_uploads_count < MAX_UPLOAD_LIMIT) {
            this.props.setCurrentUpload({files, files_count})
        }

        //Process current_uploads queue
        Object.keys(current_uploads).forEach(path => {
            const current_upload = current_uploads[path];
            const file_is_not_uploaded_already = !uploaded_files[path];
            if (file_is_not_uploaded_already) {
                switch (current_upload.status) {
                    case "get_link":
                        const FileName = `${CurrentFolder}/${path}`;
                        this.props.getUploadLink({AccountName, FileName, path});
                        break;
                    case "upload":
                        this.props.uploadBlob({path});
                        break;
                    case "process":
                        this.props.processImage({path, file_info});
                        break;
                    default:
                        console.log('get_link, upload, process none');
                }
            }
        })
    };

    // ************************ SAVE UPLOADED FILE IN THE LOCAL STORAGE *************************
    // so that later time we can add this uploaded photo in the photo book app
    clearUploadedPhotos = () => {
        if (localStorage.getItem('sidebar_images')) {
            let sidebar_images = JSON.parse(localStorage.getItem('sidebar_images'));
            let {pages, front, back} = JSON.parse(localStorage.getItem('photo_book'));
            this.props.updateState({field: "files_count", value: 0});
            this.props.updateState({field: 'uploaded_count', value: 0});
            this.props.updateState({field: "files", value: {}});
            this.props.updateState({field: "uploaded_files", value: {}});
            this.props.updateState({field: "current_uploads", value: {}});

            // update the page state
            this.props.updatePageState({field: 'pages', value: pages});
            this.props.updatePageState({field: 'front', value: front});
            this.props.updatePageState({field: 'back', value: back});
            this.props.updatePageState({field: 'file_info', value: {}});
            this.props.updateState({field: "sidebar_images", value: sidebar_images});
        }
        this.setState({files: [], imagePreviewUrls: []});
    };
    toggleZoom = () => {
        this.props.updatePageState({field: 'zoom', value: false});
        this.props.updatePageState({field: 'zoom_page', value: {}});
    };

    render() {
        const {front, back, pages, zoom, zoom_page} = this.props;
        // ********************* Enter the group photos logic here *********************
        let chunk_size = 4;
        let grouped_pages = [];

        // let page_arr = pages ******* Wrong Approach because this will effect the original state pages ******
        let page_arr = [...pages];
        while (page_arr.length) {
            grouped_pages.push(page_arr.splice(0, chunk_size));
        }


        let page_no = 0;
        let page_index = 0;
        let all_pages = grouped_pages.map((group_arr, key) => {
            return (<section key={key} className='product'>
                {
                    group_arr.map((page, index) => {
                        page_no++;
                        let new_page = <Page page_no={page_no} key={index} page_index={page_index} page={page}
                                             layout={page.layout}
                                             title={'Page ' + page_no}/>;
                        page_index++;
                        return new_page

                    })
                }
            </section>)
        });


        return (
            <Fragment>
                {/*************************** Display the zoom page modal ********************************/}
                <Modal isOpen={zoom} centered={true} size='lg' toggle={this.toggleZoom}>
                    <ModalBody>
                        <Page page_no='Zoom' page={zoom_page} layout={zoom_page.layout}
                              page_index={zoom_page.page_index} title={zoom_page.title}/>
                    </ModalBody>
                </Modal>

                {/*************************** End of zoom page modal ********************************/}

                <section className="product front-product">
                    <Page page_no='Front' page={front} layout={front.layout} page_index='front' title='Front'/>
                </section>
                {all_pages}
                <div className='text-center btn-add-remove-container'>
                    <button type='button' className='btn btn-primary btn-add-page'
                            onClick={() => this.props.addPages()}>Add Pages
                    </button>
                    {/*Display the remove button only if the pages length is greater than 20*/}
                    {pages.length > 20 &&
                    <button type='button' className='btn btn-danger btn-remove-page'
                            onClick={() => this.props.removePages()}>Remove Pages
                    </button>}
                </div>
                <section className='product back-product'>
                    <Page page_no='Back' page={back} layout={back.layout} page_index='back' title='Back'/>
                </section>
            </Fragment>
        )
    }
}

// Map Redux state to component props
function mapStateToProps(state) {
    return {
        pages: state.PageReducer.pages,
        front: state.PageReducer.front,
        back: state.PageReducer.back,
        zoom: state.PageReducer.zoom,
        zoom_page: state.PageReducer.zoom_page,
        token: state.UploadReducer.token,
        files: state.UploadReducer.files,
        files_count: state.UploadReducer.files_count,
        file_info: state.PageReducer.file_info,
        AccountName: state.UploadReducer.AccountName,
        CurrentFolder: state.UploadReducer.CurrentFolder,
        current_uploads: state.UploadReducer.current_uploads,
        uploaded_files: state.UploadReducer.uploaded_files,
        uploaded_count: state.UploadReducer.uploaded_count,
        latest_uploaded: state.UploadReducer.latest_uploaded
    }
}

// Map Redux action to component props
function mapDispatchToProps(dispatch) {
    return {
        addPages: () => dispatch(actionCreators.addPages()),
        removePages: () => dispatch(actionCreators.removePages()),
        updatePageState: (payload) => dispatch(actionCreators.updatePageState(payload)),
        setCurrentUpload: (payload) => dispatch(actionCreators.setCurrentUpload(payload)),
        updateState: (payload) => dispatch(actionCreators.updateState(payload)),
        uploadBlob: (payload) => dispatch(actionCreators.uploadBlob(payload)),
        processImage: (payload) => dispatch(actionCreators.processImage(payload)),
        getUploadLink: (payload) => dispatch(actionCreators.getUploadLink(payload))
    }
}

//connecting out component with the redux store
const HomeContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);

export default HomeContainer;
