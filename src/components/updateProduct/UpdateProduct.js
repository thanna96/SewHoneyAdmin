import React, {Component} from 'react';
import UpdateColor from "../updateColor/UpdateColor";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {ProductConsumer} from "../../context";

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
            images: [],
            picture:'',
            gender: '',
            style: '',
            description:''
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

    deleteItem(products){
        let selItem = products.find(item => item.title === this.state.selProduct)
        products.splice(products.indexOf(selItem),1)
        this.setState({selProduct:''})
        this.setState({products: products})

        const params = {
            TableName: "Products",
            Key: {
                "id": selItem.id,
                "title": this.state.selProduct
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
            <ProductConsumer >
                {(value) => {
                    let products = value.products;
                    let images = [];
                    let price = 0;
                    let gender = '-';
                    let style = '-';
                    let description = ' ';

                    if(this.state.selProduct) {
                        let item = value.getItem2(this.state.selProduct)
                        images = item.info.img
                        price = item.info.price
                        gender = item.info.gender
                        style = item.info.style
                        description = item.info.description
                    }
                    return (
                        <div className="col-10 mx-auto col-md-6 ">
                            <h3>Update Information</h3>
                            <UpdateColor/>
                            <Form>
                                <h3>Update Products:</h3>
                                <Form.Group controlId="products">
                                    <Form.Label>Select Product:</Form.Label>
                                    <Form.Control name="selProduct" onChange={this.handleChange} as="select">
                                        <option value="">-</option>
                                            {products.map( product =>(
                                                    <option value={product.title} key={product.title}>{product.title}</option>
                                                ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group>
                                    <Form.File  id="imgUpload" label="Add New Picture:" onChange={this.handleFileChanged} />
                                </Form.Group>

                                <Row>
                                    <Col>
                                        <Form.Group controlId="picture">
                                            <Form.Label>Remove Picture:</Form.Label>
                                            <Form.Control name="picture" onChange={this.handleChange} as="select">
                                                <option value="">-</option>
                                                {
                                                    images.map(img => (
                                                        <option value={img} key={img}>{img}</option>
                                                    ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <div className="container-fluid">
                                            <img src={"https://s3.amazonaws.com/sew-honey-bucket/img/"+this.state.picture}
                                                 alt="pic"
                                                 style={{width:"100%"}}/>
                                        </div>
                                    </Col>
                                </Row>
                                <Button variant="danger" >
                                    Delete Selected Picture
                                </Button>
                                <br/>

                                <Form.Label>Change Price:</Form.Label>
                                <Form.Control name='price'
                                              placeholder={price}
                                              onChange={this.handleChange}
                                />
                                <br/>

                                <Form.Group controlId="gender">
                                    <Form.Label>Change Gender:</Form.Label>
                                    <Form.Control name="gender" onChange={this.handleChange} as="select">
                                        <option value={gender}>{gender}</option>
                                        <option value="men">Men</option>
                                        <option value="women">Women</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="style">
                                    <Form.Label>Change Style:</Form.Label>
                                    <Form.Control name="style" onChange={this.handleChange} as="select">
                                        <option value={style}>{style}</option>
                                        <option value="bottom">Bottom</option>
                                        <option value="Top">Top</option>
                                        <option value="One-Piece">One-Piece</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Label>Change Description:</Form.Label>
                                <Form.Control name='description' type="text" as="textarea" rows="3" placeholder={description} onChange={this.handleChange}/>
                                <br/>

                                <Row>
                                    <Col>
                                        <Button variant="primary" onClick={()=>{
                                            let imageNames = this.state.imgFiles;
                                            let item = value.getItem2(this.state.selProduct)
                                            value.openModal(
                                                {
                                                    Item: {
                                                        "id": item.id,
                                                        "title": item.title,
                                                        "info": {
                                                            "img": item.info.img,
                                                            "price": this.state.price,
                                                            "sizes": [],
                                                            "selSize": '',
                                                            "selColor": '',
                                                            "style": this.state.style,
                                                            "description": this.state.description,
                                                            "gender": this.state.gender,
                                                            "inCart": false,
                                                            "count": 0,
                                                            "total": 0,
                                                            "type":this.state.type
                                                        }
                                                    }
                                                })}} >
                                            Preview Changes
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button variant="primary" type="submit" >
                                            Submit Changes
                                        </Button>
                                    </Col>
                                </Row>
                                <br/>
                                <Button variant="danger" onClick={()=>{
                                    this.deleteItem(value.products)
                                }}>
                                    Delete Product
                                </Button>
                            </Form>
                        </div>
                    )
                }}
            </ProductConsumer >
        );
    }
}

export default UpdateProduct;