import React from 'react';
import {PostModel} from '../../Models/post.model'
import { Button } from "@material-ui/core";
import './post.css'
import Cookies from 'js-cookie'
import AppBarStyled from '../../Components/AppBarStyled'

class NewPost extends React.Component<{} , PostModel> {
    constructor(props : any){
        super(props);

        this.state = {
            title : "",
            description: "",
            postPhoto : null,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onFileChange = this.onFileChange.bind(this);

    }

    handleChange(e : React.FormEvent<HTMLInputElement>){
        const target = e.currentTarget;
        const value : string = target.value;
        const name : string = target.name;
        const n = name as keyof PostModel;
        this.setState({
            [n] : value,
        } as Pick<PostModel, keyof PostModel>)
    }

    handleSubmit(e : any){
        const postReq = async () => {
            const formData = new FormData();

            formData.append('postImage', this.state.postPhoto);
            formData.append('title', this.state.title)
            formData.append('description', this.state.description)
            console.log(Cookies.get().authToken);
            
            const response = await fetch('http://localhost:6969/api/post', {
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
    }

    render(){
        return(
            <div className="post-main">
                <AppBarStyled/>
                <div className="postTitle">New Post</div>
                <form onSubmit={this.handleSubmit} className="postForm">
                    <input type="text" name="title" value={this.state.title} placeholder="title" onChange={this.handleChange} /><br/>
                    <input type="text" name="description" value={this.state.description} placeholder="description" onChange={this.handleChange} /><br/>
                    <input type="file" onChange={(e) => {
                        this.onFileChange(e.target.files)}
                    } /><br/>
                <Button type="submit" color="primary" variant="outlined">Post</Button>
                </form>
            </div>
        )
    }
}

export default NewPost