import {useEffect, useReducer, useRef} from "react";
import axios from "axios";
import { getDayIndexByAppointment } from "helpers/selectors";
import reducer, {SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW} from "reducers/application";

const useApplicationData = () => {
  //State
  const [state, dispatch] = useReducer(reducer, {days: [], day: "Monday", appointments: {}, interviewers: {}});
  const currentState = useRef();
  currentState.current = state;

  //Helper Functions
  const setDay = day =>  dispatch({type: SET_DAY, day});
  const calculateSpots = (appointments, id) => {
    const dayIndex = getDayIndexByAppointment(state, id);
    const days = [...state.days];
    const spotReducer = (acc, id) => appointments[id].interview ? acc : acc + 1;
    days[dayIndex].spots = days[dayIndex].appointments.reduce(spotReducer, 0);
    return days;
  }

  //Establishes initial state with data from API
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
        dispatch({
          type: SET_APPLICATION_DATA,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data 
        });
    });
  }, []);


  //listens for incoming messages on a WebSocket connection to indicate another client has booked an appointment, and updates the view
  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    webSocket.onmessage = (event) => {
      const newAppointment = JSON.parse(event.data);
      if(newAppointment.type === "SET_INTERVIEW") {
        const appointment = {...currentState.current.appointments[newAppointment.id], interview: newAppointment.interview};
        const appointments = {...currentState.current.appointments, [newAppointment.id]: appointment}
        const dayIndex = getDayIndexByAppointment(currentState.current, newAppointment.id);
        const days = [...currentState.current.days];
        const spotReducer = (acc, id) =>  appointments[id].interview ? acc : acc + 1;
        days[dayIndex].spots = days[dayIndex].appointments.reduce(spotReducer, 0)
        dispatch({type: SET_INTERVIEW, appointments, days});
      }
    }

    return function () { webSocket.close() };
  }, [])
  
  // Called whenever a user adds, deletes or edits an appointment
  const manageInterview = (id, interview = null) => {
    const appointment = {...state.appointments[id], interview: interview ? {...interview} : null}
    const appointments = {...state.appointments, [id]: appointment}
    const days = calculateSpots(appointments, id);

    const request = interview ? axios.put : axios.delete;
    return request(`/api/appointments/${id}`, appointment)
      .then(() => {
        dispatch({type: SET_INTERVIEW, appointments, days});
      }
    )
  };

return {state, setDay, manageInterview};
};

export default useApplicationData;