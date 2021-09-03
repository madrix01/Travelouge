import React from "react";
import Cookies from 'js-cookie';
import './login.css'
import { Redirect } from "react-router";
import {Button} from '@material-ui/core';
import AppBarStyled from '../../Components/AppBarStyled'
import url from '../../constant';

interface LoginState {
  username : string,
  password : string,
  loggedin : string

}

class Login extends React.Component<{}, LoginState> {
  constructor(props: any) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loggedin : "0",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSumbit = this.handleSumbit.bind(this);
  }

  handleChange(event : React.FormEvent<HTMLInputElement>) {
    console.log("Here");
      
    const target = event.currentTarget;
      const value : string = target.value;
      const name : string = target.name;
      const n  = name as keyof LoginState
      this.setState({
        [n] : value
      } as Pick<LoginState, keyof LoginState>);
      return event;
  }

  handleSumbit(e : any){
    console.log('here');
    
    const loginReq = async () => {
      if(this.state.username === "" || this.state.password === ""){
        alert("Please enter username and password");
        return;
      }
      
      var reqBody = {
        username : this.state.username,
        password : this.state.password,
      }

      const response = await fetch(`${url}/user/login`, {
        method : 'POST',
        credentials : "same-origin",
        headers : {
          'Content-Type' : 'application/json',
        },
        body : JSON.stringify(reqBody)
      })
      console.log(response);
      
      const data = await response.json();
      console.log(data);

      

      if(response.status === 200){
        // alert('Logged in successfully');
        Cookies.set('authToken', data.authToken, {path : '/'});
        Cookies.set('verified', '1', {path : '/'});
        Cookies.set('username', this.state.username)
        this.setState({loggedin : "1"})
      }else{
        alert('Wrong username or password');
      }
    }

    loginReq();
    e.preventDefault();
  }
  
  render() {
    const LoginInternals = () => {
      return(
      <div className="login-main">
        <div className="loginTitle">Login</div>
        <form onSubmit={this.handleSumbit} autoComplete="off" className="loginForm">
          <input type="text" name="username" className="loginInput" placeholder="Username"  value={this.state.username} onChange={this.handleChange} autoComplete="off" /><br/>
          <input type="password" name="password" className="loginInput" placeholder="Password"  value={this.state.password} onChange={this.handleChange} autoComplete="off" /> <br/>
          <Button type="submit" variant="contained" style={{backgroundColor : "#fd4d4d"}}>Login</Button>
        </form>
      </div>
      )
    }
    if(this.state.loggedin === '1'){
      return(
        <Redirect to='/home'/>
      )
    }else{

    }
    return(
      <div>
        <AppBarStyled/>
        {LoginInternals()}
      </div>
      )
  }
}

export default Login
