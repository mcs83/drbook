import React from 'react';
import UseToken from './use-token';

export function TokenProvider({ children }) {//function prop children enables to pass data of the father (use-token.js) to app.js
  const { token, removeToken, setToken } = UseToken();

  // passes the token information and function to app.js
  return (
    <div>
      {children(token, removeToken, setToken)}
   
    </div>
  );
}