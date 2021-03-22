import {User} from '@models/user.model';

export interface Follow{
    relationId : string,
    following : string,
    follower : string,
    time : number
}