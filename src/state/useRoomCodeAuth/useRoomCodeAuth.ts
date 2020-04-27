import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export function fetchToken(room: string, code: string) {
  const endpoint = process.env.REACT_APP_TOKEN_ENDPOINT || '/token';
  const params = new window.URLSearchParams({ room, code });

  return fetch(`${endpoint}?${params}`);
}

export default function useRoomCodeAuth() {
  const history = useHistory();

  const [user, setUser] = useState<{ displayName: undefined; photoURL: undefined; passcode: string } | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const getToken = useCallback(
    (room: string, code: string) => {
      return fetchToken(room, code)
        .then(async res => {
          if (res.ok) {
            return res;
          }
          const json = await res.json();
          throw Error();
        })
        .then(res => res.json())
        .then(res => res.token as string);
    },
    [user]
  );

  return { isAuthReady, getToken };
}
