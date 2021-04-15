import React from "react";
import AppBarStyled from "../../Components/AppBarStyled";
import './postInfo.css'
import {PostModel} from '../../Models/post.model'
import {url} from "../../constant"
// interface PostInfoModel extends PostModel{
//   timecreated : number
// }


interface PostIdProps{
  postId : string 
}

export default class PostInfo extends React.Component<PostIdProps, {}> {

  constructor(props : any){
    super(props);

    this.state = {
      title : "",
      description : "",
      timecreate : 0,
      latitude : 0,
      longitude : 0,
      imageURL : '',
    }

    this.getPost = this.getPost.bind(this);
  }

  async getPost(){
    const response = await fetch(url + `id/${this.props.postId}`)
  }
  
  render() {
    // console.log(this.props.location.state.postId);
    const pid = this.props;
    console.log();
    
    return (
      <>
        <AppBarStyled />
        <div className="postInfoMain">
          <div className="postTitle"></div>
        </div>
      </>
    );
  }
}
