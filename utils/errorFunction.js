const errorFunction = (errorBit, msg, data) => {
    if (errorBit) return { is_error: errorBit, message: msg }
    else return { is_error: errorBit, message: msg, data }
}

module.exports = errorFunction

// errorBit - for checking if the error has occurred or not
// msg - for displaying appropriate message for which action is performed
// data - send to the user