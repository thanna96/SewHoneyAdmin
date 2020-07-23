import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import {ProductConsumer} from "../../context";

const AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();
const docClient = new AWS.DynamoDB.DocumentClient();

class AddProduct extends Component {
    constructor(props){
        super(props);
        this.state = {
            imgFiles: [],
            id: null,
            title: '',
            price: null,
            img: [],
            description: '',
            sizes: ['XS','S','M','L','XL'],
            style: '',
            gender: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileChanged = this.handleFileChanged.bind(this);
        //this.handleArrays = this.handleArrays.bind(this);
    }

    componentDidMount() {
        this.getProductCount();
    }

    getProductCount = () => {
        const scanTable = async () => {
            const params = {
                TableName: "Products",
                ProjectionExpression: "id, title, info",
            };

            let scanResults = [];
            let items;
            do{
                items =  await docClient.scan(params).promise();
                items.Items.forEach((item) => scanResults.push(item));
                params.ExclusiveStartKey  = items.LastEvaluatedKey;
            }while(typeof items.LastEvaluatedKey != "undefined");

            let mapIDS = scanResults.map(product => parseInt(product.id))
            let newID = Math.max(...mapIDS) + 1
            console.log('ids:',mapIDS)
            console.log('new id',newID)
            this.setState({
                id:newID
            })
        };
        scanTable()
    }

    addProduct = (id,title,price,imgName,description,style,sizes,gender) =>{
        const params = {
            TableName: "Products",
            Item: {
                "id": id,
                "title": title,
                "info": {
                    "img": imgName,
                    "price": price,
                    "sizes": sizes,
                    "selSize": '',
                    "selColor": '',
                    "style": style,
                    "description": description,
                    "gender": gender,
                    "inCart": false,
                    "count": 0,
                    "total": 0
                }
            }
        };
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }
        });
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

    // handleArrays(Event) {
    //     let nam = Event.target.name;
    //     let val = Event.target.value;
    //     if(nam === 'sizes'){
    //         if(this.state.sizes.indexOf(val) < 0 ){
    //             this.state.sizes.push(val)
    //         }
    //     }
    // }

    handleSubmit(Event) {
        let imageNames = this.state.imgFiles;

        console.log(
            "id",this.state.id,
            "title",this.state.title,
            "price",this.state.price,
            "img",imageNames.map(image => image = image + ".jpeg"),
            "desc",this.state.description,
            "sizes",this.state.sizes,
            "gender",this.state.gender);
        this.addProduct(
            this.state.id,
            this.state.title,
            parseFloat(this.state.price),
            imageNames.map(image => image = image + ".jpeg"),
            this.state.description,
            this.state.style,
            this.state.sizes,
            this.state.gender);

        window.location.href = "/AddProduct";

        Event.preventDefault();
    }
    render() {
        return (
            <div className="row col-10 mx-auto col-md-6 ">
                <h3>Add New Product:</h3>
                <Form onSubmit={this.handleSubmit} >
                    <hr style={{"background":"#e6be8a"}}/>

                    <Form.Group>
                        <Form.File multiple id="imgUpload" label="Picture:" onChange={this.handleFileChanged} />
                    </Form.Group>
                    <br/>
                    <Row>
                        <Col>
                            <Form.Label>Product Name:</Form.Label>
                            <Form.Control name='title' onChange={this.handleChange}/>
                        </Col>
                        <Col>
                            <Form.Label>Price:</Form.Label>
                            <Form.Control name='price' type="number" onChange={this.handleChange}/>
                        </Col>
                    </Row>
                    <br/>
                    <Form.Group controlId="style">
                        <Form.Label>Select Style:</Form.Label>
                        <Form.Control name="style" onChange={this.handleChange} as="select">
                            <option value="">-</option>
                            <option value="bottom">Bottom</option>
                            <option value="Top">Top</option>
                            <option value="One-Piece">One-Piece</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="gender">
                        <Form.Label>Select Gender:</Form.Label>
                        <Form.Control name="gender" onChange={this.handleChange} as="select">
                            <option value="">-</option>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Label>Product Description:</Form.Label>
                    <Form.Control name='description' type="text" as="textarea" rows="3" onChange={this.handleChange}/>
                    <br/>
                    <ProductConsumer>
                        {value=>(
                            <div>
                                <Button variant="primary" onClick={()=>{
                                    let imageNames = this.state.imgFiles;
                                    value.openModal(
                                    {

                                        Item: {
                                            "id": this.state.id,
                                            "title": this.state.title,
                                            "info": {
                                                "img": imageNames.map(image => image = image + ".jpeg"),
                                                "price": this.state.price,
                                                "sizes": this.state.sizes,
                                                "selSize": '',
                                                "selColor": '',
                                                "style": this.state.style,
                                                "description": this.state.description,
                                                "inCart": false,
                                                "count": 0,
                                                "total": 0
                                            }
                                        }
                                    })}}>Preview
                                </Button>
                            </div>)}
                    </ProductConsumer>
                    <hr style={{"background":"#e6be8a"}}/>
                    <Button variant="primary" type="submit" >
                        Confirm
                    </Button>
                </Form>

            </div>
        );
    }
}

export default AddProduct;