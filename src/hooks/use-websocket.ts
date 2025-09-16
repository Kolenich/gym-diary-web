import { useUnmountEffect } from 'hooks/use-unmount-effect';

export const useWebsocket = (url: string, onMessage?: (data: MessageEvent) => void): WebSocket => {
  const websocket = new WebSocket(`wss/${url}`);

  if (onMessage) {
    websocket.addEventListener('message', onMessage);
  }

  useUnmountEffect(websocket.close);

  return websocket;
};
