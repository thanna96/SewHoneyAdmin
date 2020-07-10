import React, {Component} from 'react';
import { Button} from "react-bootstrap";
import Form from 'react-bootstrap/Form';

class LoginPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: null,
            password: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleChange(Event){
        let nam = Event.target.name;
        let val = Event.target.value;
        this.setState({
            [nam]: val
        })
    }

    handleSubmit(Event){
        Event.preventDefault();
        if (this.state.username === 'name' && this.state.password === 'pass'){
            window.location.href='/AddProduct'
        }else{
            console.log("incorrect login info")
        }
    }

    render() {

        return (
            <div className="Login">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group  >
                        <Form.Label>User</Form.Label>
                        <Form.Control
                            autoFocus
                            name="username"
                            onChange={this.handleChange}
                        />
                    </Form.Group>
                    <Form.Group  >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            onChange={this.handleChange}
                            name="password"
                        />
                    </Form.Group>
                    <Button block  disabled={!this.validateForm} type="submit">
                        Login
                    </Button>
                </Form>
            </div>
        );
    }
}

export default LoginPage;