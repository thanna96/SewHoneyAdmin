import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Header extends Component {
    render() {
        return (
            <div>
                <ul >
                    <li>
                        <Link to='/' >
                            Add
                        </Link>
                    </li>

                    <li >
                        <Link to='/Update'>
                            Update
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Header;