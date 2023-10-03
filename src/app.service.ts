import { Injectable } from '@nestjs/common';

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
}

