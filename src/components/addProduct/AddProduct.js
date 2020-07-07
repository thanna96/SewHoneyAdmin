import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

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
            sizes: [],
            colors: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileChanged = this.handleFileChanged.bind(this);
        this.handleArrays = this.handleArrays.bind(this);
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

            this.setState({
                id:scanResults.length + 1
            })
        };
        scanTable()
    }

    addProduct = (id,title,price,imgName,description,colors,sizes) =>{
        const params = {
            TableName: "Products",
            Item: {
                "id": id,
                "title": title,
                "info": {
                    "img": imgName,
                    "price": price,
                    "sizes": sizes,
                    "color": colors,
                    "selSize": '',
                    "selColor": '',
                    "style": "One-Piece",
                    "description": description,
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
                Key: "img/"+file.name + ".jpeg",
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

    handleArrays(Event) {
        let nam = Event.target.name;
        let val = Event.target.value;
        if(nam === 'colors'){
            if(this.state.colors.indexOf(val) < 0 ){
                this.state.colors.push(val)
            }
        }
        if(nam === 'sizes'){
            if(this.state.sizes.indexOf(val) < 0 ){
                this.state.sizes.push(val)
            }
        }
        console.log(this.state.colors)
    }

    handleSubmit(Event) {
        let imageNames = this.state.imgFiles;

        console.log(
            "id",this.state.id,
            "title",this.state.title,
            "price",this.state.price,
            "img",imageNames.map(image => image = image + ".jpeg"),
            "desc",this.state.description,
            "colors",this.state.colors,
            "sizes",this.state.sizes);
        this.addProduct(
            this.state.id,
            this.state.title,
            parseFloat(this.state.price),
            imageNames.map(image => image = image + ".jpeg"),
            this.state.description,
            this.state.colors,
            this.state.sizes);

        Event.preventDefault();
    }
    render() {
        return (
            <div className="row col-10 mx-auto col-md-6 ">
                <Form onSubmit={this.handleSubmit} >
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
                    <Form.Label>Product Description:</Form.Label>
                    <Form.Control name='description' type="text" as="textarea" rows="3" onChange={this.handleChange}/>
                    <br/>
                    <Form.Group controlId="colors">
                        <Form.Label>Select Colors (ctrl+click)</Form.Label>
                        <Form.Control name="colors" onChange={this.handleArrays} as="select" multiple>
                            <option value="White">White</option>
                            <option value="Red">Red</option>
                            <option value="Black">Black</option>
                            <option value="Yellow">Yellow</option>
                            <option value="Blue">Blue</option>
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit" >
                        Submit
                    </Button>
                </Form>
            </div>
        );
    }
}

export default AddProduct;