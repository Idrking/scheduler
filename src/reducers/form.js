const reducer = (state, action) => {

  const actions = {
    SET_NAME: {...state, name: action.name},
    SET_INTERVIEWER: {...state, interviewer: action.interviewer},
    SET_ERROR: {...state, error: action.error}
  };

  if (!actions[action.type]) {
    throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
  }

  return actions[action.type];
};
const SET_NAME = "SET_NAME";
const SET_INTERVIEWER = "SET_INTERVIEWER";
const SET_ERROR = "SET_ERROR";

export default reducer;
export {SET_NAME, SET_ERROR, SET_INTERVIEWER};