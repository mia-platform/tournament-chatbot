import * as functions from 'firebase-functions';
import * as express from 'express'
import * as convexpress from 'convexpress'

const options = {
  info: {
    title: "Tournament Bot",
    version: "1.0.0"
  },
  basePath: '/tournaments',
  host: "us-central1-tournament-bot.cloudfunctions.net"
}
const api = convexpress(options)
  .serveSwagger()
  .loadFrom(`${__dirname}/api/**/*.js`)


const app : express.Application = express().use(api);

// Expose Express API as a single Cloud Function:
exports.tournaments = functions.https.onRequest(app);
