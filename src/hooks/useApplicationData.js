import {useState, useEffect} from "react";
import axios from "axios";

const useApplicationData = () => {

  const [state, setState] = useState({days: [], day: "Monday", appointments: {}, interviewers: {}})
  const setDay = day => setState(prev => ({...prev, day}));

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    })
  }, []);
  
  const manageInterview = (id, interview = null) => {
    const appointment = {...state.appointments[id], interview: interview ? {...interview} : null}
    const appointments = {...state.appointments, [id]: appointment}
    const request = interview ? axios.put : axios.delete;
  
    return request(`/api/appointments/${id}`, appointment)
      .then(() => setState(prev => {
        return {
          ...prev,
          appointments
        }
      })
    )
  };




return {state, setDay, manageInterview};
};

export default useApplicationData;