import React from "react";
import Cookies from 'js-cookie';
import './login.css'

interface LoginState {
  username : string,
  password : string,
}

class Login extends React.Component<{}, LoginState> {
  constructor(props: any) {
    super(props);

    this.state = {
      username: "",
      password: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSumbit = this.handleSumbit.bind(this);
  }

  handleChange(e : React.FormEvent<HTMLInputElement>) {
      const target = e.currentTarget;
      const value : string = target.value;
      const name : string = target.name;
      const n  = name as keyof LoginState
      this.setState({
        [n] : value
      } as Pick<LoginState, keyof LoginState>);
  }

  handleSumbit(e : any){
    
    const loginReq = async () => {
      if(this.state.username === "" || this.state.password === ""){
        alert("Please enter username and password");
        return;
      }
      
      var reqBody : LoginState = {
        username : this.state.username,
        password : this.state.password,
      }

      const response = await fetch("http://localhost:6969/api/user/login", {
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

      Cookies.set('authToken', data.authToken, {path : '/'});
      Cookies.set('verified', '1', {path : '/'});

      if(response.status === 200){
        alert('Logged in successfully');
      }else{
        alert('Wrong username or password');
      }
    }

    loginReq();
    e.preventDefault();
  }
  
  render() {
    return(
      <div className="login-main">
        <form onSubmit={this.handleSumbit}>
          Username: 
          <input type="text" name="username" value={this.state.username} onChange={this.handleChange} /><br/>
          Password
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange} /> <br/>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default Login
