import { METHODS } from "node:http";
import React from "react";
import { NewUser } from "../../Models/profile.model";
import './register.css'

class Register extends React.Component<{}, NewUser> {
  constructor(props: any) {
    super(props);

    this.state = {
      username: "",
      password: "",
      email: "",
      bio: "",
      profilePhoto : null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
  }

  handleChange(e: React.FormEvent<HTMLInputElement>) {
    const target = e.currentTarget;
    const value: string = target.value;
    const name: string = target.name;
    const n = name as keyof NewUser;
    this.setState({
      [n]: value,
    } as Pick<NewUser, keyof NewUser>);
  }

  handleSubmit(e : any){
    const registerReq = async () => {
      const formData = new FormData();
      console.log(this.state.username);
      
      formData.append('profilePhoto', this.state.profilePhoto);
      formData.append('username', this.state.username);
      formData.append('bio', this.state.bio);
      formData.append('password', this.state.password);
      formData.append('email', this.state.email);
      console.log(formData.values);
      
      const response = await fetch('http://localhost:6969/api/user/register', {
        method : "POST",
        body : formData,
      })
      // const response = await fetch('http://localhost:6969/api/user/register')
      const data = await response.json();
      console.log(data);
    }
    registerReq();
    e.preventDefault();

  }

  onFileChange(selectedFile : any){
    this.setState({profilePhoto : selectedFile[0]})
  }

  render() {
    return (
      <div className="register-main">
        <form onSubmit={this.handleSubmit}> 
          <input type="text" name="username" value={this.state.username} placeholder="username" onChange={this.handleChange} /><br/>
          <input type="text" name="email" placeholder="email" value={this.state.email} onChange={this.handleChange} /><br/>
          <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleChange} /> <br/>
          <input type="text" name="bio" placeholder="bio" value={this.state.bio} onChange={this.handleChange} /><br/>
          <input type="file" onChange={(e) => {
            this.onFileChange(e.target.files)}
          } /><br/>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default Register