import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { OnModuleInit } from '@nestjs/common'

// @WebSocketGateway({ cors: { origin: '' } })
@WebSocketGateway()
export class SocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Connected', socket.id)
    })
  }
}
