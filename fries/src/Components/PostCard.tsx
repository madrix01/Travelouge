import React from 'react'
import {Card, ButtonBase} from '@material-ui/core'
import './styles/PostCard.css'
import {useHistory} from 'react-router-dom';


const PostCard = (props: any) => {
    const history = useHistory();

    const btnOnClick = () => {
        history.push(`/p/${props.username}/${props.postUrl}`, {
            id : props.postId
        })
    }
    return(
        <Card className="card-root" style={{backgroundColor: "#323d4d", borderRadius: "10px"}}>
            <ButtonBase onClick={btnOnClick}>
                <div className="card-root1">
                <img src={props.imageURL} alt=""/>
                <div className="card-title">
                    {props.title}
                </div>
                </div>
            </ButtonBase>
        </Card>
    )
}


export default PostCard