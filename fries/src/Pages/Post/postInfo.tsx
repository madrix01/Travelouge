import React from "react";
import AppBarStyled from "../../Components/AppBarStyled";
import './postInfo.css'
import {PostModel} from '../../Models/post.model'
import {url} from "../../constant"
import { RouteComponentProps, RouteProps } from "react-router";
import Cookie from 'js-cookie';
import {MapStable} from '../../Components/Map'

interface PostIdProps{
  id : string 
}

interface PostInfoState{
  title : string
  description : string
  latitude : number
  longitude : number
  timeCreate : number  
  imageURL : string
}

interface PostIdParams extends RouteComponentProps<PostIdProps>{

}

export default class PostInfo extends React.Component<PostIdParams & RouteProps, PostInfoState> {

  constructor(props : any){
    super(props);

    this.state = {
      title : "",
      description : "",
      timeCreate : 0,
      latitude : 0,
      longitude : 0,
      imageURL : '',
    }

    this.getPost = this.getPost.bind(this);
  }

  async getPost(){
    const pid :any = this.props.location.state;
    const response = await fetch(url + `/post/id/${pid.id}`, {headers : {authToken : Cookie.get().authToken}})
    if(response.status === 200){
      return response.json();
    }
  }

  async componentDidMount(){
    // const x: any = this.props.location.state;
    const data = await this.getPost();
    this.setState(data);
    console.log(this.state);
    
  }
  
  render() {

    var postDate : any = new Date(this.state.timeCreate);
    postDate = postDate.toDateString();


    return (
      <>
        <AppBarStyled />
        <div className="postInfoMain">
          <div className="postInfoSub">
            <div className="postInfoTitle">{this.state.title}</div>
            <div className="postDescription">{this.state.description}</div>
            <div className="postTime">{postDate}</div>
          </div>
            <img src={this.state.imageURL} className="postImage" />
            {/* <MapStable latitude={this.state.latitude} longitude={this.state.longitude}/> */}
        </div>
      </>
    );
  }
}
