import React, {Component} from 'react';
import './sidebar.css';
import Upload from '../Upload';
// in this component we need to set up our upload function
// drag and drop feature
class Sidebar extends Component {

    render() {
        return (
            <div className='sidebar'>
                <Upload/>
            </div>
        )
    }

}

export default Sidebar;
