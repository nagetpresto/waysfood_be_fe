import '../assets/style/style.css'
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect, useState } from "react";
import {Container, Nav, Navbar, Button} from 'react-bootstrap';

import PartnerDropdown from './PartnerDropdown';
import UserDropDown from './UserDropDown';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

function NavBar () {
    useEffect(() => {
        AOS.init();
    })

    // modal handler
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);

    const handleLoginModal = () => {
        setShowSignInModal(!showSignInModal);
    };
    const handleRegisterModal = () => {
        setShowSignUpModal(!showSignUpModal);
    };
    const handleModalSwitch = () => {
        setShowSignInModal(!showSignInModal);
        setShowSignUpModal(!showSignUpModal);
    };

    // Login Handler
    const isSignIn = true;
    const status = "customer";

    // Logout Hanldler
    function handleLogOut() {
        window.location.replace('/')    
    }

    // Item cart
    const itemTotal = 3;

    return(
        <Navbar expand="lg" className='bg-light shadow fixed-top' data-aos="fade-down" data-aos-delay="100">
            <Container>
                <Navbar.Brand href="/">
                    <img src="/nav_icon.svg" width="120" alt="Logo"/>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto gap-3">
                        
                    {isSignIn === true ?
                    <>
                        {status === "partner" ? 
                        <div></div> :
                        <div style={{ position: 'relative' }} className='d-flex justify-content-start align-items-center'>
                            <a href="/my-cart"><img src="./shopping-basket.png" className="shopping-basket me-2" alt="Logo"/></a>
                            {itemTotal === 0 ? <p></p> :
                            <div className='item text-center'>
                            <p>{itemTotal}</p> 
                            </div>
                            }
                        </div>
                        }
                        <div className='d-flex flex-row'>
                            <div className='user-profile bg-light d-flex justify-content-center align-items-center me-3'>
                                <img src="./user.png" className="img-fluid" alt=""/>
                            </div> 
                            {status === "partner" ? 
                                <PartnerDropdown onChange={handleLogOut}/> :
                                <UserDropDown onChange={handleLogOut}/>
                            }
                        </div>
                    </> :
                    <>
                        <Button onClick={handleLoginModal} variant="outline-primary" className='d-flex justify-content-center align-items-center py-0'>Login</Button>
                        <Button onClick={handleRegisterModal} variant="outline-primary" className='d-flex justify-content-center align-items-center py-0'>Register</Button>
                    </>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
            
            <SignInForm show={showSignInModal} onHide={handleLoginModal} onSwitch={handleModalSwitch}/>
            <SignUpForm show={showSignUpModal} onHide={handleRegisterModal} onSwitch={handleModalSwitch} />
        </Navbar>
    )
}

export default NavBar