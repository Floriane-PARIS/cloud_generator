import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSub, Message } from '@google-cloud/pubsub';
import { ConfigService } from '@nestjs/config';
import { Console } from 'console';
import { ObjectId } from 'mongodb';
const { MongoClient } = require('mongodb');
import { EventsGateway } from './events.gateway';



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
    // Here need to send by socket.io to the other user ?
    this.gateway.sendToAll(JSON.stringify(body));

    //this.gateway.sendToConversation(body.conversation_id, JSON.stringify(body));
    
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
}