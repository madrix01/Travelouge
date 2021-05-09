"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redisConnect_1 = require("@src/redisConnect");
const CacheUpdate = async (cacheKey, data) => {
    await redisConnect_1.GET_ASYNC(cacheKey);
};
