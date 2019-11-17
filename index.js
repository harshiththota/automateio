const Helper = require('./helper');
const Display = require('./display');
const Play = require('./play');

const RELATION_TYPE = {
  SYNONYM: 'synonym',
  ANTONYM: 'antonym',
};

const func = process.argv[2];
const word = process.argv[3];

switch(func) {
  case 'defn':
    return Helper.definitions(word)
      .then(result => Display.displayDefinitions(result));
  
  case 'syn':
    return Helper.relatedWords(word, RELATION_TYPE.SYNONYM)
      .then(result => Display.displayRelatedWords(result, RELATION_TYPE.SYNONYM));

  case 'ant':
    return Helper.relatedWords(word, RELATION_TYPE.ANTONYM)
      .then(result => Display.displayRelatedWords(result, RELATION_TYPE.ANTONYM));

  case 'ex':
    return Helper.example(word)
      .then(result => Display.displayExamples(result.examples));

  case 'play':
    return Play.play();

  default:
    if (func) {
      return Helper.fullDist(func);
    } else {
      return Helper.dayFullDist();
    }
};