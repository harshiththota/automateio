const Helper = require('./helper');

const RELATION_TYPE = {
  SYNONYM: 'synonym',
  ANTONYM: 'antonym',
};

const func = process.argv[2];
const word = process.argv[3];

switch(func) {
  case 'defn':
    return Helper.definitions(word);
  
  case 'syn':
    return Helper.relatedWords(word, RELATION_TYPE.SYNONYM);

  case 'ant':
    return Helper.relatedWords(word, RELATION_TYPE.ANTONYM);

  case 'ex':
    return Helper.example(word);

  case 'play':
    return Helper.play();

  default:
    if (func) {
      return Helper.fullDist(func);
    } else {
      return Helper.dayFullDist();
    }
};