
// This is your new function. To start, set the name and path on the left.
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const airtable = require("airtable");

const base = new airtable({
    apiKey: AIRTABLE_API_KEY,
  }).base(AIRTABLE_BASE_ID);

const letterArray = ['A', 'B', 'C'];

exports.handler = async function(context, event, callback) {
  //Get any previous feedback
  base('results').find(event.at_id, function(err, record) {
      if (err) { console.error(err, "ErRoR"); return false; }

      //if there is existing feedback, add to it
      let oldFeedback = "";
      if (typeof record.fields.feedback !== 'undefined') {
          oldFeedback = record.fields.feedback+"\n";
      }
      let newFeedback = `${oldFeedback}[${new Date().toUTCString()}] ${event.feedback}`

      //update the entry with the new feedback
      base('results').update([{
          "id": event.at_id,
          "fields": {
            feedback: newFeedback
          }}], (err, records) => {
          if (err) {
            console.error(err);
            return [];
          }
          console.log("first ID:", records[0].getId());
  
          return callback(null,{
              result: 'success',
              feedback: newFeedback
          });
      });
  });
    
    
};