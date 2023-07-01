const fs = require('fs');

const isUser = (userId, _dir) => {
    let status = false
    Object.keys(_dir).forEach((x) => {
        if (_dir[x] === userId) {
            status = true
        }
    })
    return status
}

const addUser = (userId, _dir) => {
    _dir.push(userId)
    fs.writeFileSync('./db/user.json', JSON.stringify(_dir, null, 3))
}

module.exports = {
    isUser,
    addUser
}