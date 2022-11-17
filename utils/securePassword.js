const bycrypt = require('bcryptjs')

const securePassword = async (password) => {
    const salt = await bycrypt.genSalt(10)
    const hashedPassword = await bycrypt.hash(password, salt)
    return hashedPassword
}

module.exports = securePassword