
export function getAppointmentsForDay(state, day) {
  const matchedDay = state.days.filter(ele => ele.name === day ? true : false)[0];
  if (matchedDay) {
    return [...matchedDay.appointments].map(id => {
      return {...state.appointments[id]};
    });
  } else {
    return [];
  }
}

