import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
const { MongoClient } = require('mongodb');



@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  postStatus(body: { idSender: string; idReceiver: string; msg: string; }) {
    console.log("New message sent by '"+ body.idSender+ "' for '"+ body.idReceiver+ "'")
    console.log("Message : ", body.msg);
    return "New message sent by '"+ body.idSender+ "' for '"+ body.idReceiver+ "'\nMessage : "+ body.msg;
  }
  getHello(): string {
    return 'Hello World!';
  }

  async getDb(): Promise<any> {
    // Get config values
    const uri = this.configService.get<string>('mongodb_uri');
    const dbName = this.configService.get<string>('database_name');
    const collectionName = this.configService.get<string>('collection_name');


    // Create a new MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      // Connect to the MongoDB server
      await client.connect();
  
      // Access the database
      const database = client.db(dbName);
  
      // Access the collection
      const collection = database.collection(collectionName);
  
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