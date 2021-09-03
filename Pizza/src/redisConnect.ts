import * as redis from 'redis';
import {promisify} from 'util';

const client = process.env.PRODUCTION === 'true' ? redis.createClient({
    host: process.env.REDIS_HOST,
    password : process.env.REDIS_PASSWORD,
    port : parseInt(process.env.PORT),
}) : redis.createClient();

console.log((process.env.PRODUCTION === 'true' ? "Redis connected [Production]" : "Redis connected [http://localhost:6379]"));

const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);
const DEL_ASYNC = promisify(client.del).bind(client);

export {GET_ASYNC, SET_ASYNC, DEL_ASYNC}