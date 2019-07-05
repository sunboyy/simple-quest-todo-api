const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { login, authMiddleware, getTodos, postTodo, deleteTodo } = require('./model')
const port = process.env.PORT || 3000

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.static('public'))

app.post('/login', (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.json({ status: 0, error: 'username and password required' })
    }
    const accessToken = login(username, password)
    if (!accessToken) {
        return res.json({ status: 0, error: 'login failed' })
    }
    res.json({ status: 1, data: accessToken })
})

app.get('/todo', (req, res) => {
    res.json({ status: 1, data: getTodos() })
})

app.post('/todo', authMiddleware, (req, res) => {
    const { text } = req.body
    if (!text) {
        return res.json({ status: 0, error: 'text required' })
    }
    const todo = postTodo(text)
    res.json({ status: 1, data: todo })
})

app.delete('/todo', authMiddleware, (req, res) => {
    const id = req.query.id
    if (!id) {
        return res.json({ status: 0, error: 'id required' })
    }
    deleteTodo(id)
    res.json({ status: 1 })
})

app.listen(port, () => {
    console.log('Listening to port ' + port)
})
