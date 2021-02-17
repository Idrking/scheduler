import React from 'react';
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm"
  },
  {
    id: 4,
    time: "3pm",
    interview: {
      student: "Jerry Bemson",
      interviewer: {
        id: 2,
        name: "Jimmy Mentiljin",
        avatar: "https://i.imgur.com/Nmx0Qxo.png"
      }
    }
  },
  {
    id: 5,
    time: "11am",
    interview: {
      student: "A dog from the street",
      interviewer: {
        id: 3,
        name: "Notable Dog Hater, Reggy",
        avatar: "https://i.imgur.com/FK8V841.jpg"
      }
    }
  }
];







export default function Appointment(props) {

  return (

    <article className="appointment">
      <Header time={props.time}/>
      {props.interview ?
      (<Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
      />) : <Empty />}
    </article>

  );

};