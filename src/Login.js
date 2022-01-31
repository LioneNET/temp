import { Alert, Button, Card, Form, Input, Layout, Row } from "antd"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import useApi from './hooks/useApi'
import { handleLogin, setUserError } from './store/users/userActions'

const Login = () => {
  const dispatch = useDispatch()
  const { isUserLoading, userError } = useSelector(state => state.user)
  const [authData, setAuthData] = useState({ email: '', password: '' })
  const $api = useApi()

  const queryLogin = data => {
    $api.post('/auth/login', data)
      .then(resp => {
        dispatch(handleLogin(resp.data))
      })
      .catch(err => {
        console.log(err)
        dispatch(setUserError(err.response.data.message))
      })
  }

  return (
    <Layout>
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Card title='Авторизация' style={{ width: 400, alignSelf: 'start', marginTop: '10%' }}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={() => { queryLogin({ ...authData }) }}
            onFinishFailed={(e) => console.error(e)}
            autoComplete="off"
          >
            {userError && <Alert
              style={{ marginBottom: 24 }}
              message="Ошибка"
              description={userError}
              type="error"
              showIcon
            />}

            <Form.Item
              label="Маил"
              name="email"
              rules={[{ required: true, message: 'Введите электронную почту!' }]}
            >
              <Input onChange={e => setAuthData({ ...authData, email: e.target.value })} />
            </Form.Item>

            <Form.Item
              label="Пароль"
              name="password"
              rules={[{ required: true, message: 'Введите пароль!' }]}
            >
              <Input.Password onChange={e => setAuthData({ ...authData, password: e.target.value })} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={isUserLoading}>
                Войти
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Row>
    </Layout>
  )
}

export default Login