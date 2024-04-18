import { useLayoutEffect, useRef } from 'react';

export const useWebsocket = (url: string, onMessage?: (data: MessageEvent) => void): WebSocket | undefined => {
  const websocket = useRef<WebSocket>();

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
