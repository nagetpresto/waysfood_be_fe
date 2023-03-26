import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect, useState } from "react";
import {Container, Button, Modal, Table} from 'react-bootstrap';
import { API } from '../config/api';

export default function ListProduct() {
    useEffect(() => {
        AOS.init();
        Product();
        User();
    })

    //fetching user
    const [userID, setUserID] = useState([]);
    const User = async () => {
        try {
          const response = await API.get(`/profile`);
          if (response.data.code === 200) {
            setUserID(response.data.data.id);
          }
        } catch (error) {
          console.log(error);
        }
      };

    // Fetching product
    const [product, setProduct] = useState([]);
    const Product = async () => {
      try {
        const response = await API.get(`/products/partners/${userID}`);
        if (response.data.code === 200) {
          setProduct(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Handle Edit
    const [showModal, setShowModal] = useState(false);


    // Handle Delete
    const [showModalDel, setShowModalDel] = useState(false);
    const handleDelete = async (id,e) => {
        const toUpdate = product.find(item => item.id === id);
        try {
            e && e.preventDefault();
      
            const config = {
                headers: {
                "Content-type": "application/json",
                },
            };
      
            await API.delete(`/products/${id}`, config);
            setShowModalDel(true);
        } 
        catch (error) {
            console.log(error);
        }
    }
    
    return(
        <Container className='my-cart' data-aos="fade-down" data-aos-delay="200">
        <h5>List Product</h5>
        <Button href="/add-product" className='btn btn-primary py-0 mt-2 mb-0 btn-sm'>Add Product</Button>
        <div className='mt-2 col-12'>
            <Table size="sm" bordered responsive="sm">
                <thead>
                    <tr>
                        <th className='text-center' style={{width: '10px'}}>No</th>
                        <th className='text-center' style={{width: '120px', overflow:'hidden'}}>image</th>
                        <th className='text-center' style={{width: '180px'}}>Name</th>
                        <th className='text-center' style={{width: '95px'}}>Price</th>
                        <th className='text-center' style={{width: '170px'}}>Action</th>
                    </tr>
                </thead>
                <tbody>
                { product?.map((item, i) => {
                    return(
                        <tr className='text-center'  key={i}>
                            <td>{i+1}</td>
                            <td className='d-flex justify-content-center'>
                                <div className='d-flex justify-content-center align-items-center' style={{width:'90px', height:'150px', overflow:'hidden'}}>
                                    <img className='img-fluid' src={item.image}/>
                                </div>
                            </td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td className='text-center'>
                                <Button onClick={() => handleDelete(item.id)} className='btn btn-danger py-0 me-3 btn-sm'>Delete</Button>
                                <Button href={`/update-product/${item.id}`} className='btn btn-success py-0 btn-sm'>Update</Button>
                            </td>
                        </tr>
                    )
                 })
                }
                </tbody>
            </Table>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Body className='text-success text-center'>
                Update Success
            </Modal.Body>
        </Modal>
        <Modal show={showModalDel} onHide={() => setShowModalDel(false)}>
            <Modal.Body className='text-success text-center'>
                Delete Success
            </Modal.Body>
        </Modal>
    </Container>
    )
}
