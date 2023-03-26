import { Modal, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from '../context/userContext';
import { useMutation } from 'react-query';
import { API } from '../config/api';

function SignUpForm(props) {
  // calling modal switch handler 
  const handleSwitchToLogin = () => {
    props.onSwitch();
  };

  // input form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState("0,0");
  const [role, setRole] = useState('');

  // Get current location
  useEffect (() => {
    navigator.geolocation.getCurrentPosition((position) => {
        const { longitude, latitude } = position.coords;
        
        setLocation((longitude, latitude).toString());
    },(error) => console.log(error),
    { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
    )
},[]);


  // Register handle
  const [showNotif, setNotif] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleSubmitRegister = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify({
        email:    email,
        password: password,
        name:     name,
        gender:     gender,
        phone:     phone,
        location:     location,
        role: role,
      });

      await API.post("/register", body, config);
      setNotif(true);

      } catch (error) {
        console.log(error);
        setShowModal(true)
      }
  });

  return (
    <Modal {...props}
      centered
      >     
      <Modal.Body className='mx-4 my-2'>
        <Modal.Title className='mb-4'>Register</Modal.Title>

        <Form onSubmit={(e) => handleSubmitRegister.mutate(e)}>
          <Form.Group className='mb-4' controlId="formBasicEmail">
            <Form.Control
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email" />
          </Form.Group>

          <Form.Group className='mb-4' controlId="formBasicPassword">
            <Form.Control 
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password" />
          </Form.Group>

          <Form.Group className='mb-4' controlId="formBasicPassword">
            <Form.Control type="text"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Full Name" />
          </Form.Group>

          <Form.Group className='mb-4' controlId="formBasicPassword">
            <Form.Select onChange={(e) => setGender(e.target.value)}>
              <option value="">Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="others">Others</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className='mb-4' controlId="formBasicPassword">
            <Form.Control type="phone"
              required
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              placeholder="Phone" />
          </Form.Group>

          <Form.Group className='mb-4' controlId="formBasicPassword">
            <Form.Select onChange={(e) => setRole(e.target.value)}>
              <option value="">Role</option>
              <option value="customer">Customer</option>
              <option value="partner">Partner</option>
            </Form.Select>
          </Form.Group>

          <Button className='col-12 mb-2' variant="outline-primary" type="submit">
            {handleSubmitRegister.isLoading ? "Loading..." : "Register"}
          </Button>
          <Form.Text className="d-flex justify-content-center">
              Already have an account? klik <span onClick={handleSwitchToLogin}>Here</span>
          </Form.Text>
        </Form>
      </Modal.Body>

      <Modal show={showNotif} onHide={() => setNotif(false)}>
          <Modal.Body className='text-success text-center'>
              Register Success. Please Check your Email to confirm!
          </Modal.Body>
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Body className='text-success text-center'>
              Email is already Registered
          </Modal.Body>
      </Modal>

    </Modal>
    
  );
}

export default SignUpForm
