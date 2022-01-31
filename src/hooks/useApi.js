import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { handleLogout } from "../store/users/userActions"

const useApi = () => {
  const token = useSelector(state => state.user.userData)
  const dispatch = useDispatch()

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
  })

  api.interceptors.request.use(
    config => {
      if (token) {
        config.headers.Authorization = `Bearer ${token.access_token}`
      }
      config.headers.Accept = 'application/json'
      return config
    },
    error => Promise.reject(error))

  api.interceptors.response.use(
    response => response,
    error => {
      const { response: { status } } = error
      if (status === 401) {
        dispatch(handleLogout())
      }
      return Promise.reject(error)
    }
  )

  return api
}

export default useApi