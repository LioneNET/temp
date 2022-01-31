import { applyMiddleware, combineReducers, createStore } from "redux"
import thunk from "redux-thunk"
import contactReducer from "./contacts"
import userReducer from './users'
import userInitialState from './users/initialState'

const rootReducer = {
  user: userReducer,
  contacts: contactReducer
}

const getLocalUserData = () => {
  const user = localStorage.getItem('userData')
  return user ? JSON.parse(user) : null
}

const defaultStates = {
  user: {
    ...userInitialState,
    userData: getLocalUserData()
  }
}

const store = createStore(combineReducers(rootReducer), defaultStates, applyMiddleware(thunk))

export default store