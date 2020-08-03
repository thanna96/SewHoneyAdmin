import React, {Component} from 'react';
import { Navbar,Nav,Button } from 'react-bootstrap'

class Header extends Component {
    constructor(props){
        super(props);
        this.logOut = this.logOut.bind(this);
    }

    logOut = () => {
        localStorage.removeItem("token");
        window.location.href='/Login'
    }

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
                            <Button onClick={this.logOut}>
                                Log Out
                            </Button>
                        </Navbar>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;