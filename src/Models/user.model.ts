interface User{
    username : string;
}

export interface NewUser extends User{
    email : string 
    password : string
}

export interface LoginUser extends User{
    password : string
}

export interface TokenUser extends User{
    email : string
}

