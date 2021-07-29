import { createContext, useState, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = createContext({
   token: '',
   isLogin: false,
   login: (token) => { },
   logout: () => { }
});

const calcRemainTime = (expirationTime) => {
   const currTime = new Date().getTime();
   const adjExpirationTime = new Date(expirationTime).getTime();

   const remainingTime = adjExpirationTime - currTime;
   return remainingTime;
}

const retrieveStoredToken = () => {
   const storedToken = localStorage.getItem('token');
   const storeExpirationDate = localStorage.getItem('expirationTime');

   const remainingTime = calcRemainTime(storeExpirationDate);

   if (remainingTime <= 60000) {
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime')
      return null;
   }

   return {
      token: storedToken,
      duration: remainingTime
   }
}

export const AuthContextProvider = (props) => {
   const tokenData = retrieveStoredToken();
   let initialToken;
   if (tokenData) {
      initialToken = tokenData.token
   }

   const [token, setToken] = useState(initialToken);

   const userIsLoggedIn = !!token;

   const logoutHandler = useCallback(() => {
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');

      if (logoutTimer) {
         clearTimeout(logoutTimer)
      }
   })

   const loginHandler = (token, expirationTime) => {
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('expirationTime', expirationTime);
      const timeLeft = calcRemainTime(expirationTime)

      logoutTimer = setTimeout(() => logoutHandler, timeLeft)
   }

   useEffect(() => {
      if (tokenData) {
         logoutTimer = setTimeout(logoutHandler, tokenData.duration);
      }
   }, [tokenData, logoutHandler])

   const contextValue = {
      token: token,
      isLogin: userIsLoggedIn,
      login: loginHandler,
      logout: logoutHandler
   }

   return <AuthContext.Provider value={contextValue}>
      {props.children}
   </AuthContext.Provider>
}

export default AuthContext;