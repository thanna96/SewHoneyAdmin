import React, {Component} from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();

class UpdateColor extends Component {
    constructor(props){
        super(props);
        this.state = {
            colors: [],
            newColor: '',
            selectedColor: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.addColor = this.addColor.bind(this);
        this.deleteColor = this.deleteColor.bind(this);
    }

    componentDidMount() {
        this.setColors();
    }

    addColor(){
        let newColors = this.state.colors;
        newColors.push({color: this.state.newColor})

        console.log(newColors)
        this.setState({colors: newColors})

        const params = {
            TableName: "Colors",
            Item: {
                "color": this.state.newColor,
                }
            }
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }
        });
    }

    deleteColor(){
        let newColors = this.state.colors;
        let selColor = newColors.find(color => color.color === this.state.selectedColor)
        let index = newColors.indexOf(selColor)
        newColors.splice(index,1)

       this.setState({colors: newColors})

        const params = {
            TableName: "Colors",
            Key: {
                "color": this.state.selectedColor
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

    handleChange(Event){
        let nam = Event.target.name;
        let val = Event.target.value;
        this.setState({
            ...this.state,
            [nam]: val
        })
    }

    setColors = ()=>{
        const scanTable = async () => {
            const params = {
                TableName: "Colors",
                ProjectionExpression: "color",
            };

            let scanResults = [];
            let items;
            do{
                items =  await docClient.scan(params).promise();
                items.Items.forEach((item) => scanResults.push(item));
                params.ExclusiveStartKey  = items.LastEvaluatedKey;
            }while(typeof items.LastEvaluatedKey != "undefined");

            console.log("Scan Results:",scanResults)
            this.setState(()=>{
                return{colors:scanResults}
            })
        };
        scanTable();
    }

    render() {
        return (
            <Form onSubmit={this.deleteColor} >
                <hr style={{"background":"#e6be8a"}}/>
                <h3>Update Colors:</h3>
                <Row>
                    <Col>
                        <Form.Label>Color Name:</Form.Label>
                        <Form.Control name='newColor' onChange={this.handleChange}/>
                    </Col>
                    <Col>
                        <Form.Label>Add New Color:</Form.Label>
                        <Button variant="primary" onClick={this.addColor}>
                            Submit Color
                        </Button>
                    </Col>
                </Row>
                <Form.Group controlId="colors">
                    <Form.Label>Select Color:</Form.Label>
                    <Form.Control name="selectedColor" onChange={this.handleChange} as="select">
                        {this.state.colors.map(color => (
                            <option value={color.color} key={color.color}>{color.color}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Button variant="danger"  type="submit">
                    Delete Selected Color
                </Button>
                <hr style={{"background":"#e6be8a"}}/>
            </Form>
        );
    }
}

export default UpdateColor;