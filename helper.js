const requestAPI = require('request');
const _ = require('lodash');

const URI = 'https://fourtytwowords.herokuapp.com';
const API_KEY = 'b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164';

const RELATION_TYPE = {
  SYNONYM: 'synonym',
  ANTONYM: 'antonym',
};


exports.definitions = function (word) {
  if (!word) {
    console.log('Error Found : Word is undefined in defination');
    return;
  }
  const uri = URI + `/word/${word}/definitions?api_key=${API_KEY}`;
  const options = {
    method: 'GET',
    uri
  };

  return new Promise((resolve, reject) => {
    return requestAPI(options, (error, response) => {
      const body = JSON.parse(response.body);

      if (error || (body && body.error)) {
        const errorMessage = error || (body && body.error);
        console.log('Error Found : ', errorMessage);
        return resolve(error);
      }

      resolve(body);
    });
  }); 
};

exports.relatedWords = function (word, type) {
  if (!word) {
    console.log(`Error Found : Word is undefined in ${type} function`);
  }

  const uri = URI + `/word/${word}/relatedWords?api_key=${API_KEY}`;
  const options = {
    method: 'GET',
    uri
  };

  return new Promise((resolve, reject) => {
    return requestAPI(options, (error, response) => {
      const body = JSON.parse(response.body);

      if (error || (body && body.error)) {
        const errorMessage = error || (body && body.error);
        console.log('Error Found : ', errorMessage);
        return resolve(error);
      }

      if (_.isEmpty(body)) {
          console.log('Empty response result');
          return resolve();
      }

      let words;
      _.forEach(body, (data) => {
        if (data.relationshipType === type) {
          words = data.words;
        }
      });

      if (_.isEmpty(words)) {
        console.log(`Error Found : No ${type} found`);
        return resolve();
      }

      resolve(words);
    });
  });
};

exports.example = function (word) {
  if (!word) {
    console.log('Error Found : Word is undefined in example function');
    return;
  }
  const uri = URI + `/word/${word}/examples?api_key=${API_KEY}`;
  const options = {
    method: 'GET',
    uri
  };

  return new Promise((resolve, reject) => {
    return requestAPI(options, (error, response) => {
      const body = JSON.parse(response.body);

      if (error || (body && body.error)) {
        const errorMessage = error || (body && body.error);
        console.log('Error Found : ', errorMessage);
        return resolve(error);
      }

      return resolve(body);
    });
  });
};

exports.random = function () {
  const uri = URI + `/words/randomWord?api_key=${API_KEY}`;
  const options = {
    method: 'GET',
    uri
  };

  return new Promise((resolve, reject) => {
    return requestAPI(options, (error, response) => {
      const body = JSON.parse(response.body);

      resolve(body.word);
    });
  });
};

exports.fullDist = function (word) {
  if (!word) {
    console.log('Error Found : Word is undefined in fullDist function');
  }

  const result = {};
  return exports.definitions(word)
    .then((definition) => {
      result.definition = definition;

      return exports.relatedWords(word, RELATION_TYPE.SYNONYM)
        .then((synonyms) => {
          result.synonyms = synonyms;

          return exports.relatedWords(word, RELATION_TYPE.ANTONYM)
            .then((antonyms) => {
              result.antonyms = antonyms
              
              return exports.example(word)
                .then((examples) => {
                  result.examples = examples;
                });
            });
        });
    })
};

exports.dayFullDist = function () {
  return exports.random()
    .then((word) => exports.fullDist(word));
};
