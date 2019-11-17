const _ = require('lodash');
const colors = require('colors');

exports.displayDefinitions = function (definitions) {
  if (_.isEmpty(definitions)) {
    console.log(colors.bgYellow('No definitions found'));
    return;
  }

  console.log(colors.bgCyan('Definitions'));

  _.forEach(definitions, (defn) => {
    console.log(colors.green(defn.text));
  });
};

exports.displayRelatedWords = function (relatedWords, type) {
  if (_.isEmpty(relatedWords)) {
    console.log(colors.bgYellow('No related words found'));
    return;
  }

  console.log(colors.bgCyan(`Related Words ( ${type} )`));

  _.forEach(relatedWords, (word) => {
    console.log(colors.green(word));
  });
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
};