
const functions = require('firebase-functions');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const cors = require('cors')({ origin: true });

const client = new textToSpeech.TextToSpeechClient();

exports.synthesizeSpeech = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const text = req.body.text;
      const request = {
        input: { text: text },
        voice: { languageCode: 'es-ES', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
      };

      const [response] = await client.synthesizeSpeech(request);
      res.set('Content-Type', 'audio/mpeg');
      res.send(response.audioContent);
    } catch (error) {
      res.status(500).send('Error generating speech');
    }
  });
});
