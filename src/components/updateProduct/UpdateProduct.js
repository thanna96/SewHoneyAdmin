import React, {Component} from 'react';
import UpdateColor from "../updateColor/UpdateColor";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class UpdateProduct extends Component {
    render() {
        return (
            <div className="row col-10 mx-auto col-md-6 ">
                <h3>Update Information</h3>
                <UpdateColor/>
                <Form>
                    <h3>Update Products:</h3>
                    <Form.Group controlId="products">
                        <Form.Label>Select Product:</Form.Label>
                        <Form.Control name="products" onChange={this.handleArrays} as="select">
                            <option value="White">Bikini1</option>
                            <option value="Red">2</option>
                            <option value="Black">3</option>
                            <option value="Yellow">4</option>
                            <option value="Blue">5</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.File  id="imgUpload" label="Add New Picture:" onChange={this.handleFileChanged} />
                    </Form.Group>

                    <Form.Label>Change Price:</Form.Label>
                    <Form.Control name='title' onChange={this.handleChange}/>
                    <br/>
                    <Button variant="primary" type="submit" >
                        Submit Changes
                    </Button>
                    <br/>
                    <br/>
                    <Button variant="danger" type="submit" >
                        Delete Product
                    </Button>
                </Form>
            </div>
        );
    }
}

export default UpdateProduct;