import React from 'react';
import Cookie from 'js-cookie';
import { Redirect, useHistory} from 'react-router-dom';
import AppBarStyled from '../../Components/AppBarStyled'

interface HomeState{
    name : string
    verified : boolean
}

class Home extends React.Component<{}, HomeState> {
    constructor(props : any){
        super(props);

        this.state = {
            name : "loading",
            verified : true,
        }

        this.getUser = this.getUser.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    async getUser() {
        const res = await fetch('http://localhost:6969/api/home', {headers : {authToken : Cookie.get().authToken}});
        const data = await res.json();

        console.log(data);
        return data;
    }

    async componentDidMount() {
        const luser= await this.getUser();
        if(luser){
            this.setState({name : luser.username, verified: true});
        }else{
            this.setState({verified : false});
        }
    }

    async onLogout() {
        Cookie.remove("authToken");
        Cookie.set('verified', '0', {path : '/'})
        console.log("Cookie reset");
        this.setState({verified : false});
        // let history = useHistory();
    }

    redirectTo() {
        console.log(this.state.verified);
        
        if(this.state.verified === false){
            return <Redirect to='/login'/>
        }
    }

    render() {
        const lgout = () => {
            
        }
        return(
            <div>
                <AppBarStyled/>
                <h1>Hello, {this.state.name}</h1>
                {this.redirectTo()}
                <button onClick={this.onLogout}>Logout</button>
            </div>
        )   
    }
}

export default Home;