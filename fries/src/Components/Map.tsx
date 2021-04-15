import React, {useState, useRef, useMemo, useCallback} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import "./styles/map.css"
import {LatLng, LatLngTuple} from 'leaflet';

var ps : LatLngTuple = [51.505, -0.09];
interface MapProps {
  latitude : number,
  longitude : number
}

// const sState : any = (coords : MapProps) => {
//   this.setState({latitude : coords.latitude, longitude : coords.longitude})
// }


function DraggableMarker(props: any) {

    navigator.geolocation.getCurrentPosition((position) => {
      ps = [position.coords.latitude, position.coords.longitude]
    })
    const [draggable, setDraggable] = useState(false)
    const [position , setPosition] = useState(ps) 
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker : any = markerRef.current
          if (marker != null) {
            console.log(marker.getLatLng());
            setPosition(marker.getLatLng());
            if(props.setStateFunction){
              console.log("Map Here")
              props.setStateFunction(marker.getLatLng());
              // return marker.getLatLng();
            }
          }
        },
      }),
      [],
    )
    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d)
    }, [])

    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e : any) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
    })
  
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
function MapC (props : any) {
  return(
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} id="map">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        <DraggableMarker setStateFunction={props.mapFunction} />
      </MapContainer>
  )
}

export default MapC