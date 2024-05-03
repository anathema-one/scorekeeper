const db = require('../../lib/db');  // Adjust the path as necessary

exports.handler = async (event) => {
    const { playerName, scoreChange } = JSON.parse(event.body);
    try {
        const response = await db.updateScore(playerName, scoreChange);
        return { statusCode: 200, body: JSON.stringify(response) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ success: false, message: error.message }) };
    }
};
