const fs = require('fs')
const jwt = require('jsonwebtoken')
const accessTokenKey = 'sbb00tca3p'
const users = [
    {
        username: 'demo',
        password: 'demo'
    },
    {
        username: 'oil',
        password: 'kanjeranian'
    }
]

function getDb() {
    return JSON.parse(fs.readFileSync('db.json', { encoding: 'utf-8' }))
}

function saveDb(db) {
    fs.writeFileSync('db.json', JSON.stringify(db))
}

module.exports.login = (username, password) => {
    if (users.find(user => user.username === username && user.password === password)) {
        console.log(users.find(user => user.username === username).username)
        return jwt.sign({ username }, accessTokenKey)
    }
}

module.exports.authMiddleware = (req, res, next) => {
    const authorization = (req.header('Authorization') || '').split(/ +/)
    if (authorization.length == 2 && authorization[0] === 'Bearer' && jwt.verify(authorization[1], accessTokenKey)) {
        next()
    } else {
        res.sendStatus(401)
    }
}

module.exports.getTodos = () => {
    return getDb().data
}

module.exports.postTodo = (text) => {
    const db = getDb()
    const todo = { id: db.nextId++, text }
    db.data.push(todo)
    saveDb(db)
    return todo
}

module.exports.deleteTodo = (id) => {
    const db = getDb()
    db.data = db.data.filter(todo => todo.id != id)
    saveDb(db)
}