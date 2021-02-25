
const reducer = (state, action) => {

  const actions = {
    SET_DAY: {...state, day: action.day},
    SET_APPLICATION_DATA: {...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers},
    SET_INTERVIEW: {...state, days: action.days, appointments: action.appointments}
  };

  if (!actions[action.type]) {
    throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
  }
  return actions[action.type];

}

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default reducer;
export {SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW};