import * as actionTypes from '../actions/ActionTypes';
import update from 'immutability-helper';

const initialState = {
    pages: [],
    front: {},
    back: {},
    file_info: {},
    zoom: false,
    zoom_page: {}
};
// files and files_count will help to upload file

const PageReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_PAGE: {
            // get all the pages from the store
            let pages = [...state.pages];
            // check the last page layout type
            let last_page_layout = pages[pages.length - 1].layout;
            let selected_layout = last_page_layout === '5' ? 1 : parseInt(last_page_layout) + 1;
            // if the last layout is 4 this means the new pages layout will start from 5
            let add_page_length = 4;
            let image_object = {
                path: '',
                file_id: '',
                file_reference: '',
                file_name: '',
                resolutions: '',
                date_taken: '',
                date_created: ''
            };
            for (let i = 1; i <= add_page_length; i++) {
                pages.push({
                    layout: `${selected_layout}`,
                    image1: image_object,
                    image2: image_object,
                    image3: image_object,
                    text1: "",
                    text2: ""
                });
                selected_layout = selected_layout === 5 ? 1 : selected_layout + 1;
            }
            // layout selection logic will be something like this parseInt(last_page.layout) if last_page.layout == 5 ? 1 : last_page.layout +1;
            // save the newly created pages in the local storage and update the state
            return {...state, pages: pages}
        }
        case actionTypes.REMOVE_PAGE: {
            // first check the numbers of pages. if pages is 20 then we can't remove page. else
            // remove the last 4 page
            // since we will remove the last 4 items so we just need to make pop() operation 4 times
            let pages = [...state.pages];
            for (let i = 1; i <= 4; i++) {
                pages.pop();
            }
            return {...state, pages: pages}
        }
        case actionTypes.PAGE_STATE_UPDATE: {
            const {field, value} = action.payload;
            console.log(action.payload);
            return update(state, {
                [field]: {
                    $set: value
                },
            });
        }
        case actionTypes.CHANGE_LAYOUT: {
            // get the page by its index which needs to be change the layout
            // and change the layout by the given layout
            const {layout, page_index, title} = action.payload;
            let front = {...state.front};
            let back = {...state.back};
            let zoom_page = {...state.zoom_page};
            let pages = [...state.pages];
            // check if the page_index is front or back or number
            if (page_index === 'front') {
                front.layout = layout;
                zoom_page = front;
            } else if (page_index === 'back') {
                back.layout = layout;
                zoom_page = back;
            } else {
                pages[page_index].layout = layout;
                zoom_page = pages[page_index];
            }
            zoom_page.title = title;
            zoom_page.page_index = page_index;
            // save the newly created pages in the local storage and update the state
            return {...state, front: front, back: back, pages: pages, zoom_page: zoom_page};
        }
        case actionTypes.PAGE_FILE_DROP: {
            const {file_id, image, page_index, sidebar_images} = action.payload;
            let front = {...state.front};
            let back = {...state.back};
            let pages = [...state.pages];
            let image_to_drop = sidebar_images.find(s => s.file_id === file_id);
            if (page_index === 'front') {
                switch (image) {
                    case '1':
                        front.image1 = image_to_drop;
                        break;
                    case '2':
                        front.image2 = image_to_drop;
                        break;
                    case '3':
                        front.image3 = image_to_drop;
                        break;
                    default:
                        front.image1 = image_to_drop
                }
            } else if (page_index === 'back') {
                switch (image) {
                    case '1':
                        back.image1 = image_to_drop;
                        break;
                    case '2':
                        back.image2 = image_to_drop;
                        break;
                    case '3':
                        back.image3 = image_to_drop;
                        break;
                    default:
                        back.image1 = image_to_drop
                }
            } else {
                switch (image) {
                    case '1':
                        pages[page_index].image1 = image_to_drop;
                        break;
                    case '2':
                        pages[page_index].image2 = image_to_drop;
                        break;
                    case '3':
                        pages[page_index].image3 = image_to_drop;
                        break;
                    default:
                        pages[page_index].image1 = image_to_drop
                }
            }
            // remove the dropped image from the left side bar and update the local stage sidebar_images
            return {...state, pages: pages, front: front, back: back}
        }
        case actionTypes.CHANGE_PAGE_TEXT: {
            const {page_index, text_no, text, title} = action.payload;
            let front = {...state.front};
            let back = {...state.back};
            let pages = [...state.pages];
            let zoom_page = {...state.zoom_page};
            if (page_index === 'front') {
                switch (text_no) {
                    case '1':
                        front.text1 = text;
                        break;
                    case '2':
                        front.text2 = text;
                        break;
                    default:
                        front.text1 = text
                }
                zoom_page = front
            } else if (page_index === 'back') {
                switch (text_no) {
                    case '1':
                        back.text1 = text;
                        break;
                    case '2':
                        back.text2 = text;
                        break;
                    default:
                        back.text1 = text
                }
                zoom_page = back
            } else {
                switch (text_no) {
                    case '1':
                        pages[page_index].text1 = text;
                        break;
                    case '2':
                        pages[page_index].text2 = text;
                        break;
                    default:
                        pages[page_index].text1 = text
                }
                zoom_page = pages[page_index];
            }
            zoom_page.title = title;
            zoom_page.page_index = page_index;
            // update the pages front and back and save it into the local storage
            return {...state, pages: pages, front: front, back: back, zoom_page: zoom_page}
        }
        case actionTypes.ZOOM_PAGE: {
            const {page_index, title} = action.payload;
            let front = {...state.front};
            let back = {...state.back};
            let pages = [...state.pages];
            let zoom_page = {};
            if (page_index === 'front') {
                zoom_page = front;
            } else if (page_index === 'back') {
                zoom_page = back
            } else {
                zoom_page = pages[page_index];
            }
            zoom_page.title = title;
            zoom_page.page_index = page_index;
            return {...state, zoom: true, zoom_page: zoom_page};
        }
        default:
            return state

    }
};
export default PageReducer
