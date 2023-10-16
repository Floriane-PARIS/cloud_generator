import { Body, Controller, Get, HttpCode, HttpException, Headers, HttpStatus, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('server')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('message')
  @HttpCode(200)
  receiveMessage(@Body() body: {_id : string, conversation_id : string, sender: string, timestamp : string, text: string, image: string, read_by : string[], smoke : boolean}) {
    console.log("Conversation : " + body.conversation_id);
    return this.appService.receiveMessage(body);
  }

  @Get('history')
  async getDb(): Promise<any> {
    return await this.appService.getDb();
  }
  
}
