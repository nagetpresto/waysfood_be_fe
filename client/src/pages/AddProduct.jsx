import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect, useState } from "react";
import {Container, Button, Modal, Form} from 'react-bootstrap';
import upload from "../assets/image/upload.png"
import { useMutation } from 'react-query';
import { API } from '../config/api';

export default function AddProduct() {
    useEffect(() => {
        AOS.init();
    })

    // initialize
    const [showModal, setShowModal] = useState(false);
    const [product, setProduct] = useState({
        name: '',
        price: '',
        image: ''
      });

    // Input Handle
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProduct({...product, [name]: value});
    };

    // File handler
    const [preview, setPreview] = useState(false);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setProduct({...product, image: file});
      };

    // Submit handler
    const handleSubmit = useMutation(async (e) => {
        try {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await API.post(`/products`, product, config);
        setShowModal(true)
        window.location.replace('/product-list')

        } catch (error) {
        console.log(error);
        }
    });

    return (
        <Container className="my-cart" data-aos="fade-down" data-aos-delay="100">
            <div className='d-flex flex-row justify-content-center align-items-center'>
                <div className='col-12 px-3'>
                    <h5 className='mb-4'>Add Product</h5>
                    <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                        <div className='d-flex col-12 flex-row'>
                            <div style={{width:'80%'}}>
                                <Form.Group className='mb-4' controlId="formBasicEmail">
                                    <Form.Control
                                        name="name"
                                        type="text"
                                        onChange={handleInputChange}
                                        placeholder="Product Name"
                                        required
                                        />
                                </Form.Group>
                            </div>
                            <div style={{width:'20%'}} className='d-flex justify-content-end'>
                                <Form.Group className='mb-4 col-11'>
                                    <Form.Control
                                        id="upload"
                                        className="custom-file-input"
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleFileChange} />
                                        <label style={{height:'100%'}} className="upload px-2 d-flex align-items-center justify-content-center" for="upload">Product Photo
                                            <img className="ms-3" src={upload}/>
                                        </label>
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group className='mb-4' controlId="formBasicEmail">
                            <Form.Control
                            name="price"
                            type="number"
                            onChange={handleInputChange}
                            placeholder="Price" 
                            required
                            />
                        </Form.Group>

                        <div className='mt-5 text-center d-flex justify-content-end'>
                            <Button className='col-3 mb-2' variant="outline-primary" type="submit">
                                {handleSubmit.isLoading ? "Loading..." : "Add Product"}
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Body className='text-success text-center'>
                        Success Add Product
                    </Modal.Body>
            </Modal>
        </Container>
    )
}
