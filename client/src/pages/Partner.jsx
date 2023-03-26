import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from "react";
import { useMutation } from 'react-query';
import { API } from '../config/api';
import { useContext } from "react";
import { UserContext } from '../context/userContext';
import { useParams } from "react-router-dom";

import {Col, Row, Form, Button, Modal } from "react-bootstrap"

function Partner () {
    useEffect (() => {
        AOS.init();
        Product();
        Partner();
        cartData();
    })

    // Fetching product data
    const params = useParams();
    const [data, setData] = useState();
    const Product = async () => {
      try {
        const response = await API.get(`/products/partners/${params.id}`);
        if (response.data.code === 200) {
          setData(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    //fetching resto
    const [rest, setRest] = useState();
    const Partner = async () => {
        try {
        const response = await API.get("/partners");
        if (response.data.code === 200) {
            setRest(response.data.data.find(item => item.id == params.id));
            // const Name = response.data.data.find(item => item.id == params.id);
        }
        } catch (error) {
        console.log(error);
        }
    };

    // confrim context
    const [state, dispatch] = useContext(UserContext);
    const isConfirmed = state.user.is_confirmed;
    const [showConfirm, setShowConfirm] = useState(false);

    // Fetching cart data
    const [cartPartner, setCartPartner] = useState(false);
    const cartData = async () => {
        try {
        const response = await API.get(`/carts-active`);
        if (response.data.code === 200) {
            if(response.data.data.length == 0){
                setCartPartner(false)
            }else{
                setCartPartner(response.data.data[0].partner_id);
            }
        }
        } catch (error) {
        console.log(error);
        }
    };

    // Handle Add to cart
    const [showModal, setShowModal] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showStock, setShowStock] = useState(false);
    const { id } = useParams(); 
    const intId = parseInt(id, 10);
    const [prodId, setProdId] = useState(false);
    const addToCart = async (id, e) => {
        setProdId(id)
        if (localStorage.token) {
            if(isConfirmed === true){
                if(cartPartner == false || intId == cartPartner){
                    try {
                        e && e.preventDefault();
                  
                        const config = {
                            headers: {
                            "Content-type": "application/json",
                            },
                        };
                  
                        const data = {
                            partner_id: intId,
                            product_id: id,
                        };
    
                        const body = JSON.stringify(data);
                  
                        await API.post("/carts", body, config);
                        setShowModal(true);
                  
                    } catch (error) {
                    console.log(error);
                    }
                }else if(intId != cartPartner){
                    setShowStock(true)     
                }
            }else{
                setShowConfirm(true);
            }
        }else{
            setShowLogin(true)
        }
    }
    // Change resto
    const changeResto = async () => {
        try {      
            const config = {
                headers: {
                "Content-type": "application/json",
                },
            };

            const data = {
                partner_id: intId,
                product_id: prodId,
            };

            const body = JSON.stringify(data);
            await API.delete(`/carts`, config);

            await API.post("/carts", body, config);
            setShowStock(false)
            setShowModal(true);

        }
        catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="restaurant" data-aos="fade-down" data-aos-delay="200">
            <h4 className="mb-4">{rest && rest.name}, Menus</h4>
            <Form className="d-flex col-3 mb-4">
                <Form.Control
                size="sm"
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
            </Form>
            <Row className='pop-list'>
                {
                    data?.map((rest, i) => {
                        return(
                            <Col key={i} size={12} sm={6} md={3}>
                                <div className="product-cardd">
                                    <div className=" mt-3 mb-0 mx-3 prod-imgg d-flex justify-content-center align-items-center">
                                        <img alt="Product" className="img-fluid" src={rest.image}/>
                                    </div>
                                    <div className="prod-bodyy my-2 mx-3">
                                        <a>{rest.name}</a>
                                        <p className="mb-2 mt-2">Rp.{rest.price}</p>
                                        <div className='d-flex justify-content-center align-items-center'>
                                        <Button onClick={() => addToCart(rest.id)} className="col-12 text-center" size="sm" variant="outline-primary">Order</Button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        )
                    }
                )}
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Body className='text-success text-center'>
                    Success Add Product
                </Modal.Body>
            </Modal>
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Body className='text-danger text-center'>
                    Please confirm your email to proceed transaction!
                </Modal.Body>
            </Modal>
            <Modal show={showLogin} onHide={() => setShowLogin(false)}>
                <Modal.Body className='text-danger text-center'>
                    Please login or register to proceed transaction!
                </Modal.Body>
            </Modal>
            <Modal show={showStock} onHide={() => setShowStock(false)}>
                <Modal.Body className='text-center'>
                    <p className='mb-0' style={{fontSize:'20px'}}>Want to order from this resto instead?</p>
                    <span className="change-resto">Sure thing, but we will clear the items in your current cart </span>
                    <div style={{columnGap:'10px'}} className='mt-2 d-flex flex-row justify-content-center align-items-center'>
                        <div className='col-6'>
                            <Button onClick={() => setShowStock(false)} className="col-10 text-center" size="sm" variant="outline-primaryy">No</Button>
                        </div>
                        <div className='col-6'>
                        <Button onClick={() => changeResto(id)} className="col-10 text-center" size="sm" variant="outline-primaryyy">Yes</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>

    )
}

export default Partner