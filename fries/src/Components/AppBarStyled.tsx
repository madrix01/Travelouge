import React from "react";
import { AppBar, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    height: "10vh",
    background: "black",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    width: "100%",
    textAlign: "left",
    fontSize : "30px",
    marginLeft : "5px"
  },
  links : {
    textAlign : "right",
    marginRight: "20px",
    display: "flex"
  },
  link : {
    marginLeft: "5px",
    marginRight : "5px"
  }
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

  return (
    <div style={{ paddingBottom: "10vh" }}>
      <AppBar className={classes.root}>
        <div className={classes.title}>
          Travelouge
        </div>
        <div className={classes.links}>
          <RouteLink toLink='/home' name='Home'/>
          <RouteLink toLink='/home' name='Home'/>
        </div>
      </AppBar>
    </div>
  );
};

export default AppBarStyled;
