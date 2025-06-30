import { createServer } from 'node:http';
import { Server } from 'socket.io';
import next from 'next';

const nextApp = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    // 사용자 고유 방 참가
    socket.on('join-user-room', (userId) => {
      const userRoom = `user-${userId}`;
      socket.join(userRoom);
      console.log(`User ${userId} joined room: ${userRoom}`);
    });

    socket.on('admin-balance-update', ({ uids, payload }) => {
    for (const uid of uids) {
      io.to(`user-${uid}`).emit('balance-updated', payload);
    }
  });

    // 소켓 연결 종료
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(3000);
  console.log('Socket Server listening on port 3000');
});
