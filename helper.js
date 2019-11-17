const requestAPI = require('request');
const _ = require('lodash');
const colors = require('colors');

const URI = 'https://fourtytwowords.herokuapp.com';
const API_KEY = 'b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164';

const RELATION_TYPE = {
  SYNONYM: 'synonym',
  ANTONYM: 'antonym',
};

const NOT_FOUND_ERR_MSG = 'Error : Input word not found';

/**
 * Gets the definitions of given word
 * @param {String} {word}
 * @returns {Object} {List of definitions}
 */
exports.definitions = function (word) {
  if (!word) {
    console.log(colors.bgRed(NOT_FOUND_ERR_MSG));
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
        console.log(colors.bgRed('Error : ', errorMessage));
        return resolve();
      }

      resolve(body);
    });
  }); 
};

/**
 * Gets the relation words of given word
 * @param {String} {word}
 * @param {String} {type} {synonym / antonym}
 * @returns {Object} {List of related words}
 */
exports.relatedWords = function (word, type) {
  if (!word) {
    console.log(colors.bgRed(NOT_FOUND_ERR_MSG));
    return;
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
        console.log(colors.bgRed('Error : ', errorMessage));
        return resolve();
      }

      let words;
      _.forEach(body, (data) => {
        if (data.relationshipType === type) {
          words = data.words;
        }
      });

      resolve(words);
    });
  });
};

/**
 * Gets the examples of given word
 * @param {String} {word}
 * @returns {Object} {List of examples}
 */
exports.example = function (word) {
  if (!word) {
    console.log(colors.bgRed(NOT_FOUND_ERR_MSG));
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
        console.log(colors.bgRed('Error : ', errorMessage));
        return resolve();
      }

      return resolve(body);
    });
  });
};

/**
 * Gets the relation words
 * @returns {String} {random word}
 */
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

/**
 * Gets the full dist of given word
 * @param {String} {word}
 * @returns {Object} {full dist}
 */
exports.fullDist = function (word) {
  if (!word) {
    console.log(colors.bgRed(NOT_FOUND_ERR_MSG));
    return;
  }

  const result = {};
  result.word = word;
  return exports.definitions(word)
    .then((definitions) => {
      result.definitions = definitions;

      return exports.relatedWords(word, RELATION_TYPE.SYNONYM)
        .then((synonyms) => {
          result.synonyms = synonyms;

          return exports.relatedWords(word, RELATION_TYPE.ANTONYM)
            .then((antonyms) => {
              result.antonyms = antonyms
              
              return exports.example(word)
                .then((examples) => {
                  result.examples = examples;

                  return result;
                });
            });
        });
    })
};

/**
 * Gets the full dist of random word
 * @param {String} {word}
 * @returns {Object} {full dist}
 */

exports.dayFullDist = function () {
  return exports.random()
    .then((word) => exports.fullDist(word));
};
