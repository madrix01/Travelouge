import React from "react";
import SearchBar from '../../Components/searchBar'
import {MapC, MapStable} from '../../Components/Map'

// const mc = () => {
//     return (
//         <div>
//             Hello
//             <MapC/>
//         </div>
//     )
// }

const mc = () => {
    return (
        <div>
            <MapStable longitude={69} latitude={69} />
        </div>
    ) 
}


export default mc