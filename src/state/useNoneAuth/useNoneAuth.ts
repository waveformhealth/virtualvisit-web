import { useCallback, useState } from 'react';

export function fetchToken(room: string) {
  const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';
  const params = new window.URLSearchParams({ room });

  return fetch(`${endpoint}?${params}`);
}

export default function useRoomCodeAuth() {
  const [isAuthReady] = useState(false);

  const getToken = useCallback((name: string, room: string) => {
    return fetchToken(room)
      .then(async res => {
        if (res.ok) {
          return res;
        }
        const json = await res.json();
        throw Error();
      })
      .then(res => res.json())
      .then(res => res.token as string);
  }, []);

  return { isAuthReady, getToken };
}
