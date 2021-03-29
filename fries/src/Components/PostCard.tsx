import React from 'react'
import {Card} from '@material-ui/core'
import './styles/PostCard.css'

const PostCard = (props: any) => {
    return(
        <div>
            <Card className="card-root" style={{backgroundColor: "#2c2c2c"}}>
                <img src="https://d94fgasd2olqz.cloudfront.net/eab0bc78-9ee9-45e8-a8fa-090c0f5bcf8f.png" alt=""/>
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