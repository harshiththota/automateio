const _ = require('lodash');
const inquirer = require('inquirer');
const colors = require('colors');
const Display = require('./display');
const Helper = require('./helper');

const definitionIndex = 0;

const isCorrectMatch = function (actualWord, expectedResult, synonyms) {
  if (actualWord === expectedResult || _.includes(synonyms, actualWord)) {
    return true;
  }

  return false;
};

const hint = function (result) {
  const word = result.word;
  const jumbledWord = word.split('').sort(function () { return 0.5 - Math.random() }).join('');

  console.log(colors.blue('jumbled word : ', jumbledWord));

  return Display.displayPlay(result);
};

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
              console.log('Word : ', word);
          }
        });
    });
};

exports.play = function () {
  return Helper.dayFullDist()
    .then((result) => {
      console.log('result : ', result);
      console.log('**********************');
      return Display.displayPlay(result)
        .then(() => playGame(result));
    });
};