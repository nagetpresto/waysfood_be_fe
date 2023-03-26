import {Container, Row, Table, Modal, Form, Button} from 'react-bootstrap';
import { useEffect, useState } from "react";
import upload from "../assets/image/upload.png"
import { useMutation } from 'react-query';
import { API } from '../config/api';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useContext } from "react";
import { UserContext } from '../context/userContext';

function UserProfile() {
    useEffect (() => {
        fakeAPI();
        AOS.init();
    })
    useEffect (() => {
        User();
    },[])

    // Fetching profile
    const [user, setUser] = useState({});
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        password: '',
        image: '',
        Gender: '',
        Phone: '',
    });
    const User = async () => {
      try {
        const response = await API.get(`/profile`);
        if (response.data.code === 200) {
          setProfile(response.data.data);
          setUser(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Update profile
    const [showProfile, setShowProfile] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Form handler
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProfile({...profile, [name]: value});
    };

    // File handler
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setProfile({...profile, image: file});
    };

    // SUbmit handler
    const [state, dispatch] = useContext(UserContext);
    const handleSubmit = useMutation(async (e) => {
        try {
        e.preventDefault();

        const newProfile = {
            name: profile.name,
            email: profile.email,
            password: profile.password,
            image: profile.image,
            gender: profile.gender,
            phone: profile.phone,
        };

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await API.patch("/profile", newProfile, config);
        setShowProfile(false)
        setShowModal(true)
        window.location.replace('/user-profile')

        } catch (error) {
        console.log(error);
        }
    });

    // Fetching transaction
    const [data, setData] = useState();
    const fakeAPI = async () => {
      try {
        const response = await API.get(`/transactions-user`);
        if (response.data.code === 200) {
            setData(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Detail trans
    const [showDetail, setShowDetail] = useState(false);
    const [detail, setDetail] = useState(false)
    const handleDetail = async (id) => {
        setDetail(data.find(item => item.id === id));
        setShowDetail(true)
    }
    // Calculating Item
    const totalQty = detail && detail.cart.length > 0 ? detail.cart.reduce((total, item) => total + item.qty, 0) : 0;
    const totalPrice = detail && detail.cart.length > 0 ? detail.cart.reduce((total, item) => total + item.amount, 0) : 0; 
    const feeDeliv = detail && detail.deliv_fee
    const total = totalPrice + feeDeliv
    return(
        <Container className='my-cart' data-aos="fade-down" data-aos-delay="200">
            <Row className="row">
                <div className=" row">
                    <div className="userprofile col-md-5 col-12">
                        <h5 className="mb-4">My Profile</h5>
                        <Row>
                            <div className="userprofileimg col-5 justify-content-center align-items-center">
                                <img style={{cursor:'pointer'}} src={user.image} className="user-img img-fluid" alt="Click to change" />
                            </div>
                            <div className="profile-detail col-7 d-flex flex-column">
                                <h6 className="mb-0">Full Name</h6>
                                <p className="mb-1">{user.name}</p>
                                <h6 className="mb-0">Email</h6>
                                <p className="mb-1">{user.email}</p>
                                <h6 className="mb-0">Gender</h6>
                                <p className="mb-1">{user.gender}</p>
                                <h6 className="mb-0">Phone</h6>
                                <p className="mb-1">{user.phone}</p>
                            </div>
                        </Row>
                        <Button onClick={() => setShowProfile(true)}  className='col-12 mb-2 btn-sm mt-3' variant="outline-primary" type="submit">
                            Update Profile
                        </Button>
                    </div>

                    <div className="userprofile col-md-7 col-12">
                        <h5 className="mb-4">Transaction History</h5>
                        <Row className="px-3" style={{gap: '10px'}}>
                        {
                            data?.map((trans, i) => {
                                const status = trans.status;
                                return(
                                    <div style={{cursor: 'pointer'}} onClick={() => handleDetail(trans.id)} key={i} className="py-2 transaction-card user-card d-flex flex-row justify-content-start align-items-center col-12">
                                        <div className="prod-detail col-8 px-2 d-flex flex-column justify-content-center">
                                            <h1 className="mb-1">{trans.cart.length > 0 ? trans.cart[0].partner.name : ""}</h1>
                                            <h3 className="mb-3">
                                            <span>{trans.day},</span> {trans.date}
                                            </h3>
                                            <h4>Total: Rp.{trans.cart.length > 0 ?  trans.deliv_fee + trans.cart.reduce(((total, item) => total + item.amount), 0) : 0} </h4>
                                        </div>
                                        <div className="trans-detail px-2 col-4 d-flex flex-column align-items-center justify-content-end">
                                            <div className="mb-2">
                                                <img src="/order.png" alt="Frame" />
                                            </div>

                                            {status === 'Success'
                                            ? <div><img src="/success.png" alt="Success" /></div>
                                            : status === 'Waiting Approval'
                                            ? <div><img src="/waiting.png" alt="Waiting" /></div>
                                            : status === 'Pending'
                                            ? <div><img src="/pending.png" alt="Waiting" /></div>
                                            : status === 'Failed'
                                            ? <div><img src="/failed.png" alt="Success" /></div>
                                            : status === 'On the Way'
                                            ? <div><img src="/otw.png" alt="Success" /></div>
                                            : <div><img src="/image/pending.png" alt="Failed" /></div>
                                            }
                                            
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </Row>
                    </div>
                </div>
            </Row>

            <Modal show={showProfile} onHide={() => setShowProfile(false)}>
                <Modal.Body className='mx-4 my-2'>
                    <Modal.Title className='mb-4'>Update Profile</Modal.Title>
                    <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                        <Form.Group className='mb-4' controlId="formBasicEmail">
                            <Form.Control value={profile.name}
                                onChange={handleInputChange}
                                name="name"
                                type="text"
                                placeholder="Full Name" />
                        </Form.Group>

                        <Form.Group className='mb-4' controlId="formBasicPassword">
                            <Form.Control value={profile.email}
                                onChange={handleInputChange}
                                name="email"
                                type="email"
                                placeholder="Email" />
                        </Form.Group>

                        <Form.Group className='mb-4' controlId="formBasicPassword">
                            <Form.Control
                                onChange={handleInputChange}
                                name="password"
                                type="password"
                                placeholder="Password" />
                        </Form.Group>

                        <Form.Group className='mb-4' controlId="formBasicEmail">
                            <Form.Control value={profile.gender}
                                onChange={handleInputChange}
                                name="gender"
                                type="text"
                                placeholder="Gender" />
                        </Form.Group>

                        <Form.Group className='mb-4' controlId="formBasicEmail">
                            <Form.Control value={profile.phone}
                                onChange={handleInputChange}
                                name="phone"
                                type="text"
                                placeholder="Phone" />
                        </Form.Group>

                        <Form.Group className='mb-4'>
                            <Form.Control
                            id="upload"
                            name="image"
                            className="custom-file-input"
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"/>
                            <label className="upload px-2 py-1" for="upload">Profile Image
                                <img className="ms-3" src={upload}/>
                            </label>
                        </Form.Group>

                        <Button className='col-12 mb-2' variant="outline-primary" type="submit">
                            {handleSubmit.isLoading ? "Loading..." : "Update"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

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

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Body className='text-success text-center'>
                        Success Update Profile
                    </Modal.Body>
            </Modal>

        </Container>
    )
}

export default UserProfile