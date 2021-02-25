import React, { useReducer } from 'react';
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";
import reducer, {SET_NAME, SET_ERROR, SET_INTERVIEWER} from "reducers/form";


export default function Form(props) {
  const [state, dispatch] = useReducer(reducer, {
    name: props.name || "",
    interviewer: props.interviewer || null,
    error: ""
  });


  const reset = () => {
    dispatch({type: SET_NAME, name: ""});
    dispatch({type: SET_INTERVIEWER, interviewer: null});
  };

  const cancel = () => {
    reset();
    props.onCancel();
  };

  const validate = () => {
    if (state.name === "") {
      dispatch({type: SET_ERROR, error: "Student name cannot be blank"});
      return;
    }

    dispatch({type: SET_ERROR, error: ""});
    props.onSave(state.name, state.interviewer);
  };

  return (

    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input 
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            data-testid="student-name-input"
            value={state.name}
            onChange={event => dispatch(
              {
                type: SET_NAME,
                name: event.target.value
              })}
          />
          {state.error && <section className="appointment__validation">{state.error}</section>}
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          value={state.interviewer}
          onChange={dispatch}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={validate}>Save</Button>
        </section>
      </section>
    </main>
  );
};