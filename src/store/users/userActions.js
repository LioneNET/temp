const setUser = data => dispatch => dispatch({ type: 'user/set.item', data })
export const setUserError = message => dispatch => {
  dispatch({ type: 'user/set.error', data: message })
  setTimeout(() => {
    dispatch({ type: 'user/set.error', data: false })
  }, 3000);
}
export const setUserIsLoading = data => dispatch => dispatch({ type: 'user/set.is.loading', data })
export const handleLogout = () => dispatch => {
  dispatch({ type: 'user/logout' })
  localStorage.removeItem('userData')
}
export const handleLogin = data => dispatch => {
  dispatch(setUser(data))
  localStorage.setItem('userData', JSON.stringify(data))
}