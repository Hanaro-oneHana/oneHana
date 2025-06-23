import { createServer } from 'node:http';
import { Server } from 'socket.io';
import next from 'next';

const nextApp = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const httpServer = createServer(handle);

  const io = new Server(httpServer, {
    cors: {
      origin:
        process.env.NODE_ENV === 'production'
          ? false // 배포하면 false를 url로 바꿔주면 됨
          : ['http://localhost:3000'],
      methods: ['GET', 'POST'],
    },
  });

  // Socket.IO 인스턴스를 전역으로 저장. 다른 server-action들을 사용하려면 필요
  (globalThis as any).io = io;

  io.on('connection', (socket) => {
    // 사용자 고유 방 참가
    socket.on('join-user-room', (userId) => {
      const userRoom = `user-${userId}`;
      socket.join(userRoom);
      console.log(`User ${userId} joined room: ${userRoom}`);
    });

    // 소켓 연결 종료
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(3000, () => {
    console.log('Socket Server listening on http://localhost:3000');
  });
});
