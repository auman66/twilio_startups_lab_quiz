
// This is your new function. To start, set the name and path on the left.
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const airtable = require("airtable");

const base = new airtable({
    apiKey: AIRTABLE_API_KEY,
  }).base(AIRTABLE_BASE_ID);

exports.handler = async function(context, event, callback) {

    const lang_id = event.lang_id || "rec6OaOCD87IWMMww";

    // Get the system messages for each language
    const messages = await base('language_messages').find(lang_id).then(record => {
        return record.fields
    });

    // Get the survey questions and results for each language
    const survey = await base('survey').find(messages.survey).then (record => {
        return record.fields
    });

    const graphics = await base('survey').select({
            filterByFormula: "{name}='graphics'"
      }).all().then( r => {
        return r[0].fields;
    });
  
  return callback(null, {
      messages,
      survey,
      graphics
  });
};