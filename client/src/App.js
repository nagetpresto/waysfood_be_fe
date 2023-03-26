import './App.css';
import './assets/style/style.css'
import 'aos/dist/aos.css';
import AOS from 'aos';
import {Container, Nav, Navbar, Button} from 'react-bootstrap';

import PartnerDropdown from './components/PartnerDropdown'
import UserDropDown from './components/UserDropDown';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import Home from './pages/Home';
import Partner from './pages/Partner';
import Cart from './pages/Cart';
import UserProfile from './pages/UserProfile';
import Map from './components/MapComponent';
import HomeAdmin from './pages/HomeAdmin';
import PartnerProfile from './pages/PartnerProfile';
import UpdateProfilePartner from './pages/UpdateProfilePartner';
import ListProduct from './pages/ProductList';
import AddProduct from './pages/AddProduct';
import UpdateProduct from './pages/UpdateProduct';
import PrivateRoute from './privateRoot/PrivateRoot';
import EmailConfirm from './components/EmailConfirm';

import { useContext } from "react";
import { UserContext } from "./context/userContext"
import { API, setAuthToken } from './config/api';
import { useEffect, useState } from "react";
import { Routes, Route} from "react-router-dom";

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {
  useEffect(() => {
    AOS.init();
    cartData();
    User();
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
  const [state, dispatch] = useContext(UserContext);
  const isSignIn = state.isLogin;
  const status = state.user.role;

  // Logout Hanldler
  function handleLogOut() {
    window.location.replace('/')
    dispatch({
      type: "LOGOUT",
    });
  
  }

  // Fetch user
  const [profile, setProfile] = useState();
  const User = async () => {
    try {
      const response = await API.get(`/profile`);
      if (response.data.code === 200) {
        setProfile(response.data.data.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Calculating Cart Item
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
  const itemTotal = cart.length;

  // current location
  const [selectedLocation, setSelectedLocation] = useState({
    name: "",
    coordinates: [0,0],
    distance: 0,
  });

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

  return (
    <>
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
                            <a href="/my-cart"><img src="/shopping-basket.png" className="shopping-basket me-2" alt="Logo"/></a>
                            {itemTotal === 0 ? <p></p> :
                            <div className='item text-center'>
                            <p>{itemTotal}</p> 
                            </div>
                            }
                        </div>
                        }
                        <div className='d-flex flex-row'>
                            <div className='user-profile bg-light d-flex justify-content-center align-items-center me-3'>
                                <img src={profile} className="img-fluid" alt=""/>
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

        <Routes>
          <Route path="/cofirm-email-status/:code" element={<EmailConfirm />} />
          {status === "partner" ? 
            <Route path="/" element={<HomeAdmin />} /> :
            <Route path="/" element={<Home selectedLocation={selectedLocation}/>} /> 
          }
          <Route path="/partners/:id" element={<Partner />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/my-cart" element={itemTotal === 0 ?
              <div className='my-cart' data-aos="fade-down" data-aos-delay="200">
                Your cart is empty please check <a style={{textDecoration:'none'}}href="/">our product</a>
              </div> :<Cart />}
            />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/profile-partner" element={<PartnerProfile />} />
            <Route path="/update-profile-partner" element={<UpdateProfilePartner />} />
            <Route path="/product-list" element={<ListProduct/>} />
            <Route path="/add-product" element={<AddProduct/>} />
            <Route path="/update-product/:id" element={<UpdateProduct/>} />
          </Route>
        </Routes> 
    </> 
  );
}

export default App;
