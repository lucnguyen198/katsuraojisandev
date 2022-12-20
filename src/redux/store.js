import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import connectReducer from "./connect/connectReducer";
import contractDataReducer from "./contractData/contractDataReducer";
import contractTransactionReducer from "./contractTransaction/contractTransactionReducer";

const rootReducer = combineReducers({
  connect: connectReducer,
  contractData: contractDataReducer,
  contractTransaction: contractTransactionReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
