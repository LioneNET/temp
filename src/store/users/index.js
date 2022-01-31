import initialState from './initialState'

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'user/set.item':
      return { ...state, userData: action.data }
    case 'user/set.is.loading':
      return { ...state, isUserLoading: action.data }
    case 'user/set.error':
      return { ...state, userError: action.data }
    case 'user/logout':
      return { ...state, userData: null }
    default:
      return state
  }
}

export default userReducer