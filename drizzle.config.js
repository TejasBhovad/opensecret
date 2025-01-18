export default {
    dialect: 'postgresql', // database dialect ie. postgresql
    schema: './utils/db/schema.js',
    out: './drizzle',
  
  // here dbCredentials is an object that contains url and connectionString of the database ie DATABASE_URL where the database is hosted
    dbCredentials: {
        url: process.env.DATABASE_URL,
        connectionsString: process.env.DATABASE_URL, //connection string of the database which is hosted on the url
    }
  }