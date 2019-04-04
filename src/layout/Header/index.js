import React from 'react';
import {Link} from "react-router-dom";
import './header.css'

const Header = () => {
    return (
        <nav className="navbar bg-light">
            <Link className="navbar-brand logo" to="#">
                <span className='title-1'>Photo</span>
                <span className='title-2'>Book</span>
            </Link>
        </nav>
    )
};

export default Header;
