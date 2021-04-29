import React from "react";
import {RouteProps, RouteComponentProps} from 'react-router';

import SearchBar from '../../Components/searchBar'
import {MapC, MapStable} from '../../Components/Map'
import NewPost from '../../Pages/Post/post' 
import {Button} from '@material-ui/core'

// const mc = () => {
//     return (
//         <div>
//             Hello
//             <MapC/>
//         </div>
//     )
// }

// const mc = () => {
//     return(
//         <div>
//             <Button variant="contained" color="primary">New Post</Button>
//         </div>
//     )
// }

interface popUp {
    seen : boolean
}

interface ProfileParams {

}

interface PpProps extends RouteComponentProps<ProfileParams> {
}

class Pp extends React.Component<PpProps, {}>{
    constructor(props : any) {
        super(props);
    } 

    handleClick = () => {
    }
}

class mc extends React.Component<{}, popUp> {
    
    constructor(props : any){
        super(props);

        this.state = {
            seen: false
        }

        this.togglePopUp = this.togglePopUp.bind(this)
    }

    togglePopUp = () => {
        this.setState({
            seen : !this.state.seen
        })
    }


    render(){
        return(
            <div>
                <Button variant="contained" color="primary" onClick={this.togglePopUp}>New Post</Button>
            </div>
        )
    }
}




export default mc