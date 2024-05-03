const AWS = require('aws-sdk');

// Initialize DynamoDB document client
const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-2', // specify your region
    apiVersion: '2012-08-10' // specify DynamoDB API version
});

const tableName = "Scorekeeper"; // Define your DynamoDB table name here

const db = {
    /**
     * Add a player to the DynamoDB table with an initial score of 0
     */
    addPlayer: async (playerName) => {
        const params = {
            TableName: tableName,
            Item: {
                'PlayerID': playerName,
                'Score': 0  // Starting score
            }
        };
        try {
            await dynamoDB.put(params).promise();
            return { success: true, message: 'Player added successfully' };
        } catch (error) {
            console.error('Error adding player:', error);
            throw error;
        }
    },

    /**
     * Remove a player from the DynamoDB table
     */
    removePlayer: async (playerName) => {
        const params = {
            TableName: tableName,
            Key: {
                'PlayerID': playerName
            }
        };
        try {
            await dynamoDB.delete(params).promise();
            return { success: true, message: 'Player removed successfully' };
        } catch (error) {
            console.error('Error removing player:', error);
            throw error;
        }
    },

    /**
     * Update a player's score in the DynamoDB table
     */
    updateScore: async (playerName, scoreChange) => {
        const params = {
            TableName: tableName,
            Key: {
                'PlayerID': playerName
            },
            UpdateExpression: "add Score :inc",
            ExpressionAttributeValues: {
                ":inc": scoreChange
            },
            ReturnValues: "UPDATED_NEW"
        };
        try {
            const result = await dynamoDB.update(params).promise();
            return { success: true, updatedAttributes: result.Attributes, message: 'Score updated successfully' };
        } catch (error) {
            console.error('Error updating score:', error);
            throw error;
        }
    },

    /**
     * Get a player's score
     */
    getPlayerScore: async (playerName) => {
        const params = {
            TableName: tableName,
            Key: {
                'PlayerID': playerName
            }
        };
        try {
            const result = await dynamoDB.get(params).promise();
            return result.Item ? { success: true, score: result.Item.Score } : { success: false, message: 'Player not found' };
        } catch (error) {
            console.error('Error getting player score:', error);
            throw error;
        }
    }
};

module.exports = db;
