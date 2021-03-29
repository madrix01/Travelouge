import {GoogleMap, Marker, withScriptjs, withGoogleMap} from 'react-google-maps'
import React from 'react'

// const MapComponent = withGoogleMap((props : any) => {
//     return(
//         <GoogleMap 
//             defaultZoom ={8}
//             defaultCenter = {{lat: -34.397, lng: 150.644}}
//         >

//         {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />}

//         </GoogleMap>
//     )
// })
{/* <MapComponent isMarkerShown={false} /> */}

class MapComponent extends React.Component {
    render(){
        const GoogleMapE = withGoogleMap((props : any) => (
            <GoogleMap
                defaultCenter = { { lat: 40.756795, lng: -73.954298 } }
                defaultZoom = { 13 }
            >
            </GoogleMap>
        ))
        return(
            <div>
                <GoogleMapE
                    containerElement={ <div style={{ height: `500px`, width: '500px' }} /> }
                    mapElement={ <div style={{ height: `100%` }} /> }
                />
            </div>
        )
    }
}


export default MapComponent