import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = (code) => {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  const base_url = process.env.NODE_ENV === 'production' ? 'https://spotnfind.com' : 'https://localhost:3001'

  useEffect(() => {
    (async () => {
      try {
        console.log("hook")

        const {
          data: { access_token, refresh_token, expires_in },
        } = await axios.post(`${base_url}/login`, {
          code,
        });
        console.log(access_token);

        console.log("^")

        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setExpiresIn(expires_in);
        localStorage.clear();
  
        localStorage.setItem("access_token", access_token)
        window.history.pushState({}, null, '/');
      } catch {
        window.location = '/';
      }
    })();
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(async () => {
      try {
        const {
          data: { access_token, expires_in },
        } = await axios.post(`${base_url}/refresh`, {
          refreshToken,
        });
        setAccessToken(access_token);
        setExpiresIn(expires_in);
      } catch {
        window.location = '/';
      }
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
};

export default useAuth;
