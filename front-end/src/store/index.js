import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";

/**
 * Loads persisted Redux state from localStorage.
 * @returns {Object|undefined} The parsed state, or undefined if not found or error
 */
function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem("leetify_app_state");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
}

/**
 * Persists the given Redux state to localStorage.
 * @param {Object} state - The entire Redux state to persist
 */
function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("leetify_app_state", serializedState);
  } catch (e) {
    // Swallow errors for localStorage write issues
  }
}

/**
 * The initial state of the Redux store.
 * @type {Object}
 */
const initialState = {
  userData: {},
  selectedProblem: {},
  problemList: [],
  problemSubmissionStatus: false,
  showSubmissionCodePanel: {},
};

// Load persisted state (if available) from localStorage
const persistedState = loadFromLocalStorage();

/**
 * Redux reducer for handling app state.
 * Handles user authentication, problem selection, submission status, and code panel toggles.
 * @param {Object} state - Current Redux state
 * @param {Object} action - Redux action
 * @returns {Object} New Redux state
 */
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
      // Remove persisted state on logout
      localStorage.removeItem("leetify_app_state");
      newState = {
        ...initialState,
      };
      break;
    default:
      newState = state;
  }
  // Persist state after every action
  saveToLocalStorage(newState);
  return newState;
};

/**
 * Creates the Redux store with persistence and thunk middleware.
 * Loads any previously persisted state as the initial state.
 */
const store = createStore(
  reducer,
  { ...initialState, ...persistedState },
  applyMiddleware(thunk)
);

export default store;
