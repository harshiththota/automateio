const _ = require('lodash');
const colors = require('colors');

const RELATION_TYPE = {
  SYNONYM: 'synonym',
  ANTONYM: 'antonym',
};


exports.displayDefinitions = function (definitions) {
  if (_.isEmpty(definitions)) {
    console.log(colors.bgYellow('No definitions found'));
    return;
  }

  console.log(colors.bgCyan('Definitions'));

  _.forEach(definitions, (defn) => {
    console.log(colors.green(defn.text));
  });

  return Promise.resolve();
};

exports.displayRelatedWords = function (relatedWords, type) {
  if (_.isEmpty(relatedWords)) {
    console.log(colors.bgYellow(`No related words found of type ${type}`));
    return;
  }

  console.log(colors.bgCyan(`Related Words ( ${type} )`));

  _.forEach(relatedWords, (word) => {
    console.log(colors.green(word));
  });

  return Promise.resolve();
};

exports.displayExamples = function (examples) {
  if (_.isEmpty(examples)) {
    console.log(colors.bgYellow('No examples found'));
    return;
  }
  
  console.log(colors.bgCyan('Examples'));

  _.forEach(examples, (example) => {
    console.log(colors.green(example.text));
  });

  return Promise.resolve();
};

exports.displayFullDist = function (result) {
  console.log(colors.bgCyan('Word'));
  console.log(colors.green(result.word));

  return exports.displayDefinitions(result.definitions)
    .then(() => exports.displayRelatedWords(result.synonyms, RELATION_TYPE.SYNONYM))
    .then(() => exports.displayRelatedWords(result.antonyms, RELATION_TYPE.ANTONYM))
    .then(() => exports.displayExamples(result.examples.examples));
};

exports.displayPlay = function (result) {
  console.log(colors.bgCyan('Definition'));
  console.log(colors.blue(result.definitions[0].text));

  result.definitions = _.pull(result.definitions, result.definitions[0]);
  if (!_.isEmpty(result.synonyms)) {
    console.log(colors.bgCyan('Synonyms'));
    console.log(colors.blue(result.synonyms[0]));

    result.synonyms = _.pull(result.synonyms, result.synonyms[0]);
  } else if (!_.isEmpty(result.antonyms)) {
    console.log(colors.bgCyan('Antonyms'));
    console.log(colors.blue(result.antonyms[0]));

    result.antonyms = _.pull(result.antonyms, result.antonyms[0]);
  }

  return Promise.resolve();
};