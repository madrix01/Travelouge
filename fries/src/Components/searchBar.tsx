import React from 'react';
import './styles/searchBar.css'
import Cookie from 'js-cookie';
import {Button} from '@material-ui/core'

interface Search  {
    searchBody : string
    username : string
}

class SearchBar extends React.Component<{}, Search> {

    constructor(props : any){
        super(props);

        this.state = {
            searchBody : "",
            username : ""
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event : React.FormEvent<HTMLInputElement>) {
        const target = event.currentTarget;
            const value : string = target.value;
            const name : string = target.name;
            this.setState({
            searchBody : value
            });
            return event;
    }


    async handleSubmit(e: any){
        // const resp = await fetch(`http://localhost:6969/test/search?q=${this.state.searchBody}`, {
        //     method : "GET",
        //     headers : {
        //         "authToken" : Cookie.get().authToken 
        //     }
        // })
        // const data = await resp.json();

        console.log('Here');
        // window.location.href =  `/u/${this.state.searchBody}`
        window.location.replace(`/u/${this.state.searchBody}`)
        e.preventDefault();
    }

    async componentDidMount(){

    }

    render(){
        return(
            <div className="searchMain">
                <form onSubmit={this.handleSubmit}>
                <input type="text" name="searchBody" 
                    className="searchInput"
                    placeholder="Search"
                    onChange={this.handleChange} 
                />
                </form>
            </div>
        )
    }
}

export default SearchBar;