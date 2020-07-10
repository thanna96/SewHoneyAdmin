import React, {Component} from 'react';
import { Navbar,Nav } from 'react-bootstrap'

class Header extends Component {
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <Navbar  bg="dark" variant="dark" expand="lg" sticky="top">
                            <Nav className="mr-auto">
                                <Nav.Link href='/AddProduct' >
                                    Add
                                </Nav.Link>
                                <Nav.Link href='/Update'>
                                    Update
                                </Nav.Link>
                            </Nav>
                        </Navbar>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;