
// This is your new function. To start, set the name and path on the left.
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const airtable = require("airtable");

const base = new airtable({
    apiKey: AIRTABLE_API_KEY,
  }).base(AIRTABLE_BASE_ID);

const letterArray = ['A', 'B', 'C'];

exports.handler = async function(context, event, callback) {
    
    //Get the answers with the highest result
    let maxScore = Math.max(...letterArray.map(a => event[a]));
    const maxAnswers = letterArray.filter(a => event[a] == maxScore)
    
    var answers = {
        "events": [event.eid],
        "language": [event.lang]
    };
    letterArray.forEach(a => answers[a] = parseInt(event[a]));

    if (event.save == "true"){
        base('results').create([{
            "fields": answers
        }], (err, records) => {
            if (err) {
            console.error(err);
            return [];
            }
            console.log("first ID:", records[0].getId());

            return callback(null, {
                'at_id': records[0].getId(),
                'archtypes': maxAnswers,
                'count': Object.keys(maxAnswers).length,
            });
            
        });
    } else {
        return callback(null, {
            'archtypes': maxAnswers,
            'count': Object.keys(maxAnswers).length,
        });
    }
    
};