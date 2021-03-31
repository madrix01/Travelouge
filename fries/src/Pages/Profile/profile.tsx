import React from 'react';
import Cookie from 'js-cookie';
import {ProfileModel} from '../../Models/profile.model'
import {RouteProps, RouteComponentProps} from 'react-router';
import './profile.css'
import PostCard from '../../Components/PostCard'
import AppBarStyled from '../../Components/AppBarStyled'
import {Button} from '@material-ui/core'

interface ProfileParams {
    username : string
}

interface PostProps {
    title : string
    description : string
    imageURL : string    
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
            isSameAsUser : this.props.match.params.username === Cookie.get().username ? true : false
        }
        this.getUser = this.getUser.bind(this);
        this.getPosts = this.getPosts.bind(this);
        this.follow = this.follow.bind(this);
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

    async follow() {
        const res = await fetch(`http://localhost:6969/api/follow/${this.state.id}`, {
            method : "GET",
            headers : {
                "authToken" : Cookie.get().authToken
            }
        })
        if(res.status === 200){
            this.setState({followers : this.state.followers + 1})
            alert(`Followed ${this.state.username}`)
        }else{
            alert('Already following')
        }
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
            console.log(this.state.posts);
            if(this.state.posts.length > 0 ){
                return(
                    <div className="pstMain">
                        {this.state.posts.map((pst : PostProps, index) => (
                            <div>
                                {console.log(pst.imageURL)}
                                <PostCard 
                                    title={pst.title}
                                    imageURL={pst.imageURL}
                                    description={pst.description}
                                />
                            </div>
                        ))}
                    </div>
                )
            }
            return(
                <div>
                    <h2>No posts</h2>
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
        return(
            <div className="profile-main">
                <AppBarStyled />
                <img src={this.state.profilePhotoUrl} alt="[ Profile Photo ]" className="profilePhoto"/>
                <div className="profile-name">
                    {this.state.username}
                </div>
                <div className="profile-bio">
                    {this.state.bio} <br/>
                    Travelouge Age : {Math.floor(age())} days <br/>
                    Following : {this.state.followings} Followers : {this.state.followers} <br/>
                    PlacesVisited : {this.state.placesVisited} <br/>
                    {followBtn}
                </div>
                <div className="profile-name" >Posts</div>
                <div>
                    <PostsDiv/>
                </div>
            </div>
        )
    }
}

export default Profile;