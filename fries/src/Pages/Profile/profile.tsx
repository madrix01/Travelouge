import React from 'react';
import Cookie from 'js-cookie';
import {ProfileModel} from '../../Models/profile.model'
import {RouteProps, RouteComponentProps} from 'react-router';
import './profile.css'
import PostCard from '../../Components/PostCard'

interface ProfileParams {
    username : string
}

interface PostProps {
    title : string
    description : string
    imageUrl : string    
}

interface ProfileProps extends RouteComponentProps<ProfileParams> {
}


class Profile extends React.Component<ProfileProps & RouteProps, ProfileModel>{
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
            profilePhotoUrl : "",
            posts : [],
        }
        this.getUser = this.getUser.bind(this);
        this.getPosts = this.getPosts.bind(this);
    }

    async getUser() {
        console.log("Username", this.props.match.params.username);
        
        
        const res = await fetch(`http://localhost:6969/api/u/${this.props.match.params.username}`, {headers : {authToken : Cookie.get().authToken}});
        const data = await res.json();
        console.log(data);
        
        return data;
    }

    async getPosts() {
        const res = await fetch(`http://localhost:6969/api/post/${this.props.match.params.username}`, {headers : {authToken : Cookie.get().authToken}});
        const data = await res.json();
        console.log(data);
        return data;
    }

    async componentDidMount() {
        const luser = await this.getUser();
        if(luser){
            this.setState(luser);
        }
        const posts = await this.getPosts();
        if(posts) {
            this.setState({posts : posts})
        }
    }

    render(){
        const age = () => {
            const d1 = new Date(Date.now());
            const d2 = new Date(this.state.timeCreate);

            var diffInTime = d1.getTime() - d2.getTime();
            var diffInDay = diffInTime/(1000 * 3600 * 24);
            console.log("Day", diffInDay);

            return diffInDay
        }

        const PostsDiv =  () => {
            return(
                <div>
                    <h1>Posts</h1>
                    {/* {this.state.posts.map((pst : PostProps, index) => {
                        <div>
                            <PostCard 
                                title={pst.title}
                            />
                        </div>
                    })} */}
                    <PostCard 
                        title="Helo"
                    />
                </div>
            )
        }
        return(
            <div className="profile-main">
                <img src={this.state.profilePhotoUrl} alt="[ Profile Photo ]"   />
                <div className="profile-name">
                    {this.state.username}
                </div>
                <div className="profile-bio">
                    {this.state.bio} <br/>
                    Travelouge Age : {Math.floor(age())} days <br/>
                    Following : {this.state.followings} Followers : {this.state.followers} <br/>
                    PlacesVisited : {this.state.placesVisited}
                </div>
                <div>
                    <PostsDiv/>
                </div>
            </div>
        )
    }
}

export default Profile;