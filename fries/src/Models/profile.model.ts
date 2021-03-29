interface PostProps {
    title : string
    description : string
    imageUrl : string    
}


export interface ProfileModel {
    email: string
    timeCreate : number
    followings: number
    username: string
    id: string
    bio: string,
    placesVisited: number
    followers: number,
    profilePhotoUrl : string,
    posts : PostProps[]
}

export interface NewUser{
    email : string,
    username : string,
    bio : string,
    password : string,
    profilePhoto : any
}