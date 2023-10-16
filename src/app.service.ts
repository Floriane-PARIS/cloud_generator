import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
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

  async getDb(): Promise<any> {
    // Replace the URI with your own MongoDB URI
    const uri = "mongodb://uroccssvevcnzmiglusv:ptizczpirzvz3psji1m9r3psdr48vm@bhogfnwfnzjnxwhnchfs-mongodb.services.clever-cloud.com:2120/bhogfnwfnzjnxwhnchfs"

    // Create a new MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      // Connect to the MongoDB server
      await client.connect();
  
      // Access the database
      const database = client.db("bhogfnwfnzjnxwhnchfs");
  
      // Access the collection
      const collection = database.collection("conversation");
  
      // Get the document with id 652924bdc5faf4a0ad9e9ab0
      const id = "652924bdc5faf4a0ad9e9ab0";
  
      // convert id from string to ObjectId
      const query = { _id: new ObjectId(id) };
  
      const result = await collection.findOne(query);
  
      // Log and return messages array
      console.log(result.messages);
      return result.messages;
  
    } catch (err) {
      console.log(err);
      return { error: err };
    } finally {
      // Close the connection when done
      await client.close();
    }
    
  }
}

