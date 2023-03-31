import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { OnModuleInit } from '@nestjs/common'

// @WebSocketGateway({ cors: { origin: 'http://localhost:3001' } })
// TODO probably specify which port
@WebSocketGateway({ cors: true })
export class SocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Connected', socket.id)
      socket.on('disconnect', () => {
        console.log('Disconnected', socket.id)
      })
    })
  }

  // TODO I probably do not need this
  @SubscribeMessage('newTicket')
  // TODO change unknown
  onNewTicket(@MessageBody() body: unknown) {
    console.log(body)
    this.server.emit('onQueueUpdate', {
      msg: 'new message',
      content: body
    })
  }
}
