const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const executeQuery = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        pool.execute(sql, values, (error, results) => {
            if (error) {
                reject(error)
                return
            }
            resolve(results)
        })
    })
}

const createUser = async (email, password) => {
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)'
    const values = [email, password]

    try {
        executeQuery(sql, values)
    } catch (error) {
        throw error
    }
}

const getUserByEmail = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?'
    const values = [email]

    try {
        const results = await executeQuery(sql, values)
        return results[0]
    } catch (error) {
        throw error
    }
}

module.exports = { createUser, getUserByEmail}