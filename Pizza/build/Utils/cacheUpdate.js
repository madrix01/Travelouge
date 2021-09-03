"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redisConnect_1 = require("@src/redisConnect");
const CacheUpdate = async (cacheKey, data) => {
    await (0, redisConnect_1.GET_ASYNC)(cacheKey);
};
