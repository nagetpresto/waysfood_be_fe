import { Container, Col, Row, Form, Button } from "react-bootstrap"

import { API } from "../config/api"
import { useEffect, useState } from "react";

function Restaurant (props){
    const [data, setData] = useState();
    console.log(data)
  
    useEffect (() => {
        Partners();
        UpdateDistance();
    })

    const Partners = async () => {
        try {
        const response = await API.get("/partners");
        if (response.data.code === 200) {
            setData(response.data.data);
        }
        } catch (error) {
        console.log(error);
        }
    };

    const location = props.selectedLocation.coordinates
    // Update distance
    const UpdateDistance = async (e) => {
        try {
            const response = await API.patch(`/partners/${location}`);
            if (response.data.code === 200) {
            }
          } catch (error) {
            console.log(error);
          }
    };


    return(
        <Container className='product-page'>
            <div>
                <h4 className="mb-4">Popular Restaurant</h4>
                <Row className='pop-list'>
                {
                    data?.map((rest, i) => {
                        return(
                            <Col size={12} sm={6} md={3}>
                        <div style={{cursor:'pointer'}}className="pop-card d-flex flex-row align-items-center">
                            <div style={{cursor:'pointer'}} className="pop-image d-flex flex-row align-items-center col-3 ms-3 my-2">
                                <img alt="Product" href={"/partners/"+rest.id} className="img-fluid" src={rest.image}/>
                            </div>
                            <div className="pop-body col-9 d-flex align-items-center">
                                <a href={"/partners/"+rest.id}>{rest.name}</a>
                            </div>
                        </div>
                    </Col>
                        )
                    }
                )}                    
                </Row>
            </div>
            <div>
                <h4 className="mb-4 mt-5">Restaurant Near You</h4>
                <Form className="d-flex col-3 mb-4">
                    <Form.Control
                    size="sm"
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    />
                    <Button variant="outline-success">Search</Button>
                </Form>
                <Row className='pop-list'>
                    {
                        data?.map((rest, i) => {
                            return(
                                <Col key={i} size={12} sm={6} md={3}>
                                    <div className="product-card">
                                        <div className="my-3 mx-3 prod-img d-flex justify-content-center align-items-center">
                                            <img alt="Product" href={"/partners/"+rest.id} className="img-fluid" src={rest.image}/>
                                        </div>
                                        <div className="prod-body my-2 mx-3">
                                            <a href={"/partners/"+rest.id}>{rest.name}</a>
                                            <p className="mb-1 mt-2">{rest.distance} Km</p>
                                        </div>
                                    </div>
                                </Col>
                            )
                        }
                    )}
                </Row>
            </div>
        </Container>
    )
}

export default Restaurant