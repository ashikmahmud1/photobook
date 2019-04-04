import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Home from './views/Home';
import Header from './layout/Header';
import {Row, Col} from 'reactstrap';
import './App.css'
import Footer from "./layout/Footer";
import Sidebar from './components/Sidebar';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faEnvelope, faKey, faTrash,faSearch, faUpload,faWindowClose} from '@fortawesome/free-solid-svg-icons';
import VisibleCounter from "./components/Counter";

library.add(faEnvelope, faKey, faTrash, faSearch, faUpload, faWindowClose);

class App extends Component {
    // app will contain a side bar which will always stick into the app
    // so we should create a sidebar component and put it into this app
    render() {
        return (
            <div>
                <Header/>
                {/*Row with two column one width is col-md-3 and another is col-md-9. in col-md-9 all the body content will go here*/}
                <Row className='app'>
                    <Col className='col-md-2 bg-red'>
                        <Sidebar/>
                    </Col>
                    <Col className='col-md-10 main-body'>
                        <Route path="/" exact component={Home}/>
                        <Route path="/counter" exact component={VisibleCounter}/>
                    </Col>
                </Row>
                <Footer/>
            </div>
        )
    }
}

export default App;
