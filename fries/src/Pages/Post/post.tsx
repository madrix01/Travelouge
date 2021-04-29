import React from 'react';
import {PostModel} from '../../Models/post.model'
import { Button } from "@material-ui/core";
import './post.css'
import Cookies from 'js-cookie'
import AppBarStyled from '../../Components/AppBarStyled'
import {MapC} from '../../Components/Map'
import {url} from '../../constant';

class NewPost extends React.Component<{} , PostModel> {
    constructor(props : any){
        super(props);

        this.state = {
            title : "",
            description: "",
            postPhoto : null,
            latitude : 0,
            longitude : 0,
            imgSrc : null,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.handleMapChange = this.handleMapChange.bind(this);
        this.preview = this.preview.bind(this);
    }

    handleChange(e : React.FormEvent<HTMLInputElement>){
        const target = e.currentTarget;
        const value : string = target.value;
        const name : string = target.name;
        const n = name as keyof PostModel;
        this.setState({
            [n]: value,
        } as unknown as Pick<PostModel, keyof PostModel>)
    }

    handleSubmit(e : any){
        console.log(this.state);
        const postReq = async () => {
            const formData = new FormData();
            console.log(this.state);
            
            formData.append('postImage', this.state.postPhoto);
            formData.append('title', this.state.title)
            formData.append('description', this.state.description)
            formData.append('latitude', this.state.latitude.toString())
            formData.append('longitude', this.state.longitude.toString())
            console.log(Cookies.get().authToken);
            
            const response = await fetch(url + '/post', {
                method : "POST",
                body : formData,
                headers : {
                    "authToken" : Cookies.get().authToken
                }
            })
            const data = await response.json();
            console.log(data);
            if(response.status === 200){
                alert("New post created")
            }
        }
        postReq();
        e.preventDefault();
    }
    onFileChange(selectedFile : any){
        this.setState({postPhoto : selectedFile[0]})
        var reader = new FileReader();
        var imgUrl = reader.readAsDataURL(selectedFile[0]);

        reader.onloadend = (e) => {
            this.setState({
                imgSrc : [reader.result]
            })
        }
        console.log(imgUrl);
    }

    handleMapChange(mpProps : any){
        console.log(mpProps);
        this.setState({latitude : mpProps.lat , longitude : mpProps.lng})
        console.log(this.state);
    }

    preview(){
        if(this.state.imgSrc !== null){
            return(
                <img src={this.state.imgSrc} alt="Upload Image to see preview" className="postImg" />
            )
        }
    }

    render(){
        console.log(this.state.postPhoto);
        return(
            <div className="post-main">
                <AppBarStyled/>
                <div className="postTitle">New Post</div>
                <form onSubmit={this.handleSubmit} className="postForm">
                    <div className="formInp1">
                        <input type="text" name="title" value={this.state.title} placeholder="title" onChange={this.handleChange} className="postInput" autoComplete="off" /><br/>
                        <input type="text" name="description" value={this.state.description} placeholder="description" onChange={this.handleChange} className="postInput" autoComplete="off" /><br/>
                        <input type="file" onChange={(e) => {
                            this.onFileChange(e.target.files)}
                        } /><br/>
                        {/* <img src={this.state.imgSrc} alt="Upload Image to see preview" className="postImg" /> */}
                        <Button type="submit"  variant="outlined" style={{backgroundColor : "#fd4d4d"}}>Post</Button>
                        {this.preview()}
                    </div>
                    <div className="formInp2">
                        <MapC mapFunction={this.handleMapChange}/>
                    </div>
                </form>
            </div>
        )
    }
}

export default NewPost