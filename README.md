# Interview Scheduler

The interview scheduler is a simple, single-page application created to practice React, axios, and testing suites like Jest and Cypress, along with Storybook for component creation. 

It allows students to sign up for interviews with various interviewers that are available that day. It also uses a WebSockets to enable changes the schedule to update in real time to all clients.

Deployed using Netlify, CircleCI and Heroku
[https://lhl-student-scheduler.netlify.app/]

## Setup

Install dependencies with `npm install`.

### Dependencies
- React & React-DOM
- Axios
- Classnames
- Normalize.css
- React-scripts

### Development Dependencies
- Babel
- Storybook
- testing-library/jest-dom
- testing-library/react
- node-sass
- prop-types
- react-hooks-testing-library
- react-test-renderer *V 16.9.0 required*

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
