const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const cors = require('cors')({ origin: true });

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Delete User function
exports.deleteUser = onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      // Log the request body for debugging
      logger.info('Request body:', request.body);

      const { authId } = request.body;

      // Verify if the authId has the correct format
      if (!authId || typeof authId !== 'string' || authId.trim().length === 0) {
        logger.error('Invalid authId received:', authId);
        response.status(400).send('Invalid authId');
        return;
      }

      logger.info(`Deleting user with ID: ${authId}`);

      // Delete the user from Firebase Authentication
      await admin.auth().deleteUser(authId);
      logger.info(`Deleted user from Authentication: ${authId}`);

      // Delete the user document from Firestore
      const userRef = admin.firestore().collection('users').doc(authId);
      await userRef.delete();
      logger.info(`Deleted user document from Firestore: ${authId}`);

      response.json({ message: `Successfully deleted user with ID: ${authId}` });
    } catch (error) {
      logger.error('Error deleting user:', error);
      response.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
  });
});