import React, { ReactComponentElement } from 'react';
import Cookie from 'js-cookie';
import {ProfileModel} from '../../Models/Profile.model'
import {RouteProps} from 'react-router';

interface ProfileProps {
    username : string
}

class Profile extends React.Component<ProfileProps, ProfileModel>{

    constructor(props : ProfileProps){
        super(props);

        this.state = {
            email: "",
            timeCreate : 0,
            followings: 0,
            username: "",
            id: "",
            bio: "",
            placesVisited: 0,
            followers: 0,
        }

        this.getUser = this.getUser.bind(this);
    }

    async getUser() {
        console.log(this.props.username);
        const res = await fetch('http://localhost:6969/api/home', {headers : {authToken : Cookie.get().authToken}});
        const data = await res.json();

        return data;
    }

    async componentDidMount() {
        const luser = await this.getUser();
        if(luser){
            this.setState(luser);
        }
    }

    render(){
        return(
            <div>
                This is Profile page
            </div>
        )
    }
}

export default Profile;