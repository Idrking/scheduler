import React, { useState, useEffect } from "react";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import axios from "axios";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

import "components/Application.scss";

export default function Application(props) {

  const [state, setState] = useState({days: [], day: "Monday", appointments: {}, interviewers: {}})
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);
  const setDay = day => setState(prev => ({...prev, day}));

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

  
  const appointmentList = dailyAppointments.map(appt => {
    const interview = getInterview(state, appt.interview);

    return (
      <Appointment 
        key={appt.id}
        id={appt.id}
        time={appt.time}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={manageInterview}
        cancelInterview={manageInterview}
      />
    );
  })


  return (
    <main className="layout">
      <section className="sidebar">
        <img
            className="sidebar--centered"
            src="images/logo.png"
            alt="Interview Scheduler"
          />
          <hr className="sidebar__separator sidebar--centered" />
          <nav className="sidebar__menu">
            <DayList 
              days={state.days}
              day={state.day}
              setDay={setDay}
            />
          </nav>
          <img
            className="sidebar__lhl sidebar--centered"
            src="images/lhl.png"
            alt="Lighthouse Labs"
          />
      </section>
      <section className="schedule">
        {appointmentList}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
