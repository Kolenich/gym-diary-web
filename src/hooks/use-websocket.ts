import { useLayoutEffect, useRef } from 'react';

export const useWebsocket = (url: string, onMessage?: (data: MessageEvent) => void): WebSocket | null => {
  const websocket = useRef<WebSocket | null>(null);

  useLayoutEffect(() => {
    websocket.current = new WebSocket(`wss/${url}`);

    const hasOnMessageHandler = !!onMessage;

    if (hasOnMessageHandler) {
      websocket.current.addEventListener('message', onMessage);
    }

    return (): void => {
      websocket.current?.close();
    };
  }, [url]);

  return websocket.current;
};
