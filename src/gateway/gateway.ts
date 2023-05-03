import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { OnModuleInit } from '@nestjs/common'

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server

  constructor() {
    this.server = new Server({
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true
      }
    })
  }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Connected', socket.id)
      socket.on('disconnect', () => {
        console.log('Disconnected', socket.id)
      })
    })
  }

  @SubscribeMessage('newTicket')
  onNewTicket(@MessageBody() body: unknown) {
    console.log(body)
    this.server.emit('onQueueUpdate', {
      msg: 'new message',
      content: body
    })
  }
}
