import {Container, Row} from 'react-bootstrap';

function LandingPage () {
    return(
        <Container fluid className='landing-page'>
            <Row className='d-flex align-items-center px-4 px-md-0 py-4 py-md-0'>
                <div className='col-12 col-md-7 landing-right'>
                    <h4 className='pt-2'>Are You Hungry?</h4>
                    <h4 className='pt-2'>Express Home Delivery</h4>
                    <div className='d-flex flex-row'>
                        <div className='col-4 me-2'>
                            <hr className='mt-2'/>
                        </div>
                        <div className='col-8'>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
                        </div>
                    </div>
                </div>
                <div className='col-12 col-md-5 landing-left'>
                    <img src='./landing.png' alt="Landing" className='landing-img pt-4 pt-md-0'/>
                </div>
            </Row>
        </Container>
    )
}

export default LandingPage