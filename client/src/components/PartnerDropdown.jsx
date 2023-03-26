import {NavDropdown} from 'react-bootstrap';

function PartnerDropdown(props){
    const handleIsSignOut = () => {
        props.onChange();
      };
    return (
        <NavDropdown
            align="end"
        >
            <NavDropdown.Item href="/profile-partner"><img width='20' className='me-2' src="/user.png"/>Profile Partner</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/product-list"><img width='20' className='me-2' src="/addProduct.png"/>List Product</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleIsSignOut}><img width='20' className='me-2' src="/logout.png"/>Log Out</NavDropdown.Item>
        </NavDropdown> 
    )
}

export default PartnerDropdown