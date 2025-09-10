import redisClient from "../lib/redisClient"

export const clearProductCache = async ()=>{
    const keys = await redisClient.sMembers("product:cacheKeys");
    if(keys.length > 0){
        await redisClient.del(keys); //delete all cached keys
        await redisClient.del("product:cacheKeys"); //reset the set
    }
}