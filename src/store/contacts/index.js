
const initialState = {
  items: [],
  isContactsLoading: false
}

const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'contact/set.items':
      return { ...state, items: action.data }
    case 'contact/set.is.loading':
      return { ...state, isLoading: action.data }
    default:
      return state
  }
}

export default contactReducer