import React from 'react'
import {Card} from '@material-ui/core'
import './styles/PostCard.css'

const PostCard = (props: any) => {
    return(
        <div>
            <Card className="card-root" style={{backgroundColor: "#2c2c2c"}}>
                <img src={props.imageURL} alt=""/>
                <div className="card-title">
                    {props.title}
                </div>
                <div className="card-description">
                    {props.description}
                </div>
            </Card>
        </div>
    )
}


export default PostCard