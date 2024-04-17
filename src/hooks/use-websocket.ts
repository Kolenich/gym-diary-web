import { useLayoutEffect, useRef } from 'react';

export const useWebsocket = (url: string, onMessage: (data: MessageEvent) => void): WebSocket | undefined => {
  const websocket = useRef<WebSocket>();

  useLayoutEffect(() => {
    websocket.current = new WebSocket(`ws-workout/${url}`);
    websocket.current?.addEventListener('message', onMessage);

    return (): void => {
      websocket.current?.close();
    };
  }, [url]);

  return websocket.current;
};
