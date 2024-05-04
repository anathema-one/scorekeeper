const db = require('../../lib/db');  // Ensure the path to db.js is correct

exports.handler = async (event) => {
    const { sessionId, actionType } = JSON.parse(event.body);  // actionType determines whether to reset scores or delete players

    try {
        let response;
        if (actionType === 'resetScores') {
            response = await db.resetScoresInSession(sessionId);
        } else if (actionType === 'deletePlayers') {
            response = await db.deletePlayersInSession(sessionId);
        } else {
            return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Invalid action type specified' }) };
        }
        return { statusCode: 200, body: JSON.stringify(response) };
    } catch (error) {
        console.error('Error processing request:', error);
        return { statusCode: 500, body: JSON.stringify({ success: false, message: error.message }) };
    }
};
