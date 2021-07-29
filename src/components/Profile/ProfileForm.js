import classes from './ProfileForm.module.css';
import { useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router';

// https://identitytoolkit.googleapis.com/v1/accounts:update?key=[API_KEY]
const ProfileForm = () => {
  const history = useHistory();
  const newPasswordInput = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = event => {
    event.preventDefault();

    const enterdNewPasword = newPasswordInput.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAekjVoWcT1GFtwV_xl84GeY8OXPbLOKbw', {
      method: "POST",
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enterdNewPasword,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (!res.ok) {
        alert('error submitting data!')
      }
      history.replace('/')
    })
  }
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
