const Papa = require('papaparse');

const DEFAULT_VOCABULARY_PATH = "./vocab_1.csv";

function vocabulary({ path }) {
  return new Promise((resolve, reject) => {
    Papa.parse(path || DEFAULT_VOCABULARY_PATH, {
      header: true,
      download: true,
      complete (results) {
        resolve(results.data)
      },
      error (err) {
        reject(err)
      }
    })
  })
};

export {
  vocabulary
};
