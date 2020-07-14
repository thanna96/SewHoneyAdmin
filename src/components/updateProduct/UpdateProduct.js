import React, {Component} from 'react';
import UpdateColor from "../updateColor/UpdateColor";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3();
const docClient = new AWS.DynamoDB.DocumentClient();

class UpdateProduct extends Component {
    constructor(props){
        super(props);
        this.state = {
            products: [],
            selProduct: '',
            price: 0,
            images: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.handleFileChanged = this.handleFileChanged.bind(this);
    }

    handleChange(Event){
        let nam = Event.target.name;
        let val = Event.target.value;
        this.setState({
            ...this.state,
            [nam]: val
        })
    }

    handleFileChanged(Event){
        const fileNames = [];
        for (let i = 0; i< Event.target.files.length; i++){
            fileNames.push(Event.target.files[i].name)
        }

        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.imgFiles = fileNames
        Array.from(Event.target.files).forEach((file)=>{
            const uploadParams = {
                Bucket: 'sew-honey-bucket',
                Key: "img/"+ file.name + ".jpeg",
                Body: ''
            };
            uploadParams.Body = file;
            s3.upload(uploadParams, function(err, data) {
                if (err) {
                    console.log("Error", err);
                } if (data) {
                    console.log("Upload Success", data.Location);
                }
            });
        })
    }

    deleteItem(){
        let newProducts = this.state.products;
        let selItem = newProducts.find(item => item.title === this.state.selProduct)
        let index = newProducts.indexOf(selItem)
        newProducts.splice(index,1)

        this.setState({products: newProducts})

        const params = {
            TableName: "Products",
            Key: {
                "id": selItem.id,
                "title": selItem.title
            }
        };

        docClient.delete(params, function(err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
            }
        });
    }

    render() {
        return (
            <div className="row col-10 mx-auto col-md-6 ">
                <h3>Update Information</h3>
                <UpdateColor/>
                <Form>
                    <h3>Update Products:</h3>
                    <Form.Group controlId="products">
                        <Form.Label>Select Product:</Form.Label>
                        <Form.Control name="selProduct" onChange={this.handleChange} as="select">
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
                    <Form.Control name='price' onChange={this.handleChange}/>
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