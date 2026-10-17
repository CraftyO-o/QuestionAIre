import {MongoClient, ServerApiVersion} from 'mongodb';
import {loadEnvFile} from "node:process";

loadEnvFile('./.env');
const uri  = process.env.DATABASE_URL;

const client  = new MongoClient(uri);

async function run(){
    try{
        await client.connect();
        await client.db("admin").command({ping:1});
        console.log("Pinged your deployment.");
    }
    catch(error){
        console.log("Error lil bro");
    }
    finally{
        await client.close();
    }
}

run();