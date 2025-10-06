// // functions/src/signup.js
// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp();

// exports.submitSignup = functions.https.onRequest(async (req, res) => {
//   try {
//     const data = req.body;
//     await admin.firestore().collection("signups").add(data);
//     res.send({ success: true });
//   } catch (error) {
//     res.status(500).send({ success: false });
//   }
// });
const {onRequest} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const submitSignup = onRequest(async (req, res) => {
  try {
    const data = req.body;
    await admin.firestore().collection("signups").add(data);
    res.send({success: true});
  } catch (error) {
    logger.error("Error submitting signup:", error);
    res.status(500).send({success: false});
  }
});

module.exports = {submitSignup};
