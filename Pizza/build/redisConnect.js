"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEL_ASYNC = exports.SET_ASYNC = exports.GET_ASYNC = void 0;
const redis = require("redis");
const util_1 = require("util");
const client = redis.createClient({
    host: "redis",
});
console.log("🤖 Redis connected [http://localhost:6379]");
const GET_ASYNC = (0, util_1.promisify)(client.get).bind(client);
exports.GET_ASYNC = GET_ASYNC;
const SET_ASYNC = (0, util_1.promisify)(client.set).bind(client);
exports.SET_ASYNC = SET_ASYNC;
const DEL_ASYNC = (0, util_1.promisify)(client.del).bind(client);
exports.DEL_ASYNC = DEL_ASYNC;
