import { useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const history = useHistory();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = event => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    if (!enteredEmail.includes('@') || enteredPassword.trim.length < 3)

      let url;
    setIsLoading(true)
    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAekjVoWcT1GFtwV_xl84GeY8OXPbLOKbw'
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyAekjVoWcT1GFtwV_xl84GeY8OXPbLOKbw'
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'COntent-Type': 'application/json'
      },
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      })
    }).then(res => {
      setIsLoading(false);
      if (res.ok) {
        return res.json()
      } else {
        return res.json().then(data => {
          let errorMessage = 'Authentication failed!'

          if (data && data.error && data.error.message) {
            errorMessage = data.error.message
          }
          alert(errorMessage)
          throw new Error(errorMessage)
        })
      }
    })
      .then(data => {
        const expirationTime = new Date((new Date().getTime() + (+data.expiresIn * 1000)))
        authCtx.login(data.idToken, expirationTime.toISOString());
        history.replace('/');
        console.log(data);
      })
      .catch(err => alert(err.message))
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
