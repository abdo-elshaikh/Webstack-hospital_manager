import { createClient } from 'redis';

const redisClient = createClient();
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.connect();

module.exports = redisClient;