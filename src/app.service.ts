import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Console } from 'console';
import { ObjectId } from 'mongodb';
const { MongoClient } = require('mongodb');
import { EventsGateway } from './events.gateway';



@Injectable()
export class AppService {
  constructor(private configService: ConfigService, private gateway: EventsGateway) {}

  receiveMessage(body: {conversation_id : string, sender: string, timestamp : string, text: string, image: string}) {
    console.log("Conversation : " + body.conversation_id);
    console.log("New message sent by : "+ body.sender);
    console.log("Message : ", body.text);
    console.log("Image : ", body.image);
    // Here need to send by socket.io to the other user ?
    this.gateway.sendToAll(JSON.stringify(body));
    return "New message sent by " + body.sender + "\nMessage : " + body.text;
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