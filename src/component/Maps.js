/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, InfoWindow, Marker, useJsApiLoader, Autocomplete  } from "@react-google-maps/api";
import BusanDB from "../db/busan/busan";
import DaeguDB from "../db/daegu/daegu";
import SejongDB from "../db/sejong/sejong";
import SeoulDB from "../db/seoul/seoul"
import cloneDeep from 'lodash/cloneDeep';

const Maps = () => {
  
  // json data
  const [searchBox, setSearchBox] = useState("");

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${process.env.REACT_APP_MAPS_API_KEY}`,
  })

  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState({});

    const initialMarkers = [
        {
            position: {
                lat: 35.1439156,
                lng: 129.0105595
            },
            label: { color: "white", text: "P1" },
            draggable: false
        },
        {
            position: {
                lat: 35.1430156,
                lng: 129.0100495
            },
            label: { color: "white", text: "P2" },
            draggable: false
        },
        {
            position: {
              lat: 35.1420156,
              lng: 129.0100495
            },
            label: { color: "white", text: "P3" },
            draggable: true
        },
    ];
    
    const [activeInfoWindow, setActiveInfoWindow] = useState("");
    const [markers, setMarkers] = useState({});

    const containerStyle = {
        width: "100%",
        height: "600px",
    }

    let center = {
        lat: 35.1439156,
        lng: 129.0105595,
    }
    const mapClicked = (event) => { 
        // console.log(event.latLng.lat(), event.latLng.lng()) 
    }

    const markerClicked = (marker, index) => {  
        setActiveInfoWindow(index);
        console.log(marker, index);
    }

    const markerDragEnd = (marker, index) => { 
        // console.log(marker, index)
    }

    // input 값에 맞는 DB 가져오는 함수
    const getMatchDB = () => {
      // 기본 좌표 초기화
      
      while(markers.length > 0) {
        markers.pop();
      }
      while(mapCenter.length>0){
        center.pop();
      }
      
      const allMarkers = [...markers];
      let DB = new Array();
      if(searchBox=="부산"){
        DB=cloneDeep(BusanDB);
      } else if (searchBox=="대구"){
        DB=cloneDeep(DaeguDB);
      } else if (searchBox=="세종") {
        DB=cloneDeep(SejongDB);
      } else if (searchBox=="서울"){
        DB=cloneDeep(SeoulDB);
      } else{
        DB=cloneDeep(BusanDB);
      }
      if(searchBox=="세종"){
        setMapCenter({lat: parseFloat(DB[10].lat), lng: parseFloat(DB[10].lng)});
      } else if (searchBox=="부산") {
        setMapCenter({lat: parseFloat(DB[1].lat), lng: parseFloat(DB[1].lng)});
      } else if (searchBox=="서울") {
        setMapCenter({lat: parseFloat(DB[3].lat), lng: parseFloat(DB[3].lng)});
      } else {
        setMapCenter({lat: parseFloat(DB[2].lat), lng: parseFloat(DB[2].lng)});
      }

      for(let i = 0; i<DB.length; i++){        
        const marker = {
          position: {
            lat: parseFloat(DB[i].lat),
            lng: parseFloat(DB[i].lng)
          },
          // label: { color: "white", text: "testing" },
          text: DB[i].모집기관,
          date: DB[i].봉사기간,
          draggable: false
      }
      allMarkers.push(marker);
      setMarkers(allMarkers)
      }
    }

    useEffect(() => {
      setMarkers(initialMarkers);
      setMapCenter(center);
    }, [])

    return (
      <div className="maps-wrap">
        <div className="maps-container">
          <div className="maps-left-container">
            <p>Search</p>
            <input type="text" placeholder=" 지역을 입력하세요. ex)부산, 서울" onChange={(e)=>{setSearchBox(e.target.value)}}/>
            <a href="#!" onClick={getMatchDB}>Submit</a>
          </div>
          <div className="maps-right-container">
            {
              isLoaded ? (
                <GoogleMap 
                    mapContainerStyle={containerStyle} 
                    center={mapCenter} 
                    zoom={13}
                    onClick={mapClicked}
                    options={{
                      zoomControl: false,
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false
                    }}
                    onLoad={map => setMap(map)}
                >
                    {markers.map((marker, index) => (
                        <Marker 
                            key={index} 
                            position={marker.position}
                            // label={marker.label}
                            text={marker.text}
                            address={marker.address}
                            date={marker.date}
                            draggable={marker.draggable}
                            onDragEnd={event => markerDragEnd(marker, index)}
                            onClick={event => markerClicked(marker, index)} 
                        >
                            {
                                (activeInfoWindow === index)
                                &&
                                <InfoWindow position={marker.position}>
                                    <div>
                                      <h3>봉사모집공고</h3>
                                      <p>{marker.text}</p>
                                      <p>{marker.address}</p>
                                      <p>{marker.date}</p>
                                    </div>
        
                                    {/* <b>{marker.position.lat}, {marker.position.lng},</b> */}
                                </InfoWindow>
                            }  
                        </Marker>
                    ))}
                </GoogleMap>
              ):<></>
            }
          </div>
        </div>
      </div>
      
    );
    
};

export default Maps;