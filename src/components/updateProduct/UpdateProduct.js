import React, {Component} from 'react';
import UpdateColor from "../updateColor/UpdateColor";
import Header from "../header/Header";

class UpdateProduct extends Component {
    render() {
        return (
            <div className="row col-10 mx-auto col-md-6 ">
                <Header/>
                <h3>Update Existing:</h3>
                <UpdateColor/>
                {/*<h3>Update Products:</h3>*/}
                {/*<p>Update Product Here</p>*/}
            </div>
        );
    }
}

export default UpdateProduct;