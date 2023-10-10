import { Injectable } from '@nestjs/common';
const { MongoClient } = require('mongodb');



@Injectable()
export class AppService {
  postStatus(body: { idSender: string; idReceiver: string; msg: string; }) {
    console.log("New message sent by '"+ body.idSender+ "' for '"+ body.idReceiver+ "'")
    console.log("Message : ", body.msg);
    return "New message sent by '"+ body.idSender+ "' for '"+ body.idReceiver+ "'\nMessage : "+ body.msg;
  }
  getHello(): string {
    return 'Hello World!';
  }

  getDb(): string {
    // Replace the URI with your own MongoDB URI

    // Create a new MongoClient

    const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    async function run() {
      try {
        console.log("Connecting to MongoDB...");
        console.log("URI : ", process.env.MONGODB_URI);
        console.log("Database name : ", process.env.DATABASE_NAME);
        console.log("Collection name : ", process.env.COLLECTION_NAME);
        // Connect to the MongoDB server
        await client.connect();
    
        // Access the database
        //const database = client.db("bwtohbemviuyaixfsi7c");
        const database = client.db(process.env.DATABASE_NAME);
    
        // Access the collection
        const collection = database.collection(process.env.COLLECTION_NAME);
        //"651c1695c8838005550b365a"
        // Example query
        const result = await collection.find().toArray();
    
        console.log(result);
      } finally {
        // Close the connection when done
        await client.close();
      }
    }
    run().catch(console.error);
    return "";
  }
}