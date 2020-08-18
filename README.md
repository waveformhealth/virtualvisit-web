# Virtual Visit Web

## About

This is the web app component of Virtual Visit, a product for making video calls simple for patients in hospitals.
This project was created during the [Twilio x DEV community hackathon](https://dev.to/devteam/announcing-the-twilio-hackathon-on-dev-2lh8).

This React app is a fork of [twilio-video-app-react](https://github.com/twilio/twilio-video-app-react).

## Prerequisites

You must have the following installed:

* [Node.js v10+](https://nodejs.org/en/download/)
* NPM v6+ (comes installed with newer Node versions)

## Set up

In the `.env` at the root of this project:

- Set `PORT=8023`
- Set `REACT_APP_SET_AUTH=none`
- Set `REACT_APP_TOKEN_ENDPOINT` to the full `/token` endpoint URL of a running instance of [virtualvisit-twilio-serverless](https://github.com/waveformhealth/virtualvisit-twilio-serverless)

## Install Dependencies

Run `npm install` to install all dependencies from NPM.

## Local Testing

Run the app locally with:

    $ npm start
