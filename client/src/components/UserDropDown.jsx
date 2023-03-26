import {NavDropdown} from 'react-bootstrap';

function UserDropDown(props){
    const handleIsSignOut = () => {
        props.onChange();
      };
    return (
        <NavDropdown
            align="end"
        >
            <NavDropdown.Item href="/user-profile"><img width='20' className='me-2' src="/user.png"/>Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleIsSignOut}><img width='20' className='me-2' src="/logout.png"/>Log Out</NavDropdown.Item>
        </NavDropdown> 
    )
}

export default UserDropDown