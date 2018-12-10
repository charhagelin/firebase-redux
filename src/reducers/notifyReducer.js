import { NOTIFY_USER } from "../actions/types";

const initialState = {
  message: null,
  messageType: null //message typ mean is it an error or success
};

export default function(state = initialState, action) {
  switch (action.type) {
    case NOTIFY_USER:
      return {
        ...state,
        message: action.message,
        messageType: action.messageType
      };
    default:
      return state;
  }
}
