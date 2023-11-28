const fs = require('fs');
const process = require('process');
const request = require('request');

const apiUrl = 'https://icanhazdadjoke.com/search';
const jokesFile = 'jokes.txt';

const getJoke = (searchTerm) => {
  const options = {
    url: `${apiUrl}?term=${encodeURIComponent(searchTerm)}`,
    headers: {
      'Accept': 'application/json',
    },
  };

  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const jokes = JSON.parse(body).results;

      if (jokes.length > 0) {
        const randomIndex = Math.floor(Math.random() * jokes.length);
        const selectedJoke = jokes[randomIndex].joke;

        console.log('Here is a joke for you:');
        console.log(selectedJoke);

        // Save the joke to the file
        fs.appendFile(jokesFile, selectedJoke + '\n', (err) => {
          if (err) throw err;
          console.log('Joke saved to jokes.txt for future laughs!');
        });
      } else {
        console.log('The joke gods are taking a day off. No jokes found.');
      }
    } else {
      console.error('Error:', error);
    }
  });
};

const displayLeaderboard = () => {
  fs.readFile(jokesFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading jokes.txt:', err);
      return;
    }

    const jokes = data.split('\n').filter(Boolean); // Remove empty lines
    const jokeCounts = {};

    jokes.forEach((joke) => {
      jokeCounts[joke] = (jokeCounts[joke] || 0) + 1;
    });

    const mostPopularJoke = Object.keys(jokeCounts).reduce((a, b) =>
      jokeCounts[a] > jokeCounts[b] ? a : b
    );

    console.log(mostPopularJoke);

    console.log('Message - So Beautiful So Elegant Just looking like a Wow!');
  });
};

// Get the command line argument
const searchTerm = process.argv[2];

// Check if the searchTerm is provided
if (searchTerm === 'leaderboard') {
  displayLeaderboard();
} else if (searchTerm) {
  getJoke(searchTerm);
} else {
  console.log('Please provide a search term or use "leaderboard". Example: node joke-cli.js <searchTerm or leaderboard>');
}
