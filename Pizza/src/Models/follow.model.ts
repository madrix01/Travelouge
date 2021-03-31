import {User} from '@models/user.model';

export interface Follow{
    relationId : string,
    fsource : string,
    fdesti : string,
    time : number
}