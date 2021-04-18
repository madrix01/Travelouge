import {SET_ASYNC, GET_ASYNC} from '@src/redisConnect';



const CacheUpdate = async (cacheKey, data) => {
    await GET_ASYNC(cacheKey);
    
}