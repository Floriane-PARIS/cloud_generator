import { Body, Controller, Get, HttpCode, Headers, Post, Query, HttpException, HttpStatus, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Server')
@Controller('server')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get Hello Message' })
  @ApiResponse({ status: 200, description: 'Return a hello message.' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('message')
  @HttpCode(200)
  @ApiOperation({ summary: 'Receive Message' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '1' },
        conversation_id: { type: 'string', example: '123' },
        sender: { type: 'string', example: 'user1' },
        timestamp: { type: 'string', example: '2023-11-01T00:00:00Z' },
        text: { type: 'string', example: 'Hello' },
        image: { type: 'string', example: 'http://example.com/image.jpg' },
        read_by: { type: 'array', items: { type: 'string' }, example: ['user1', 'user2'] },
        smoke: { type: 'boolean', example: false },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Message received successfully.' })
  receiveMessage(@Body() body: { _id: string, conversation_id: string, sender: string, timestamp: string, text: string, image: string, read_by: string[], smoke: boolean }) {
    console.log("Conversation : " + body.conversation_id);
    return this.appService.receiveMessage(body);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get History' })
  @ApiResponse({ status: 200, description: 'Return the history.' })
  async getHistory(): Promise<any> {
    return await this.appService.getHistory();
  }

  @Get('conversation/:id/history')
  @ApiOperation({ summary: 'Get Conversation History' })
  @ApiResponse({ status: 200, description: 'Return the conversation history based on id.' })
  @ApiParam({ name: 'id', type: 'string'})
  async getConversationHistory(@Param('id') id: string): Promise<any> {
    return await this.appService.getConversationHistory(id);
  }

  @Get('conversation/:id')
  @ApiOperation({ summary: 'Get Conversation' })
  @ApiResponse({ status: 200, description: 'Return the conversation based on id.' })
  @ApiParam({ name: 'id', type: 'string'})
  async getConversation(@Param('id') id: string): Promise<any> {
    return await this.appService.getConversation(id);
  }

  @Get('users/:userId/stories/viewable')
  @ApiOperation({ summary: 'Get Stories viewable by a user' })
  @ApiResponse({ status: 200, description: 'Return the stories viewable by a user.' })
  async getStoriesByUserId(@Param('userId') userId: string): Promise<any> {
      try {
          return await this.appService.getStoriesViewableByUserId(userId);
      } catch (error) {
          throw new HttpException(`Failed to get stories: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }
  
}
