import React, { useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const emailReducer = (state, action) => {
  console.log("action.val = ", action.val);
  console.log("state.isValid = ", state.isValid);

  if (action.type === "USER_INPUT") {
    return {
      value: action.val,
      isValid: action.val.includes("@"),
    };
  }
  if (action.type === "INPUT_BLUR") {
    // here keep the last state for entered email which can be get from state, state has the latest input
    // isValid can be checked by state.value.includes("@")
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  // before use useReducer(), use useState to manage state
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();

  //before use useReducer(),
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();

  const [formIsValid, setFormIsValid] = useState(false);
  console.log("formIsValid = ", formIsValid);

  // Now use useReducer() to manage state, put enteredEmail and emailIsValid two states into on useReducer() for management
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: false,
  });

  const [passwordState, dispacthPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: false,
  });

  useEffect(() => {
    console.log("EFFECT RUNNING");

    return () => {
      console.log("EFFECT CLEANUP");
    };
  }, []);

  // alias assignment to give the key of an object another name, because here the two ojbects have the same key: isValid.
  //so below line 74 and 81 can use the new name directly (first use object destructuring of course).
  //before this modification, every time typing for email or password, useEffect will be executed once eventhough it is not need to execute yet.
  // now, only when the validity is changed, the useEffect will execute.
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("Checking form validity!");
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      console.log("CLEANUP");
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    // setEnteredEmail(emailState.value); //before use useReducer(), update state via set...
    dispatchEmail({ type: "USER_INPUT", val: event.target.value }); //when use useReducer(), update state via despatch

    // setFormIsValid(emailState.isValid && enteredPassword.trim().length > 6);
    //NOTE: here use event.target.value.includes("@") NOT emailState.isValid!!!!!!!, the later one not update the email isValid status correctly!!!
    // setFormIsValid(event.target.value.includes("@") && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispacthPassword({ type: "USER_INPUT", val: event.target.value });

    //note here should not use passwordState.isValid BUT use event.target.value.trim().length > 6)
    // setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.isValid);   // before use useReducer(), use set... to update state

    // when use useReducer, use dispacth to update state
    // here only type is enough, but it still need to be an object, becaue action data structure should be consistent, line 55 use object already.
    // don't need to put a value here, because we only care that when input lost focus. INPUT_BLUR means when focus is blured, which can be named sth
    //else, eg. LOOSE_FOCUS etc.
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);

    dispacthPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
