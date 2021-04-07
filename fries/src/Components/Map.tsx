import React from 'react'
import {Map, GoogleApiWrapper} from 'google-maps-react';

class GmapComponent extends React.Component<{google : any}> {
    
    map?: google.maps.Map
    render(){
        return(
            <Map
                google={google}
                zoom={8}
                style={{height: "500px", width: "500px"}}
                initialCenter={{ lat: 47.444, lng: -122.176}}
        />
        )
    }
}

export default GoogleApiWrapper(
    (props: any) => ({
        apiKey : "AIzaSyCnMoEeOmEshKhgY_gy5jsNGJh9iFdlXo8"
    })
)(GmapComponent)