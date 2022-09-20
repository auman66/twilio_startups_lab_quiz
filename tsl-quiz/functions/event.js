
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

const airtable = require("airtable");

const base = new airtable({
    apiKey: AIRTABLE_API_KEY,
  }).base(AIRTABLE_BASE_ID);

exports.handler = async function(context, event, callback) {
  /// Find the current event
  const [langs, eId, link] = await base('events').select({
      filterByFormula: `{Current}=1`
  }).all().then((records) => {
      // Get the languages for the current event
      return [records[0].fields.languages, records[0].id, records[0].fields.signup_link]
  });

  // Create dictionaries that are filled for the response
  lang_dict = {
      'count': langs.length,
      'event': eId,
      'signup_link': link
  };

  // Iterate through the languages
  for (const [i, lang] of langs.entries()) {

      // Get the system messages for each language
      const messages = await base('language_messages').find(lang).then(record => {
      return record.fields
      });

      // Add to dictionary of the languages with number options
      lang_dict[(i+1).toString()] = messages.language;
      lang_dict[messages.language] = lang;

      // Create the welcome & choose language message
      if (langs.length == 1){
          lang_dict['welcome'] = messages.no_choice_welcome;
          lang_dict['language'] = messages.language;
      } else if (i == 0) {
          lang_dict['welcome'] = messages.welcome;
          lang_dict['choice_keys'] = messages.choose_language.replace("###",(i+1));
          lang_dict['bad_response'] = messages.bad_lang;
      } else {
          lang_dict['welcome'] += ` / ${messages.welcome}`;
          lang_dict['choice_keys'] += `\n${messages.choose_language.replace("###",(i+1))}`;
          lang_dict['bad_response'] += `\n${messages.bad_lang}`;
      }

  };

  // Fill in numbers to bad_response
  if (langs.length > 1){
    opts = Array.from(Array(langs.length).keys())
    opts.shift()
    lang_dict['bad_response'] = lang_dict['bad_response'].replace(/XXX/g,opts.join(", "))
    lang_dict['bad_response'] = lang_dict['bad_response'].replace(/YYY/g,langs.length)
  }
  

  console.log("Returned on ", new Date().toLocaleString('en-US', { timeZone: 'America/Denver' }));

  return callback(null, lang_dict);
};