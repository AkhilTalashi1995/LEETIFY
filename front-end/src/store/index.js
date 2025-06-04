import { createStore } from "redux";

// Helpers//
function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem("leetify_app_state");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}
function saveToLocalStorage(state) {
  try {
    // Save the entire state, not just userData
    const serializedState = JSON.stringify(state);
    localStorage.setItem("leetify_app_state", serializedState);
  } catch (e) {}
}

const initialState = {
  userData: {},
  selectedProblem: {},
  problemList: [],
  problemSubmissionStatus: false,
  showSubmissionCodePanel: {},
};

const persistedState = loadFromLocalStorage();

const reducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case "SIGNIN_SUCCESS":
      newState = {
        ...state,
        userData: action.payload,
      };
      break;
    case "SET_PROBLEM_LIST":
      newState = {
        ...state,
        problemList: action.payload,
      };
      break;
    case "SET_SELECTED_PROBLEM":
      newState = {
        ...state,
        selectedProblem: action.payload,
      };
      break;
    case "ACCEPTED_SUBMISSION_STATUS":
      newState = {
        ...state,
        problemSubmissionStatus: true,
      };
      break;
    case "WRONG_SUBMISSION_STATUS":
      newState = {
        ...state,
        problemSubmissionStatus: false,
      };
      break;
    case "RESET_SUBMISSION_STATUS":
      newState = {
        ...state,
        problemSubmissionStatus: false,
      };
      break;
    case "SHOW_SUBMISSION_CODE_PANEL":
      newState = {
        ...state,
        showSubmissionCodePanel: {
          show: true,
          submission: action.payload,
        },
      };
      break;
    case "HIDE_SUBMISSION_CODE_PANEL":
      newState = {
        ...state,
        showSubmissionCodePanel: {
          show: false,
          submission: "",
        },
      };
      break;
    case "LOGOUT":
      localStorage.removeItem("leetify_app_state");
      newState = {
        ...initialState,
      };
      break;
    default:
      newState = state;
  }
  saveToLocalStorage(newState);
  return newState;
};

const store = createStore(reducer, { ...initialState, ...persistedState });

export default store;
