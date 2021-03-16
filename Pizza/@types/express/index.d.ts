import {TokenUser} from '../../src/Models/user.model'

declare global {
    namespace Express{
        interface Request {
            user : TokenUser
        }
    }
}