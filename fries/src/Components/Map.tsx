import React, {useState, useRef, useMemo, useCallback} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
// import {LatLngTuple} from 'leaflet';
import "./styles/map.css"
import {LatLng, LatLngTuple} from 'leaflet';


const ps : LatLngTuple= [51.505, -0.09]

function DraggableMarker() {
    const [draggable, setDraggable] = useState(false)
    const [position , setPosition] = useState(ps) 
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker : any = markerRef.current
          if (marker != null) {
            console.log(marker.getLatLng());
            setPosition(marker.getLatLng())
          }
        },
      }),
      [],
    )
    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d)
    }, [])
  
    return (
      <Marker
        draggable={draggable}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}>
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {draggable
              ? 'Marker is draggable'
              : 'Click here to make marker draggable'}
          </span>
        </Popup>
      </Marker>
    )
  }

function MapC () {
    return(
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} id="map">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          <DraggableMarker/>
        </MapContainer>
    )
}

export default MapC