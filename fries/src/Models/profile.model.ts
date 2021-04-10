interface PostProps {
    title : string
    description : string
    imageURL : string    
}


export interface ProfileModel {
    userExsist : boolean
    email: string
    timeCreate : number
    followings: number
    username: string
    id: string
    bio: string,
    placesVisited: number
    followers: number,
    profilePhotoUrl : string
    posts : PostProps[]
    isSameAsUser : boolean
}

export interface NewUser{
    email : string,
    username : string,
    bio : string,
    password : string,
    profilePhoto : any
}