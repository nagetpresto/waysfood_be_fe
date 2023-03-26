import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useState } from "react";
import {Container, Table, Modal, Row, Button} from 'react-bootstrap';
import { API } from '../config/api';

function HomeAdmin() {
    useEffect (() => {
        fakeAPI();
        AOS.init();
    })

    // Fetching transaction
    const [data, setData] = useState();
    const fakeAPI = async () => {
      try {
        const response = await API.get(`/transactions-partner`);
        if (response.data.code === 200) {
          setData(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Update OTW
    const [showNotif, setShowNotif] = useState(false);
    const handleOTW = async (id, e) => {
        try {
        e && e.preventDefault();

        const body = {
            status: "Success",
        };

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await API.patch(`/transactions/${id}`, body, config);
        setShowNotif(true)

        } catch (error) {
        console.log(error);
        }
    };

    // Upate Cancle
    const handleCancle = async (id, e) => {
        try {
        e && e.preventDefault();

        const body = {
            status: "Failed",
        };

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await API.patch(`/transactions/${id}`, body, config);
        setShowNotif(true)

        } catch (error) {
        console.log(error);
        }
    };

    // Upate Approve
    const handleApprove = async (id, e) => {
        try {
        e && e.preventDefault();

        const body = {
            status: "On the Way",
        };

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await API.patch(`/transactions/${id}`, body, config);
        setShowNotif(true)

        } catch (error) {
        console.log(error);
        }
    };

    // Handle detail
    const [showDetail, setShowDetail] = useState(false);
    const [detail, setDetail] = useState(false)
    const handleDetail = async (id) => {
        setDetail(data.find(item => item.id === id));
        setShowDetail(true)
    }
    const totalQty = detail && detail.cart.length > 0 ? detail.cart.reduce((total, item) => total + item.qty, 0) : 0;
    const totalPrice = detail && detail.cart.length > 0 ? detail.cart.reduce((total, item) => total + item.amount, 0) : 0; 
    const feeDeliv = detail && detail.deliv_fee
    const total = totalPrice + feeDeliv
    

    return (
        <Container className='my-cart' data-aos="fade-down" data-aos-delay="200">
            <h5>Income Transaction</h5>
            <div className='mt-4 d-flex align-items-center justify-content-center'>
                <Table size="sm" bordered responsive="sm">
                    <thead>
                        <tr className=''>
                            <th style={{width: '120px'}}>ID</th>
                            <th style={{width: '290px'}}>Name</th>
                            <th style={{width: '250px'}}>Address</th>
                            <th style={{width: '200px'}}>Products Order</th>
                            <th style={{width: '200px'}}>Status</th>
                            <th className="text-center" style={{width: '250px'}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.map((data,i) => {
                                const status = data.status;
                                return(
                                    <tr style={{cursor: 'pointer'}} key={i}>
                                        <td onClick={() => handleDetail(data.id)} >{data.id}</td>
                                        <td onClick={() => handleDetail(data.id)} >{data.user.name}</td>
                                        <td onClick={() => handleDetail(data.id)} >{data.location}</td>
                                        <td onClick={() => handleDetail(data.id)} >{data.cart[0].product.name}, ...</td>
                                        <td onClick={() => handleDetail(data.id)} >
                                            {status === 'Success'
                                            ? <span className="text-success">{data.status}</span>
                                            : status === 'Waiting Approval'
                                            ? <span className="text-warning">{data.status}</span>
                                            : status === 'Failed'
                                            ? <span className="text-danger">{data.status}</span>
                                            : status === 'On the Way'
                                            ? <span className="text-primary">{data.status}</span>
                                            : <span className="text-danger">{data.status}</span>
                                            }
                                        </td>
                                        <td className="text-center">
                                            {status === 'Success'
                                            ? <img src="/y.png"/>
                                            : status === 'On the Way'
                                            ? <div className='d-flex flex-row justify-content-center'>
                                                <div className='col-6'>
                                                    <Button onClick={() => handleOTW(data.id)} className='btn btn-primary py-0 btn-sm col-11'>Success</Button>
                                                </div>
                                              </div>
                                            : status === 'Failed'
                                            ? <img src="/x.png"/>
                                            : status === 'Pending'
                                            ? <img src="/x.png"/>
                                            : <div className='d-flex flex-row justify-content-center'>
                                                <div className='col-6'>
                                                <Button onClick={() => handleCancle(data.id)} className='btn btn-danger py-0 me-3 btn-sm col-11'>Cancel</Button>
                                                </div>
                                                <div className='col-6'>
                                                    <Button onClick={() => handleApprove(data.id)} className='btn btn-success py-0 btn-sm col-11'>Approved</Button>
                                                </div>
                                              </div>
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>

            <Modal centered size="lg" show={showDetail} onHide={() => setShowDetail(false)}>
                <Modal.Body className='mx-4 my-2'>
                <h5 className='mb-4 text-center'>Transaction Detail</h5>
                    <Row>
                        <div className='col-3'>
                            <p className='mb-0'>Trans ID</p>
                            <p className=''>Date</p>
                        </div>
                        <div className=' col-9'>
                            <p className='mb-0'>:  {detail.id}</p>
                            <p className=''>: {detail.day}, {detail.date}</p>
                        </div>
                    </Row>
                    <h5>Customer Detail</h5>
                    <Row>
                        <div className='col-3'>
                            <p className='mb-0'>Name</p>
                            <p className='mb-0'>Email</p>
                            <p className='mb-0'>Phone</p>
                            <p className=''>Location</p>
                        </div>
                        <div className=' col-9'>
                            <p className='mb-0'>:  {detail && detail.user.name}</p>
                            <p className='mb-0'>:  {detail && detail.user.email}</p>
                            <p className='mb-0'>:  {detail && detail.user.phone}</p>
                            <p className=''>:  {detail && detail.location}</p>
                        </div>
                    </Row>

                    <h5>Restaurant Detail</h5>
                    <Row>
                        <div className='col-3'>
                            <p className='mb-0'>Name</p>
                            <p className=''>Location</p>
                            <p className='mb-0'>Qty</p>
                            <p className='mb-0'>SubTotal</p>
                            <p className='mb-0'>Delivery Fee</p>
                            <p className='mb-0'>Total</p>
                            <p className=''>Status</p>
                        </div>
                        <div className=' col-9'>
                            <p className='mb-0'>:  {detail && detail.cart[0].partner.name}</p>
                            <p className=''>:  {detail && detail.cart[0].partner.location}</p>
                            <p className='mb-0'>:  {totalQty} Pcs</p>
                            <p className='mb-0'>:  Rp.{totalPrice}</p>
                            <p className='mb-0'>:  Rp.{feeDeliv}</p>
                            <p className='mb-0'>:  Rp.{total}</p>
                            <p className='mb-0'>:  {detail.status}</p>
                        </div>
                    </Row>
                    <Table size="sm" bordered responsive="sm">
                        <thead>
                            <tr>
                                <th className='text-center' style={{width: '10px'}}>No</th>
                                <th className='text-center' style={{width: '200px', overflow:'hidden'}}>image</th>
                                <th className='text-center' style={{width: '240px'}}>Name</th>
                                <th className='text-center' style={{width: '100px'}}>Price</th>
                                <th className='text-center' style={{width: '100px'}}>Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                        { detail.cart?.map((item, i) => {
                            return(
                                <tr className='text-center' key={i}>
                                    <td>{i+1}</td>
                                    <td className='d-flex justify-content-center align-items-center'>
                                        <div className='d-flex justify-content-center align-items-center' style={{width:'90px', height:'150px', overflow:'hidden'}}>
                                            <img className='img-fluid' src={item.product.image}/>
                                        </div>
                                    </td>
                                    <td>{item.product.name}</td>
                                    <td>{item.product.price}</td>
                                    <td>{item.qty}</td>
                                </tr>
                            )
                        })
                        }
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
            <Modal show={showNotif} onHide={() => setShowNotif(false)}>
            <Modal.Body className='text-success text-center'>
                Update Success
            </Modal.Body>
        </Modal>
        </Container>
    )
}

export default HomeAdmin