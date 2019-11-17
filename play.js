const _ = require('lodash');
const inquirer = require('inquirer');
const colors = require('colors');
const Display = require('./display');
const Helper = require('./helper');

/**
 * Checks whether input answer is correct or not
 * @param {String} {actualWord}
 * @param {String} {expectedResult}
 * @param {Object} {synonyms} {List of synonyms}
 * @returns {Boolean}
 */
const isCorrectMatch = function (actualWord, expectedResult, synonyms) {
  if (actualWord === expectedResult || _.includes(synonyms, actualWord)) {
    return true;
  }

  return false;
};

/**
 * Shows the hints
 * @param {Object} {result} {Entire dist}
 */
const hint = function (result) {
  const word = result.word;
  // jumbuling the actual word
  const jumbledWord = word.split('').sort(function () { return 0.5 - Math.random() }).join('');

  console.log(colors.blue('jumbled word : ', jumbledWord));

  return Display.displayPlay(result);
};

/**
 * Gets the input and try the choices
 * @param {Object} {result} {Entire dist}
 */
const playGame = function (result) {
  word = result.word;
  return inquirer.prompt([{ type: 'input', name: 'word', message: 'Guess the word' }])
    .then((answer) => {
      console.log('anser : ', answer, '*');
      if (isCorrectMatch(answer.word, word, result.synonyms)) {
        console.log(colors.bgGreen('Success'));
        return;
      }

      return inquirer.prompt([{ type: 'rawlist', name: 'option', choices: ['Try Again', 'Hint', 'Quit'] }])
        .then((choice) => {
          console.log('choice : ', choice);
          switch (choice.option) {
            case 'Try Again':
              return playGame(result);
            case 'Hint':
              return hint(result)
                .then(() => playGame(result))
            case 'Quit':
              return Display.displayFullDist(result);
          }
        });
    });
};

exports.play = function () {
  return Helper.dayFullDist()
    .then((result) => {
      return Display.displayPlay(result)
        .then(() => playGame(result));
    });
};