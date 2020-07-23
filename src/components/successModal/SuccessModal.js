import React, {Component} from 'react';
import {ProductConsumer} from "../../context";
import styled from "styled-components";
import Button from 'react-bootstrap/Button'
import Carousel from "react-bootstrap/Carousel";

class SuccessModal extends Component {

    render() {
        return (
            <ProductConsumer>
                {(value) =>{
                    const {modalOpen,closeModal} = value;
                    const{ Item } = value.modalProduct;

                    if(!modalOpen){
                        return null;
                    }else {
                        return (<ModalContainer>
                            <div className="container">
                                <div className="row">
                                    <div id="modal" className="col-8 mx-auto col-md-6 col-lg-4 text-center text-capitalize p-5">
                                        <h5>{Item.title}</h5>

                                        <div className="col-10 mx-auto col-md-6 my-3">
                                        <Carousel>
                                            {Item.info.img.map(image => (
                                                <Carousel.Item>
                                                    <img
                                                        key={image}
                                                        className="img-fluid d-block"
                                                        src={"https://s3.amazonaws.com/sew-honey-bucket/img/"+image}
                                                        alt="product"
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                        </div>

                                        {/*<img src={"https://s3.amazonaws.com/sew-honey-bucket/img/"+Item.info.img[0]} className="img-fluid" alt="product"/>*/}

                                        <h5 className="text-title text-uppercase text-muted mt-3 mb-2">
                                            style:{Item.info.style}
                                        </h5>
                                        <h5 className="text-title text-uppercase text-muted mt-3 mb-2">
                                            gender:{Item.info.gender}
                                        </h5>
                                        <h5 className="text-title text-uppercase text-muted mt-3 mb-2">
                                            description:{Item.info.description}
                                        </h5>
                                        <h5 className="text-muted">price : ${Item.info.price}</h5>

                                        <Button onClick={()=>closeModal()}>
                                            Close
                                        </Button>

                                    </div>
                                </div>
                            </div>
                        </ModalContainer>);
                    }
                }}
            </ProductConsumer>
        );
    }
}

const ModalContainer = styled.div`
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    #modal{
        background:rgba(255, 255, 255, 0.9);
    }
`;

export default SuccessModal;