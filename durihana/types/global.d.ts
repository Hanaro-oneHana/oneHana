// global.d.ts
import { Server } from 'socket.io';

declare global {
  // 전역 변수 io 를 socket.io Server 타입으로 선언
  var io: Server;
}

// 이 파일이 모듈로 인식되도록 export 문 남기기
export {};
