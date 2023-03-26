import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect, useState } from "react";
import {Container, Button, Modal, Form} from 'react-bootstrap';
import upload from "../assets/image/upload.png"
import { useParams } from "react-router-dom";
import { useMutation } from 'react-query';
import { API } from '../config/api';
import {MapPartner} from '../components/MapComponent';
import {MapClickPartner} from '../components/MapClickComponent';
import { calculateDistance } from '../components/MapComponent';

export default function UpdateProfilePartner() {
    useEffect(() => {
        AOS.init();
    })

    useEffect(() => {
        Profile();
    },[])

    // initialize
    const params = useParams();
    const [showModal, setShowModal] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        password: '',
        image: '',
        location: ''
      });

      console.log(profile)

    // Fetching Profile
    const Profile = async () => {
      try {
        const response = await API.get(`/profile`);
        if (response.data.code === 200) {
          setProfile({
            name: response.data.data.name,
            email: response.data.data.email,
            image: response.data.data.image,
            location: response.data.data.location,
        });
        }
      } catch (error) {
        console.log(error);
      }
    };

    //search location
    const [showMap, setShowMap] = useState(false);
    const [showMap2, setShowMap2] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState({
        name: "",
        coordinates: [0,0],
    });
    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setProfile({...profile, location: location.coordinates.toString()});
    };

    // resto location
    const coordinatesString = profile.location;
    const coordinatesArray = coordinatesString.split(",");
    const coordinate = [parseFloat(coordinatesArray[0]), parseFloat(coordinatesArray[1])];
    const restoLocation= ({coordinates: coordinate});

    // Input Handle
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProfile({...profile, [name]: value});
    };

    // File handler
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setProfile({...profile, image: file});
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

        const newProfile = {
            name: profile.name,
            email: profile.email,
            password: profile.password,
            image: profile.image,
            location: profile.location,
        };

        const response = await API.patch(`/profile`, newProfile, config);
        setShowModal(true)
        window.location.replace('/profile-partner')

        } catch (error) {
        console.log(error);
        }
    });

    return (
        <Container className="my-cart" data-aos="fade-down" data-aos-delay="100">
            <div className='d-flex flex-row justify-content-center align-items-center'>
                <div className='col-12 px-3'>
                    <h5 className='mb-4'>Update Profile Partner</h5>
                    <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                        <div className='d-flex col-12 flex-row'>
                            <div style={{width:'80%'}}>
                                <Form.Group className='mb-4' controlId="formBasicEmail">
                                    <Form.Control
                                        name="name"
                                        type="text"
                                        value={profile.name} onChange={handleInputChange}
                                        placeholder="Partner Name"
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
                                        <label style={{height:'100%'}} className="upload px-2 d-flex justify-content-center align-items-center" for="upload">Attach Photo
                                            <img className="ms-3" src={upload}/>
                                        </label>
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group className='mb-4' controlId="formBasicEmail">
                            <Form.Control
                            name="email"
                            type="email"
                            value={profile.email} onChange={handleInputChange}
                            placeholder="Email" 
                            />
                        </Form.Group>

                        <Form.Group className='mb-4' controlId="formBasicEmail">
                            <Form.Control
                            name="password"
                            type="password"
                            onChange={handleInputChange}
                            placeholder="Password"
                            />
                        </Form.Group>

                        <Form.Group className="col-12 d-flex align-items-center col-3 mb-4">
                            <div style={{width:'80%'}}>
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
                            <div style={{width:'20%'}} className="d-flex justify-content-end">
                            <Button  onClick={() => setShowMap2(true)} variant="outline-primary" className='col-11 d-flex justify-content-center align-items-center'>Select on Map<img className='ms-2' src="/map.png"/></Button>
                            </div>
                        </Form.Group>
                        {showMap && (
                            < MapPartner
                            onClose={() => setShowMap(false)}
                            onSelectLocation={handleLocationSelect}
                            restoLocation={restoLocation}
                            />
                        )}
                        {showMap2 && (
                            < MapClickPartner
                            onClose={() => setShowMap2(false)}
                            onSelectLocation={handleLocationSelect}
                            restoLocation={restoLocation}
                            />
                        )}

                        <div className='mt-5 text-center d-flex justify-content-end'>
                            <Button className='col-3 mb-2' variant="outline-primary" type="submit">
                                {handleSubmit.isLoading ? "Loading..." : "Update Product"}
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Body className='text-success text-center'>
                        Success Update Profile
                    </Modal.Body>
            </Modal>
        </Container>
    )
}
