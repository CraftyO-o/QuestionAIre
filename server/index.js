import { MongoClient } from "mongodb";
import { loadEnvFile } from "node:process";
import Groq from "groq-sdk";
import express from "express";
import pdf from 'pdf-parse/lib/pdf-parse.js';
import multer from "multer";
import cors from "cors";
import { chunkText, looksLikeRealText } from "./functions.js";


loadEnvFile("./.env");

const app = express();
app.use(cors());
app.use(express.json())

const Mongo_uri =  process.env.DATABASE_URL;

const upload = multer({
    storage : multer.memoryStorage(),
    limits : {fileSize: 20*1024*1024},
});

app.post("/upload", upload.single("file"), async (req, res)=>{
    try{
        if (!req.file) return res.status(400).json({error: "No file uploaded!"});

        const data =  await pdf(req.file.buffer);
        const chunks=  chunkText(data.text);

        if(!looksLikeRealText(data.text)){
            return res.status(422).json({
                error: "This PDF's text couldnt be read (scanned or custom encoded). Try another PDF."
            })
        }

        console.log(`Pages : ${data.numpages}, characters: ${data.text.length}, chunks: ${chunks.length}`);


        res.json({
            pages: data.numpages,
            characters: data.text.length,
            chunkCount: chunks.length,
            firstChunk: chunks[0],
            secondChunk: chunks[1],

        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "Failed to parse PDF."});
    }
});

const DB_client = new MongoClient(Mongo_uri);

await DB_client.connect();
console.log("Mongo Connected!");

app.listen(process.env.PORT || 5000, ()=>
    console.log("Server Running on port", process.env.PORT||5000));




