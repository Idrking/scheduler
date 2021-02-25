
//Selectors for use throughout application
//Ensure these do not mutate state

export function getAppointmentsForDay(state, day) {
  const matchedDay = state.days.find(ele => ele.name === day ? true : false);
  if (matchedDay) {
    return [...matchedDay.appointments].map(id => {
      return {...state.appointments[id]};
    });
  } else {
    return [];
  }
};


export function getInterview(state, interview) {
  if(!interview) {
    return null;
  }
  const interviewerID = interview.interviewer;
  return {
    student: interview.student,
    interviewer: {...state.interviewers[interviewerID]}
  }
};

export function getInterviewersForDay(state, day) {
  const matchedDay = state.days.find(ele => ele.name === day ? true : false);
  if (matchedDay) {
    return [...matchedDay.interviewers].map(id => {
      return {...state.interviewers[id]};
    });
  } else {
    return [];
  }
};

export function getDayIndexByAppointment(state, id) {
  return state.days.findIndex(day => day.appointments.includes(id))
}