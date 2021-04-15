import React, { useState } from "react";
import { AppBar, makeStyles } from "@material-ui/core";
import Cookies from 'js-cookie';
import SearchBar from './searchBar'


const useStyles = makeStyles({
  root: {
    height: "10vh",
    background: "#0b0e11",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    width: "100%",
    textAlign: "left",
    fontSize : "30px",
    marginLeft : "10px"
  },
  links : {
    textAlign : "right",
    marginRight: "20px",
    display: "flex",
    justifyContent : "space-between",
    alignItems : "center"
  },
  link : {
    marginLeft: "5px",
    marginRight : "5px"
  },
});

const AppBarStyled = () => {
  const classes = useStyles();

  interface LinkProp {
    toLink : string,
    name : string,
  }

  const RouteLink = (prop : LinkProp) => {
    return (
      <div className={classes.link}>
        <a style={{textDecoration: "none", color: 'white'}} href={prop.toLink}>{prop.name}</a>
      </div>
    )
  }
  const RouteVerify = () => {
    
    if(Cookies.get().verified === '1'){
      return(
        <div className={classes.links}>
            <SearchBar />
            <RouteLink toLink='/home' name='Home'/>
            <RouteLink toLink={`/u/${Cookies.get().username}`} name='Profile'/>
            <RouteLink toLink="/post/add" name="Post" />
        </div>
      )
    }else{
      return(
        <div className={classes.links}>
          <RouteLink toLink='/login' name='Login'/>
          <RouteLink toLink='/register' name='Register'/>
        </div>
      )
    }
  }

  return (
    <div style={{ paddingBottom: "10vh" }}>
      <AppBar className={classes.root} elevation={0} >
        <div className={classes.title}>
          Travelouge
        </div>
        {RouteVerify()}
      </AppBar>
    </div>
  );
};

export default AppBarStyled;
