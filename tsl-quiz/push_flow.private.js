'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('assets/tsl_flow.private.json');
let flow_json = JSON.parse(rawdata);

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.studio.v2.flows
                .create({
                   commitMessage: 'First draft',
                   friendlyName: 'tsl-quiz',
                   status: 'draft',
                   definition: flow_json
                 })
                .then(flow => console.log(flow.sid));
