'use client';

import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000', {
  // socket.connect() 없이도 자동 연결되도록 설정
  autoConnect: true,
});
