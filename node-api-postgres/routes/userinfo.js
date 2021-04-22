const db = require('../db/db')

// USERINFO Functions
//
const getUserInfo = (request, response) => {
    db.query('SELECT * FROM userinfo ORDER BY email ASC', (err, results) => {
        if (err) {
            throw err
        }
        response.status(200).json(results.rows)
    })
}

const createUserInfo = (request, response) => {
    const email = request.email
    const { firstname, lastname, city, state, zipcode } = request.body

    db.query('INSERT INTO userinfo(email, firstname, lastname, city, state, zipcode) VALUES ($1, $2, $3, $4, $5, $6)', [email, firstname, lastname, city, state, zipcode], (err, results) => {
        if (err) {
            throw err
        }
        response.status(201).send('User-Info added!')
    })
}

module.exports = {
    getUserInfo,
    createUserInfo
}