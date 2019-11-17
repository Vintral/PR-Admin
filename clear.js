//==================================//
//	Requires						            //
//==================================//
const redis = require( 'redis' );
//const { promisify } = require('util');
//const getAsync = promisify( redis.get ).bind( client );
//const setAsync = promisify( redis.set ).bind( client );

//==================================//
//	Redis									          //
//==================================//
const redisInfo = {
 	server:"pocket-realm-redis.3u6ezl.ng.0001.usw1.cache.amazonaws.com",
	port:6379
}

const redisClient = redis.createClient( redisInfo.port, redisInfo.server );
redisClient.on( "ready", async () => {
  console.log( "REDIS READY" );

  redisClient.set( "NUM_USERS", 0, ( err, res ) => {
    console.log( err );
    console.log( res );

    redisClient.get( "NUM_USERS", ( err, res ) => {
      console.log( err );
      console.log( res );
    } );
  } );  

  //let res = await getAsync( "NUM_USERS" );
  //console.log( res );
} );