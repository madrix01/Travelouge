import * as redis from 'redis';
import {promisify} from 'util';

const client = redis.createClient()
console.log("👉Redis connected");

const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

export {GET_ASYNC, SET_ASYNC}