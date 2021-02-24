import {useEffect, useReducer} from "react";
import axios from "axios";
import { getDayIndexByAppointment } from "helpers/selectors";
import reducer, {SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW} from "reducers/application";

const useApplicationData = () => {

  const [state, dispatch] = useReducer(reducer, {days: [], day: "Monday", appointments: {}, interviewers: {}});

    
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
          interviewers: all[2].data 
        });
    })
  }, []);
  
  
  
  const manageInterview = (id, interview = null) => {
    const appointment = {...state.appointments[id], interview: interview ? {...interview} : null}
    const appointments = {...state.appointments, [id]: appointment}
    const dayIndex = getDayIndexByAppointment(state, id);
    const days = [...state.days];
    const spotReducer = (acc, id) =>  appointments[id].interview ? acc : acc + 1;
    days[dayIndex].spots = days[dayIndex].appointments.reduce(spotReducer, 0)

    const request = interview ? axios.put : axios.delete;
    return request(`/api/appointments/${id}`, appointment)
      .then(() => {
        dispatch({type: SET_INTERVIEW, appointments, days})
      }
    )
  };

return {state, setDay, manageInterview};
};

export default useApplicationData;