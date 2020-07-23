import React, {Component} from 'react';

const AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();
const ProductContext = React.createContext();

class ProductProvider extends Component {
    state ={
        products: [],
        detailProduct: {},
        modalOpen:false,
        modalProduct: {}
    }

    componentDidMount() {
        this.setProducts()
    }

    setProducts = ()=>{
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

            console.log("Scan Results:",scanResults)
            this.setState(()=>{
                return{products:scanResults.sort((a,b)=> a.id > b.id ? 1 : -1)}
            })
        };
        scanTable();
    }

    getItem = (id,title) =>{
        return this.state.products.find(item => item.id === id && item.title === title);
    }

    handleDetail = (id,title) =>{
        const product = this.getItem(id,title);
        this.setState(()=>{
            return {detailProduct:product};
        });
    }

    openModal = (product) =>{
        //const product = this.getItem(id,title);
        //console.log(product)
        this.setState( () =>{
            return {modalProduct:product,modalOpen:true}
        })
    }

    closeModal = () =>{
        this.setState( ()=>{
            return {modalOpen:false}
        })
    }

    render() {
        return (
            <ProductContext.Provider value={{
                ...this.state,
                handleDetail: this.handleDetail,
                openModal: this.openModal,
                closeModal: this.closeModal,
                removeItem: this.removeItem,
                getItem: this.getItem
            }}>
                {this.props.children}
            </ProductContext.Provider>
        );
    }
}

const ProductConsumer = ProductContext.Consumer;

export {ProductProvider,ProductConsumer};