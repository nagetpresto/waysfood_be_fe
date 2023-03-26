import AOS from 'aos';
import 'aos/dist/aos.css';
import {useEffect} from 'react';

import LandingPage from '../components/LandingPage';
import Restaurant from '../components/Restaurant';

function Home (props){
    useEffect(() => {
        AOS.init();
      })

    return(
    <div style={{background:'#eeeeee'}} data-aos="fade-down" data-aos-delay="200">
      <LandingPage/>
      <Restaurant selectedLocation={props.selectedLocation}/>
    </div>
    )
}

export default Home