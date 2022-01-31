import ReactDOM from 'react-dom'
import { Provider, useSelector } from 'react-redux'
import store from './store'
import Contacts from './Contacts'
import Login from './Login'
import './scss/style.scss'

const Route = () => {
  const user = useSelector(state => state.user.userData)
  return user ? <Contacts /> : <Login />
}

const Main = () => {
  return (
    <Provider store={store}>
      <Route />
    </Provider>
  )
}

ReactDOM.render(<Main />,
  document.querySelector('#root'))