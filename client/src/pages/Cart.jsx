import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from "react";
import {Container, Row, Modal, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';

import { API } from '../config/api';
import Map from '../components/MapComponent';
import MapClick from '../components/MapClickComponent';
import { calculateDistance } from '../components/MapComponent';

function Cart(){
    useEffect (() => {
        AOS.init();
        cartData();
        handleAddQty();
        handleMinusQty();
        Resto();       
    })

    // Fetching cart data
    const [cart, setCart] = useState([]);
    const cartData = async () => {
        try {
        const response = await API.get(`/carts-active`);
        if (response.data.code === 200) {
            setCart(response.data.data);
        }
        } catch (error) {
        console.log(error);
        }
    };
    
    const [showModal, setShowModal] = useState(false);
    const [showShipping, setShowShipping] = useState(false);
    const [showStock, setShowStock] = useState(false);
    // Increasing qty
    const handleAddQty = async (id, e) => {
        const toUpdate = cart.find(item => item.id === id);
        try {
            e && e.preventDefault();
      
            const config = {
                headers: {
                "Content-type": "application/json",
                },
            };
      
            const data = {
                qty: 1+toUpdate.qty,
            };

            if(data.qty > toUpdate.product.stock){
                setShowStock(true)
            }else{
                const body = JSON.stringify(data);
      
                await API.patch(`/carts/${id}`, body, config);
                setShowModal(true);
            }
        } 
        catch (error) {
            console.log(error);
        }
    }

    // Reducing qty
    const handleMinusQty = async (id,e) => {
        const toUpdate = cart.find(item => item.id === id);
        try {
            e && e.preventDefault();
      
            const config = {
                headers: {
                "Content-type": "application/json",
                },
            };
      
            const data = {
                qty: toUpdate.qty-1,
            };

            if (data.qty === 0){
                await API.delete(`/carts/${id}`, config);
                setShowModal(true);
            }else{
                const body = JSON.stringify(data);
      
                await API.patch(`/carts/${id}`, body, config);
                setShowModal(true);
            }
        } 
        catch (error) {
            console.log(error);
        }
    }

    // Deleting Qty
    const handleDelQty = async (id,e) => {
        const toUpdate = cart.find(item => item.id === id);
        try {
            e && e.preventDefault();
      
            const config = {
                headers: {
                "Content-type": "application/json",
                },
            };
      
            await API.delete(`/carts/${id}`, config);
            setShowModal(true);
        } 
        catch (error) {
            console.log(error);
        }
    }
    
    // Fetching resto
    const [rest, setRest] = useState("0,0");
    const PartnerID = cart[0]?.partner_id;
    const Resto = async () => {
        try {
        const response = await API.get(`/users/${PartnerID}`);
        if (response.data.code === 200) {
            setRest(response.data.data.location);
        }
        } catch (error) {
        console.log(error);
        }
    };

    // resto location
    const coordinatesString = rest;
    const coordinatesArray = coordinatesString.split(",");
    const coordinate = [parseFloat(coordinatesArray[0]), parseFloat(coordinatesArray[1])];
    const restoLocation= ({coordinates: coordinate});
    console.log(restoLocation)

    // Location search
    const [showMap, setShowMap] = useState(false);
    const [showMap2, setShowMap2] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState({
            name: "",
            coordinates: [0,0],
            distance: 0,
        });

    // Get current location
    useEffect (() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { longitude, latitude } = position.coords;
            
            setSelectedLocation({
                name: "Search location...",
                coordinates: [longitude, latitude],
                distance: 0,
            });
        },(error) => console.log(error),
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
        )
    },[]);

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
      };

    // Calculating Item
    const totalQty = cart.length > 0 ? cart.reduce((total, item) => total + item.qty, 0) : 0;
    const totalPrice = cart.length > 0 ? cart.reduce((total, item) => total + item.amount, 0) : 0; 
    const feeDeliv = parseInt(10000 * selectedLocation.distance, 10)
    const total = totalPrice + feeDeliv
    
    // payment
    const navigate = useNavigate();
    const [showModalPay, setShowModalPay] = useState(false);
    const handleSubmit =  async (e) => {
        try {
        e.preventDefault();

        const config = {
            headers: {
            "Content-type": "application/json",
            },
        };

        
        const langString = selectedLocation.coordinates[0].toString();
        const latString = selectedLocation.coordinates[1].toString();

        const body = JSON.stringify({
            partner_id: PartnerID,
            location: langString+","+latString,
            distance: parseFloat(selectedLocation.distance, 64),
            deliv_fee: feeDeliv,
        });

        const response = await API.patch("/transactions", body, config);
        const token = response.data.data.token;
        window.snap.pay(token, {
            onSuccess: function (result) {
            /* You may add your own implementation here */
            console.log(result);
            setShowModalPay(true)
            navigate("/user-profile");
            },
            onPending: function (result) {
            /* You may add your own implementation here */
            console.log(result);
            setShowModalPay(true)
            navigate("/user-profile");
            },
            onError: function (result) {
            /* You may add your own implementation here */
            console.log(result);
            setShowModalPay(true)
            navigate("/user-profile");
            },
            onClose: function () {
            /* You may add your own implementation here */
            alert("you closed the popup without finishing the payment");
            },
        })
        // window.location.replace('/user-profile')

        } catch (error) {
        console.log(error);
        }
    };

    // Snap
    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;
    
        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    
        document.body.appendChild(scriptTag);
        return () => {
        document.body.removeChild(scriptTag);
        };
    }, []);

    return (
        <Container className='my-cart' data-aos="fade-down" data-aos-delay="200">
            <h5>{cart[0]?.partner.name}</h5>
            <p className="mb-2 mt-4">Delivery Location</p>
            <Form className="col-12 d-flex align-items-center col-3 mb-4">
                <div className="col-9">
                <Form.Control
                    size=""
                    name="location"
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    value={selectedLocation.name}
                    onClick={() => setShowMap(true)}                    
                />
                </div>
                <div className="col-3 d-flex justify-content-end">
                <Button onClick={() => setShowMap2(true)} variant="outline-primary" className='col-11 d-flex justify-content-center align-items-center'>Select on Map<img className='ms-2' src="/map.png"/></Button>
                </div>
            </Form>
            {showMap && (
                < Map
                onClose={() => setShowMap(false)}
                onSelectLocation={handleLocationSelect}
                restoLocation={restoLocation}
                />
            )}
            {showMap2 && (
                < MapClick
                onClose={() => setShowMap2(false)}
                onSelectLocation={handleLocationSelect}
                restoLocation={restoLocation}
                />
            )}

            <p className="mb-0 mt-4">Review Your Order</p>
            <Row>
                <div className='col-md-8 col-12'>                    
                    <hr className='mt-1'></hr>
                    <Row style={{gap:'10px'}}>
                        {
                            cart?.map((item, i) => {
                                return (
                                    <div key={i} className='d-flex flex-row'>
                                        <div className='cart-img col-2'>
                                            <img className='img-fluid' src={item.product.image}/>
                                        </div>
                                        <div className='ps-3 col-10 d-flex flex-column justify-content-center'>
                                            <div className="cart-detail-1 d-flex flex-row">
                                                <h5>{item.product.name}</h5>
                                                <div className='ms-auto'>
                                                    <p>Rp.{item.product.price}</p>
                                                </div>
                                            </div>
                                            <div className="cart-detail-2 d-flex flex-row">
                                                <div>
                                                    <img style={{cursor: 'pointer'}} onClick={() => handleMinusQty(item.id)} className="img-fluid" src="/-.png"/>
                                                    <span className='amount mx-3 px-3'>{item.qty}</span>
                                                    <img style={{cursor: 'pointer'}} onClick={() => handleAddQty(item.id)} className="img-fluid" src="/+.png"/>
                                                </div>
                                                <div className='ms-auto'>
                                                    <img style={{cursor: 'pointer'}} onClick={() => handleDelQty(item.id)} className="img-fluid" src="/bin.png"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Row>
                    <hr></hr>
                </div>

                <div className='col-md-4 col-12'>
                    <hr className="mb-2 mt-1"></hr>
                    <div className="cart-detail-1 d-flex flex-row">
                        <p>Sub Total</p>
                        <div className='ms-auto'>
                            <p>Rp.{totalPrice}</p>
                        </div>
                    </div>
                    <div className="cart-detail-2 d-flex flex-row">
                        <p>Qty</p>
                        <div className='ms-auto'>
                            <p>{totalQty}</p>
                        </div>
                    </div>
                    <div className="cart-detail-3 d-flex flex-row">
                        <p>Delivery Fee</p>
                        <div className='ms-auto'>
                            <p>Rp.{feeDeliv}</p>
                        </div>
                    </div>
                    <hr className="mt-0"></hr>
                    <div className="cart-detail-3 d-flex flex-row">
                        <p>Total</p>
                        <div className='ms-auto'>
                            <p>Rp.{total}</p>
                        </div>
                    </div>
                    <div className='d-flex justify-content-end mt-3'>
                        <Button onClick={(e) => handleSubmit(e)} variant="outline-primary" className='col-7 d-flex justify-content-center align-items-center'>Order</Button>
                    </div>
                </div>
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Body className='text-success text-center'>
                        Success Update Cart
                    </Modal.Body>
            </Modal>
            <Modal show={showStock} onHide={() => setShowStock(false)}>
                    <Modal.Body className='text-danger text-center'>
                        You cannot add product more than the stock 
                    </Modal.Body>
            </Modal>
            <Modal show={showModalPay} onHide={() => setShowModalPay(false)}>
                <Modal.Body className='text-success text-center'>
                    Thank you for ordering in us, please wait 1 x 24 hours to verify you order
                </Modal.Body>
            </Modal>
            {/* <ShippingForm show={showShipping} onHide={() => setShowShipping(false)}/> */}
        </Container>
    )
}

export default Cart
