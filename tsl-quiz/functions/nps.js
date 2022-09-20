// This is your new function. To start, set the name and path on the left.
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const airtable = require("airtable");

const base = new airtable({
    apiKey: AIRTABLE_API_KEY,
  }).base(AIRTABLE_BASE_ID);

exports.handler = async function(context, event, callback) {
    if (event.at_id == ""){
        base('results').create([{
            "fields": {
                events: [event.eid],
                language: [event.lang],
                NPS: parseInt(event.NPS)
            }
        }], (err, records) => {
            if (err) {
            console.error(err);
            return [];
            }
            console.log("first ID:", records[0].getId());

            return callback(null, {
                'at_id': records[0].getId()
            });
        });
    } else {
        base('results').update([{
            "id": event.at_id,
            "fields": {
            NPS: parseInt(event.NPS)
            }}], (err, records) => {
            if (err) {
            console.error(err);
            return [];
            }
            console.log("first ID:", records[0].getId());

            return callback(null, {
                at_id: event.at_id
            });
        });
    }

    
};