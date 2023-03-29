import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

export const MapClickPartner = (props) => {
  const [selectedLocation, setSelectedLocation] = useState({
      name: "My current location",
      coordinates: props.restoLocation.coordinates,
  });

  useEffect(() => {
    mapboxgl.workerClass = MapboxWorker; // Wire up loaded worker to be used instead of the default
      mapboxgl.accessToken =
        "pk.eyJ1IjoibmFnZXRwcmVzdG8iLCJhIjoiY2xmcnp6Y2tmMDFoYjNxbWg5cmoyNmEwaCJ9.oiCsMuVAE2WVoQ0Br1403w";
      const map = new mapboxgl.Map({
        container: "map2",
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: "mapbox://styles/mapbox/streets-v12",
        center: selectedLocation.coordinates,
        zoom: 13,
      });
    
      // Add marker for selected location
      const marker = new mapboxgl.Marker({ color: "red" }).setLngLat(selectedLocation.coordinates).addTo(map);
      
      // Handle map click event
      map.on("click", (e) => {
        setSelectedLocation({
          name: "Selected Location",
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
        // Update marker position
        marker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
        
        // Call the onSelectLocation
        props.onSelectLocation({
          name: "Selected Location",
          coordinates: [e.lngLat.lng, e.lngLat.lat],
        });
      });
    }, []); 

  return (
      <div className="col-6">
          <div className="d-flex flex-row">
              <div className="col-6">{selectedLocation.name}</div>
              <div onClick={props.onClose} style={{cursor:'pointer'}} className="col-6 d-flex justify-content-end">X</div>
          </div>
          
          {/* <div>
              Latitude: {selectedLocation.coordinates[1]}
              <br />
              Longitude: {selectedLocation.coordinates[0]}
          </div> */}
          <div id="map2" style={{ height: "400px", width: "100%" }} />
      
      </div>
  );
};

//distance
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

const MapClick = (props) => {
    const [selectedLocation, setSelectedLocation] = useState({
        name: "My current location",
        coordinates: [0, 0],
        distance: 0,
    });
  
    useEffect(() => {
      mapboxgl.workerClass = MapboxWorker; // Wire up loaded worker to be used instead of the default
        
        mapboxgl.accessToken =
          "pk.eyJ1IjoibmFnZXRwcmVzdG8iLCJhIjoiY2xmcnp6Y2tmMDFoYjNxbWg5cmoyNmEwaCJ9.oiCsMuVAE2WVoQ0Br1403w";
        const map = new mapboxgl.Map({
          container: "map",
          // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
          style: "mapbox://styles/mapbox/streets-v12",
          center: selectedLocation.coordinates,
          zoom: 13,
        });
      
        // Add marker for selected location
        const marker = new mapboxgl.Marker().setLngLat(selectedLocation.coordinates).addTo(map);
        const marker2 = new mapboxgl.Marker({ color: "red" }).setLngLat(props.restoLocation.coordinates).addTo(map);
      
        // Handle map click event
        map.on("click", (e) => {
          setSelectedLocation({
            name: "Selected Location",
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          });
          // Update marker position
          marker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
          //calucalate distance
          const distance = calculateDistance(
            e.lngLat.lat,
            e.lngLat.lng,
            props.restoLocation.coordinates[1],
            props.restoLocation.coordinates[0]
          );
          setSelectedLocation({
            name: "Selected Location",
            coordinates: [e.lngLat.lng, e.lngLat.lat],
            distance: distance.toFixed(2),
          });
          // Call the onSelectLocation
          props.onSelectLocation({
            name: "Selected Location",
            coordinates: [e.lngLat.lng, e.lngLat.lat],
            distance: distance.toFixed(2),
          });
        });
      
        // Get current location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords;
            setSelectedLocation({
              name: "My current location",
              coordinates: [longitude, latitude],
            });
            // Update map center to current location
            map.setCenter([longitude, latitude]);
            // Add marker for current location
            marker.setLngLat([longitude, latitude]).addTo(map);
            //calucalate distance
            const distance = calculateDistance(
              latitude,
              longitude,
              props.restoLocation.coordinates[1],
              props.restoLocation.coordinates[0]
            );
            setSelectedLocation({
              name: "My current location",
              coordinates: [longitude, latitude],
              distance: distance.toFixed(2),
            });
            // Call the onSelectLocation
            props.onSelectLocation({
              name: "My current location...",
              coordinates: [longitude, latitude],
              distance: distance.toFixed(2),
            });
          },
          (error) => console.log(error),
          { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
        );
      }, []); 

    return (
        <div className="col-6">
            <div className="d-flex flex-row">
                <div className="col-6">{selectedLocation.name}</div>
                <div onClick={props.onClose} style={{cursor:'pointer'}} className="col-6 d-flex justify-content-end">X</div>
            </div>
            <div className="col-6">{selectedLocation.distance} km</div>
            {/* <div>
                Latitude: {selectedLocation.coordinates[1]}
                <br />
                Longitude: {selectedLocation.coordinates[0]}
            </div> */}
            <div id="map" style={{ height: "400px", width: "100%" }} />
        
        </div>
    );
};

export default MapClick;