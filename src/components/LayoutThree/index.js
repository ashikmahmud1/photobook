import React, {Fragment} from 'react';
import layoutThreeActive from "../../assets/img/3s.png";
import layout1 from '../../assets/img/1.png';
import layout2 from "../../assets/img/2.png";
import layout4 from "../../assets/img/4.png";
import layout5 from "../../assets/img/5.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import './three.css';
import * as actionCreators from "../../store/actions";
import {connect} from "react-redux";
import PageFileUploader, {IMAGE_SERVER_URL} from "../PageFileUploader";

const onChangePageTextHandler = (event, payload) => {
// changing a page it needs two thing which page that means page_index and another is the text
    payload.changePageText({text: event.target.value, page_index: payload.page_index, text_no: payload.text_no});
};
const onZoomPageHandler = (event, payload) => {
    payload.zoomPage({page_index: payload.page_index, title: payload.title});
};
const LayoutThree = (props) => {
    const {page_index, changeLayout, page, changePageText, zoomPage, title} = props;
    return (
        <Fragment>
            <h4 className="page_title">
                {props.title}
                <div className="top">
                    <input type="image" src={layout1}
                           onClick={() => changeLayout({page_index: page_index, layout: '1'})} className="img-input"
                           alt='some label'/>
                    <input type="image" src={layout2}
                           onClick={() => changeLayout({page_index: page_index, layout: '2'})} className="img-input"
                           alt='some label'/>
                    <input type="image" src={layoutThreeActive} className="img-input" alt='some label'/>
                    <input type="image" src={layout4}
                           onClick={() => changeLayout({page_index: page_index, layout: '4'})} className="img-input"
                           alt='some label'/>
                    <input type="image" src={layout5}
                           onClick={() => changeLayout({page_index: page_index, layout: '5'})} className="img-input"
                           alt='some label'/>
                    <button className="btn-search" type="button" onClick={(event) => onZoomPageHandler(event, {page_index, zoomPage, title})}>
                        <FontAwesomeIcon icon="search" className="search-icon"/>
                    </button>

                </div>
            </h4>
            <div className="layout3">
                {/***************** Display the file if file_id not empty else display the FileUploader *********************/}
                <div className="layout3-container1">
                    {page.image1.file_id !== '' &&
                    <img src={IMAGE_SERVER_URL + page.image1.file_reference + '200'} alt="" className="layout3-image1"/>}
                    {page.image1.file_id === '' && <PageFileUploader page={page} page_index={page_index} image='1'
                                                                     className='layout3-image1-uploader'/>}
                    <textarea className="layout3-input1" placeholder="type text here" value={page.text1}
                              onChange={(event) => onChangePageTextHandler(event, {
                                  text_no: '1',
                                  page_index,
                                  changePageText
                              })}/>
                </div>
                <div className="layout3-container2">
                    {page.image2.file_id !== '' && <img src={IMAGE_SERVER_URL + page.image2.file_reference + '200'} alt="" className="layout3-image2"/>}
                    {page.image2.file_id === '' && <PageFileUploader page={page} page_index={page_index} image='2'
                                                                     className='layout3-image2-uploader'/>}
                    <textarea className="layout3-input2" placeholder="type text here" value={page.text2}
                              onChange={(event) => onChangePageTextHandler(event, {
                                  text_no: '2',
                                  page_index,
                                  changePageText
                              })}/>
                </div>
            </div>
        </Fragment>
    )
};

// Map Redux state to component props
function mapStateToProps(state) {
    return {
        pages: state.PageReducer.pages,
    }
}

// Map Redux action to component props
function mapDispatchToProps(dispatch) {
    return {
        changeLayout: (payload) => dispatch(actionCreators.changeLayout(payload)),
        changePageText: (payload) => dispatch(actionCreators.changePageText(payload)),
        zoomPage: (payload) => dispatch(actionCreators.zoomPage(payload))
    }
}

//connecting out component with the redux store
const LayoutThreeContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LayoutThree);

export default LayoutThreeContainer;
