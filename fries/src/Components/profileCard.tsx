import { ButtonBase, Card, makeStyles } from '@material-ui/core';
import React from 'react';

const stlyes = makeStyles({
    root : {
        height : "200px",
        width : "100%",
        background : "#151a21",
    },
    main : {
        height: "50%",
        display : "flex",
        alignItems : "center",
        justifyContent : "space-between",
        padding : "10px 10px 0px 10px"
    },
    mainImg : {
        height : "90px",
        borderRadius : "100%"
    },
    username : {
        fontSize : "30px",
        color : "white"
    },
    subMain : {
        height: "20%",
        display : "flex",
        padding : "0px 10px 0px 10px",
        justifyContent: "space-between",
        fontSize : "20px",
        color: "grey"
    },
    bio: {
        fontSize : "20px",
        color : "#F0F0F0"
    }
})

const ProfileCard = (props : any) => {

    const classes = stlyes();
    // console.log(props.imgSrc);

    const showProfile = () => {
        window.location.href = `/u/${props.username}`
    }
    return(
        <div>
            <Card className={classes.root} style={{backgroundColor: "#151a21", borderRadius: "10px"}}>
                <ButtonBase onClick={showProfile} style={{width:"100%"}}>
                <div style={{height : "200px", width: "100%"}}>
                <div className={classes.main}>
                    <img src={props.imgSrc} alt="profile photo" className={classes.mainImg}/>
                    <div className={classes.username}>{props.username}</div>
                </div>
                <div className={classes.subMain}>
                    <div>Followers : {props.followers}</div>
                    <div>Followings : {props.followings}</div>
                </div>
                <div className={classes.bio}>
                    {props.bio}
                </div>
                </div>
                </ButtonBase>
            </Card>
        </div>
    )
}

export default ProfileCard