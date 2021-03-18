export interface User{
    id : string;
    username : string;
    followers : number;
    followings : number;
    placesVisited : number;
    bio : string;
    timeCreate : number;
}

export interface NewUser extends User{
    email : string 
    password : string
}

export interface LoginUser{
    password : string,
    username : string
}

export interface TokenUser extends User{
    email : string
}