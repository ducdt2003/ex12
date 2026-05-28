import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import productReducer, { ProductState } from "./reducers/productReducer";
import authReducer, { AuthState } from "./reducers/authReducer";

export interface RootState {
  product: ProductState;
  auth: AuthState;
}

const rootReducer = combineReducers({
  product: productReducer,
  auth: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppDispatch = typeof store.dispatch;

export default store;
