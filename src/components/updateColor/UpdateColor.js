import React, {Component} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class UpdateColor extends Component {
    render() {
        return (
            <Form onSubmit={this.handleSubmit} >
                <hr style={{"background":"#e6be8a"}}/>
                <h3>Update Colors:</h3>
                <Row>
                    <Col>
                        <Form.Label>Color Name:</Form.Label>
                        <Form.Control name='title' onChange={this.handleChange}/>
                    </Col>
                    <Col>
                        <Form.Label>Add New Color:</Form.Label>
                        <Button variant="primary"  >
                            Submit Color
                        </Button>
                    </Col>
                </Row>
                <Form.Group controlId="colors">
                    <Form.Label>Select Color</Form.Label>
                    <Form.Control name="colors" onChange={this.handleArrays} as="select">
                        <option value="White">White</option>
                        <option value="Red">Red</option>
                        <option value="Black">Black</option>
                        <option value="Yellow">Yellow</option>
                        <option value="Blue">Blue</option>
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit" >
                    Delete Selected Color
                </Button>
                <hr style={{"background":"#e6be8a"}}/>
            </Form>
        );
    }
}

export default UpdateColor;