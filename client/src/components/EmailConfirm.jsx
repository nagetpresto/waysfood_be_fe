import '../App.css';
import '../assets/style/style.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import {useEffect, useState} from 'react';
import { API } from '../config/api';
import {Container, Modal} from 'react-bootstrap';
import { useParams } from "react-router-dom";

function EmailConfirm() {
    useEffect (() => {
        AOS.init();
        Confirm();
    })

    const Confirm = async () => {
        try {    
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
    
            const response = await API.patch(`/confirm-email/${params.code}`, config);
    
            } catch (error) {
            console.log(error);
        }
    }

    const params = useParams();
    const [showModal, setShowModal] = useState(true);
    const handleConfirm = async () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.replace('/')
    }

  return (
    <div data-aos="fade-down" data-aos-delay="200">
        <Modal show={showModal}>
            <Modal.Body className='text-success text-center'>
                Email has been confirmed. Please Proceed to <a style={{textDecoration:'underline', fontWeight:'600', cursor:'pointer'}} onClick={() => handleConfirm()}>Login</a>
            </Modal.Body>
        </Modal>
    </div>
  );
}

export default EmailConfirm;