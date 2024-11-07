const admin = require("firebase-admin");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require('cors')({ origin: true });

// Make sure you've initialized admin
if (!admin.apps.length) {
  admin.initializeApp();
}

exports.setAdmin = onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      const { uid } = request.body;
      
      if (!uid) {
        logger.error('No uid provided');
        response.status(400).send('Missing uid');
        return;
      }

      // Set admin privilege
      await admin.auth().setCustomUserClaims(uid, {
        admin: true
      });

      logger.info(`Successfully set admin privileges for user: ${uid}`);
      response.status(200).send(`Successfully set admin privileges for user: ${uid}`);
    } catch (error) {
      logger.error('Error setting admin privilege:', error);
      response.status(500).send('Error setting admin privilege');
    }
  });
});