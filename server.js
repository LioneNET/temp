const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const fs = require('fs')
const cors = require('cors')
const server = jsonServer.create()
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults({ noCors: true })

server.use(
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
)
server.options('*', cors())

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(middlewares)

const SECRET_KEY = '123456789'
const expiresIn = '1h'

const isAuthenticated = ({ email, password }) => {
  return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}

const createToken = payload => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

const verifyToken = token => {
  return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

server.post('/auth/login', (req, res) => {
  console.log('body', req.body)
  const { email, password } = req.body
  if (isAuthenticated({ email, password }) === false) {
    const status = 401
    const message = 'Неправильно набран маил или пароль'
    res.status(status).json({ status, message })
    return
  }
  const access_token = createToken({ email, password })
  console.log("Access Token:" + access_token)
  res.status(200).json({ access_token })
})


server.use(/^(?!\/auth).*$/, (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Без авторизации'
    res.status(status).json({ status, message })
    return
  }
  try {
    let verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Токен доступа невалиден'
      res.status(status).json({ status, message })
      return
    }
    next()
  } catch (err) {
    const status = 401
    const message = 'Токен доступа отозван'
    res.status(status).json({ status, message })
  }
})

server.use(router)

server.listen(8889, () => {
  console.log('JSON Server is running')
})