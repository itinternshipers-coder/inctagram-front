import { Socket, io } from 'socket.io-client'

const WS_URL = 'https://gateway.traineegramm.ru/messenger'

let socket: Socket | null = null
let refCount = 0

// Singleton socket с refcount. Поднимается при первом acquire (когда
// появляется первый подписчик на любой RTK Query запрос мессенджера) и
// закрывается, когда refcount обнуляется. Это позволяет шарить одно WS
// соединение между useGetChatsQuery, useGetMessagesQuery и sendMessage,
// при этом без утечек после анмаунта последнего экрана мессенджера.
//
// при обновлении токена через auth-mutex (см. base-api.ts)
// существующий сокет остаётся со старым токеном в auth-handshake. Уточнить
// у бэка: реджойн по cookie/refresh со стороны сервера, или клиент сам
// должен переподключаться при смене токена.
export function acquireMessengerSocket(token: string): Socket {
  if (!socket) {
    socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket'],
    })
  }
  refCount += 1
  return socket
}

export function releaseMessengerSocket(): void {
  refCount = Math.max(0, refCount - 1)
  if (refCount === 0 && socket) {
    socket.disconnect()
    socket = null
  }
}

export function peekMessengerSocket(): Socket | null {
  return socket
}
