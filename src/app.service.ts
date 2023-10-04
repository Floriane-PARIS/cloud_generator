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
    const uri = "mongodb://uzqce0sg9aevrorkmrrv:gVbmOxI9Z2OAnXiSf1E@bwtohbemviuyaixfsi7c-mongodb.services.clever-cloud.com:2388/bwtohbemviuyaixfsi7c"

    // Create a new MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    async function run() {
      try {
        // Connect to the MongoDB server
        await client.connect();
    
        // Access the database
        const database = client.db("bwtohbemviuyaixfsi7c");
    
        // Access the collection
        const collection = database.collection("messaging");
        //"651c1695c8838005550b365a"
        // Example query
        const result = await collection.findOne({});
    
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

