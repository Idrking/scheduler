import React from "react";
import axios from "axios";

import { render, cleanup, waitForElement, fireEvent, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, prettyDOM, getByDisplayValue } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const {getByText} = render(<Application />);
  
    await waitForElement(() => getByText("Monday"))
  
    fireEvent.click(getByText('Tuesday'))
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  
  });

  it("loads data, books an interview and reduces the spots remaning for the first day by 1", async () => {
    //1. Render the application
    const { container } = render(<Application />);
    
    //2. Wait until the text Archie Cowen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"))
    
    //3. Select an empty appointment
    const appointment = getAllByTestId(container, "appointment")[0];

    //4. Click on the add button, add a name to the input field, select an interviewer and click save
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {target: {value: "Lydia Miller-Jones"}});
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.click(getByText(appointment, "Save"));
    
    //5. Confirm that the saving message is displayed
    expect(getByText(container, /saving/i)).toBeInTheDocument();
    
    //6. Wait for the new appointment to show up
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    
    //7. Confirm that the spots have reduced by 1
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    //1. Render the application
    const { container } = render(<Application />);
    //2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"))
    //3. Target the appointment for Archie
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    //4. Click the "cancel" button on Archie's appointment
    fireEvent.click(getByAltText(appointment, "Delete"));
    //5. Confirm that the confirmation message displays correctly
    expect(getByText(appointment, /are you sure you would like to delete?/i)).toBeInTheDocument();
    //6. Click the confirm button
    fireEvent.click(getByText(appointment, "Confirm"));
    //5. Check that the deleting element is displayed
    expect(getByText(container, /deleting/i)).toBeInTheDocument();
    //6. Wait until the empty appointment returns
    await waitForElement(() => getByAltText(appointment, "Add"));
    
    //7. Check that the spots have increased by 1
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    //1. Render the application
    const { container } = render(<Application />);
    //2. Wait until the text "Archie Cohen is displayed"
    await waitForElement(() => getByText(container, "Archie Cohen"))
    //3. Target the appointment for Archie
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    //4. Click the edit button on Archie's appointment
    fireEvent.click(getByAltText(appointment, "edit"));
    //5. Check that Archie's name is still there
    expect(getByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();
    //6. Change the name
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {target: {value: "Lydia Miller-Jones"}});
    //7. Change the interviewer
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"))
    //8. Click Save
    fireEvent.click(getByText(appointment, "Save"));
    //9. Confirm that the saving element is displayed
    expect(getByText(container, /saving/i)).toBeInTheDocument();
    //9. Confirm that the new name is present
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"))
    //10. Confirm that the spots have not changed
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment and returns to the form when close is clicked", async () => {
    //Set the mock promise to reject for this test
    axios.put.mockRejectedValueOnce();

    //1. Render the application
    const { container } = render(<Application />);
    //2. Wait until the text "Archie Cohen is displayed"
    await waitForElement(() => getByText(container, "Archie Cohen"))
    //3. Target the appointment for Archie
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    //4. Click the edit button on Archie's appointment
    fireEvent.click(getByAltText(appointment, "edit"));
    //5. Check that Archie's name is still there
    expect(getByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();
    //6. Change the name
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {target: {value: "Lydia Miller-Jones"}});
    //7. Change the interviewer
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"))
    //8. Click Save
    fireEvent.click(getByText(appointment, "Save"));
 
    //9. Confirm that the saving element is displayed
    expect(getByText(container, /saving/i)).toBeInTheDocument();

    //10. Confirm the error message is shown on a rejected promise
    await waitForElement(() => getByText(appointment, /could not save appointment/i));

    //11. Click the close button
    fireEvent.click(getByAltText(appointment, "Close"));

    //12. Confirm that it has returned to the form without changing
    expect(getByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an appointment and returns to the appointment when close is clicked", async () => {
     //Set the mock promise to reject for this test
     axios.delete.mockRejectedValueOnce();

     //1. Render the application
     const { container } = render(<Application />);
     //2. Wait until the text "Archie Cohen is displayed"
     await waitForElement(() => getByText(container, "Archie Cohen"))
     //3. Target the appointment for Archie
     const appointment = getAllByTestId(container, "appointment").find(
       appointment => queryByText(appointment, "Archie Cohen")
     );
     //4. Click the delete button on Archie's appointment
     fireEvent.click(getByAltText(appointment, "Delete"));

     //5. Click Confirm
     fireEvent.click(getByText(appointment, "Confirm"));
  
     //6. Confirm that the deleting element is displayed
     expect(getByText(container, /deleting/i)).toBeInTheDocument();
 
     //7. Confirm the error message is shown on a rejected promise
     await waitForElement(() => getByText(appointment, /could not delete appointment/i));
 
     //8. Click the close button
     fireEvent.click(getByAltText(appointment, "Close"));
 
     //9. Confirm that it has returned to the appointment without changing
     expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();
  });
});

