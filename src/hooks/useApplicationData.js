import {useEffect, useReducer} from "react";
import axios from "axios";
import { getDayIndexByAppointment } from "helpers/selectors";

const useApplicationData = () => {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const [state, dispatch] = useReducer(reducer, {days: [], day: "Monday", appointments: {}, interviewers: {}});

  function reducer(state, action) {
    switch(action.type) {
      case SET_DAY:
        return {...state, day: action.day};
      case SET_APPLICATION_DATA:
        console.log('ACTION----', action);
        console.log('appointments? ', action.appointments)
        state = {...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers};
        console.log('STATE ---', state);
        return state;
      case SET_INTERVIEW:
        return {...state, days: action.days, appointments: action.appointments}
      default:
        throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
      }
    }
    



  const setDay = day =>  dispatch({type: SET_DAY, day})

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
          interviewers: all[2].data });
      // setState(prev => ({
      //   ...prev,
      //   days: all[0].data,
      //   appointments: all[1].data,
      //   interviewers: all[2].data
      // }));

    })
  }, []);
  



  const manageInterview = (id, interview = null) => {
    const appointment = {...state.appointments[id], interview: interview ? {...interview} : null}
    const appointments = {...state.appointments, [id]: appointment}
    const dayIndex = getDayIndexByAppointment(state, id);
    const days = [...state.days];
    days[dayIndex].spots += interview ? -1 : 1;

    const request = interview ? axios.put : axios.delete;
    return request(`/api/appointments/${id}`, appointment)
      .then(() => {
        dispatch({type: SET_INTERVIEW, appointments, days})
      }
      
      // setState(prev => {
      //   return {
      //     ...prev,
      //     appointments,
      //     days
      //   }
      // })
    )
  };




return {state, setDay, manageInterview};
};

export default useApplicationData;