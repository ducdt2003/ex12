import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import productReducer from "./reducers/productReducer";
// import categoryReducer from './reducers/categoryReducer';
import authReducer from "./reducers/authReducer";
// Combine all reducers
const rootReducer = combineReducers({
  product: productReducer,
  auth: authReducer,
  // category: categoryReducer,
});

// Create store with middleware
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
