import React from 'react';
import Cookie from 'js-cookie';
import {ProfileModel} from '../../Models/profile.model'
import {RouteProps, RouteComponentProps} from 'react-router';
import './profile.css'
import PostCard from '../../Components/PostCard'
import AppBarStyled from '../../Components/AppBarStyled'
import {Button} from '@material-ui/core'
import axios from 'axios';
import {url} from '../../constant';

interface ProfileParams {
    username : string
}

interface PostProps {
    title : string
    // description : string
    imageURL : string
    postUrl : string
    postId : string
}

interface ProfileProps extends RouteComponentProps<ProfileParams> {
}


class Profile extends React.Component<ProfileProps & RouteProps, ProfileModel>{
    constructor(props : ProfileProps){
        super(props);
        this.state = {
            userExsist : false,
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
            isSameAsUser : this.props.match.params.username === Cookie.get().username ? true : false
        }
        this.getUser = this.getUser.bind(this);
        this.getPosts = this.getPosts.bind(this);
        this.follow = this.follow.bind(this);
    }

    async getUser() {
        const response = await axios.get(`${url}/u/${this.props.match.params.username}`, {
            headers : {authToken : Cookie.get().authToken}
        })
        if(response.status === 200){
            this.setState({
                userExsist : true
            })
            const data = response.data;
            return data;
        }
    }

    async getPosts() {
        const res = await fetch(`${url}/post/${this.props.match.params.username}`, {headers : {authToken : Cookie.get().authToken}});
        const data = await res.json();
        console.log(data);
        return data;
    }

    async follow() {
        const res = await fetch(`${url}/follow/${this.state.id}`, {
            method : "GET",
            headers : {
                "authToken" : Cookie.get().authToken
            }
        })
        console.log(res.status);
        
        if(res.status === 200){
            this.setState({followers : this.state.followers + 1})
            alert(`Followed ${this.state.username}`)
        }else{
            alert('Already following')
        }
    }

    async unfollow() {
        // pass
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
        // console.log(this.state);
    }


    render(){
        const age = () => {
            const d1 = new Date(Date.now());
            const d2 = new Date(this.state.timeCreate);

            var diffInTime = d1.getTime() - d2.getTime();
            var diffInDay = diffInTime/(1000 * 3600 * 24);

            return diffInDay
        }

        const PostsDiv =  () => {
            if(this.state.posts.length > 0 ){
                return(
                    <div className="pstMain">
                        {this.state.posts.map((value : PostProps, index) => (
                            <div key={index}>
                                <PostCard 
                                    title={value.title}
                                    imageURL={value.imageURL}
                                    postUrl={value.postUrl}
                                    postId={value.postId}   
                                    username={this.props.match.params.username}
                                />
                            </div>
                        ))}
                    </div>
                )
            }
            return(
                <div>
                    <h2 style={{ textAlign : 'center'}}>No posts</h2>
                </div>
            )
        }

        let followBtn;
        if(!this.state.isSameAsUser){
            followBtn = (
                <div>
                    <Button variant="contained" color="primary" style={{margin: "5px"}} onClick={this.follow}>Follow</Button>
                    <Button variant="contained" color="secondary" style={{margin: "5px"}}>Unfollow</Button>
                </div>
            )
        }
        console.log(this.state.userExsist)
        if(this.state.userExsist){
            return(
                <div>
                    <AppBarStyled />
                    <div className="profile-main">
                        <div className="profileLeft">
                            <img src={this.state.profilePhotoUrl} alt="[ Profile Photo ]" className="profilePhoto"/>
                            <div className="profile-name">
                                {this.state.username}
                            </div>
                            <div className="profile-bio">
                                {this.state.bio} <br/>
                                Travelouge Age : {Math.floor(age())} days <br/>
                                Followings : {this.state.followings} Followers : {this.state.followers} <br/>
                                PlacesVisited : {this.state.placesVisited} <br/>
                                {followBtn}
                            </div>
                        </div>
                        <div className="profileMid">
                            <div className="profile-name" >Posts</div>
                            <PostsDiv/>
                        </div>
                    </div>
                </div>
            )
        }else if(!this.state.userExsist){
            return(
                <h1 style={{textAlign : "center"}}>404 Not found</h1>
            )
        }
    }
}

export default Profile;