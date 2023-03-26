import { Modal, Form, Button } from 'react-bootstrap';
import { useContext, useState } from "react";
import { UserContext } from '../context/userContext';
import { useMutation } from 'react-query';
import { API } from '../config/api';

function SignInForm(props) {
  // modal switch
  const [showModal, setShowModal] = useState(false);
  const handleSwitchToRegister = () => {
    props.onSwitch();
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, dispatch] = useContext(UserContext);

  const handleSubmit = useMutation(async (e) => {
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
      });

      const response = await API.post("/login", body, config);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.data,
      });
      props.onHide();
      window.location.replace('/')

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
        <Modal.Title className='mb-4'>Login</Modal.Title>

        <Form onSubmit={(e) => handleSubmit.mutate(e)}>
          <Form.Group className='mb-4' controlId="formBasicEmail">
            <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
          </Form.Group>

          <Form.Group className='mb-4' controlId="formBasicPassword">
            <Form.Control value={password} onChange={(e) => setPassword(e.target.value)}  type="password" placeholder="Password" />
          </Form.Group>

          <Button className='col-12 mb-2' variant="outline-primary" type="submit">
            {handleSubmit.isLoading ? "Loading..." : "Login"}
          </Button>
          <Form.Text className="d-flex justify-content-center">
              Don't have an account? klik <span onClick={handleSwitchToRegister}>Here</span>
          </Form.Text>
        </Form>
      </Modal.Body>
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body className='text-success text-center'>
            Email or Password is wrong
        </Modal.Body>
      </Modal>
    </Modal>
  );
}

export default SignInForm
