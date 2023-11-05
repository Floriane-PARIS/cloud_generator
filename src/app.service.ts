import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSub, Message } from '@google-cloud/pubsub';
import { ConfigService } from '@nestjs/config';
import { Console } from 'console';
import { ObjectId } from 'mongodb';
const { MongoClient } = require('mongodb');
import { EventsGateway } from './events.gateway';
import { ObjectIdLike } from 'bson';



@Injectable()
export class AppService {
  constructor(private configService: ConfigService, private gateway: EventsGateway) {}

  private pubSubClient: PubSub;

  onModuleInit() {
    this.pubSubClient = this.createPubSubClient();
    const subscriptionNameOrId =  this.configService.get<string>('google_subscription_id');
    this.listenForMessages(subscriptionNameOrId);
  }

  createPubSubClient() {
    // Récupérer le contenu JSON des crédentiels à partir de la variable d'environnement
    const credentialsJson = this.configService.get<string>('google_application_credentials_content');
    
    // Parser le contenu JSON des crédentiels
    const credentials = JSON.parse(credentialsJson);

    // Créer une instance du client Pub/Sub en passant les crédentiels en tant que paramètres
    const pubSubClient = new PubSub({
      projectId: credentials.project_id,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    });

    return pubSubClient;
  }

  listenForMessages(subscriptionNameOrId: string) {
    const subscription = this.pubSubClient.subscription(subscriptionNameOrId);

    const isJsonString = (str: string) => {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
    };

    const messageHandler = (message: Message) => {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data.toString()}`);
      console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);
      message.ack();

      const messageData = message.data.toString();
      if (isJsonString(messageData)) {
          // Vous pouvez appeler votre méthode receiveMessage ici
          this.receiveMessage(JSON.parse(messageData));
      } else {
          console.warn('Received a non-JSON message:', messageData);
          // Vous pouvez choisir d'ignorer le message ou de le gérer autrement ici...
      }
    };

    subscription.on('message', messageHandler);

    subscription.on('error', error => {
      console.error(`Received error: ${error.message}`);
      this.reconnect(subscriptionNameOrId);
    });
  }

  reconnect(subscriptionNameOrId: string) {
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.listenForMessages(subscriptionNameOrId);
    }, 5000);
  }

  receiveMessage(body: {_id : string, conversation_id : string, sender: string, timestamp : string, text: string, image: string, read_by : string[], smoke : boolean}) {
    console.log("Conversation : " + body.conversation_id);
    console.log("New message sent by : "+ body.sender);
    console.log("Message : ", body.text);
    console.log("Image : ", body.image);

    //this.gateway.sendToAll(JSON.stringify(body));

    this.gateway.sendToConversation(body.conversation_id, JSON.stringify(body));
    
    return "New message sent by " + body.sender + "\nMessage : " + body.text;
  }
  getHello(): string {
    return 'Hello World!';
  }

  async getHistory(): Promise<any> {
    // Get config values
    const uri = this.configService.get<string>('mongodb_uri');
    const dbName = this.configService.get<string>('database_name');
    const collectionName = this.configService.get<string>('collection_conversation');


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
      const id = "653fa5b2991fd05dc55ef7d0";
  
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

  async getConversationHistory(id: string): Promise<any> {
    // Get config values
    const uri = this.configService.get<string>('mongodb_uri');
    const dbName = this.configService.get<string>('database_name');
    const collectionConversation = this.configService.get<string>('collection_conversation');

    // Create a new MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      // Connect to the MongoDB server
      await client.connect();
  
      // Access the database
      const database = client.db(dbName);
  
      // Access the collection
      const collection = database.collection(collectionConversation);
  
      // Convert id from string to ObjectId
      const query = { _id: new ObjectId(id) };
  
      // Find the conversation by id
      const result = await collection.findOne(query);
  
      // Check if the conversation was found
      if (result) {
        // Log and return messages array
        console.log(result.messages);
        return result.messages;
      } else {
        // If not found, return a suitable error message
        return { error: 'Conversation not found' };
      }
  
    } catch (err) {
      console.log(err);
      return { error: err };
    } finally {
      // Close the connection when done
      await client.close();
    }
  }

  async getConversation(id: string): Promise<any> {
    // Get config values
    const uri = this.configService.get<string>('mongodb_uri');
    const dbName = this.configService.get<string>('database_name');
    const collectionConversation = this.configService.get<string>('collection_conversation');

    // Create a new MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      // Connect to the MongoDB server
      await client.connect();
  
      // Access the database
      const database = client.db(dbName);
  
      // Access the collection
      const collection = database.collection(collectionConversation);
  
      // Convert id from string to ObjectId
      const query = { _id: new ObjectId(id) };
  
      // Find the conversation by id
      const result = await collection.findOne(query);
  
      // Check if the conversation was found
      if (result) {
        // Log and return messages array
        console.log(result);
        return result;
      } else {
        // If not found, return a suitable error message
        return { error: 'Conversation not found' };
      }
  
    } catch (err) {
      console.log(err);
      return { error: err };
    } finally {
      // Close the connection when done
      await client.close();
    }
  }

  async getStoriesViewableByUserId(userId: string): Promise<any> {
    // Get config values
    const uri = this.configService.get<string>('mongodb_uri');
    const dbName = this.configService.get<string>('database_name');
    const collectionStory_str = this.configService.get<string>('collection_story');
    const collectionUser_str = this.configService.get<string>('collection_user');

    // Create a new MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      await client.connect();

      const database = client.db(dbName);

      const collectionUser = database.collection(collectionUser_str);
      const collectionStory = database.collection(collectionStory_str);

      const user = await collectionUser.findOne({ user_id: userId });
      if (!user) {
          return { error: 'User not found' };
      }

      // Obtenez les identifiants des histoires consultables
      const viewableStoriesIds = user.viewable_stories.map((id: string | number | ObjectId | ObjectIdLike | Uint8Array) => new ObjectId(id));

      const d = new Date();
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
      const currentUtcTime = new Date(utc + (3600000 * +'+0'));

      console.log('currentUtcTime', currentUtcTime);

      const stories = await collectionStory.find(
        { _id: { $in: viewableStoriesIds } },
        { projection: { _id: 0, user_id: 1, image_url: 1, timestamp: 1, duration: 1 } }  // Incluez timestamp et duration dans la projection
      ).toArray();

      // Filtrer les histoires expirées
      const nonExpiredStories = stories.filter(story => {
        const storyTime = new Date(story.timestamp);
        const expirationTime = new Date(storyTime.getTime() + story.duration * 60000);
        return expirationTime > currentUtcTime;
      });

      // Supprimer les champs timestamp et duration de chaque histoire
      const finalStories = nonExpiredStories.map(story => ({
        user_id: story.user_id,
        image_url: story.image_url
      }));

      return finalStories;

    } catch (err) {
        console.log(err);
        return { error: 'Failed to get stories' };
    } finally {
        // Fermez la connexion quand c'est fini
        await client.close();
    }
  }
}