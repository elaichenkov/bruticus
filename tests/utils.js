const fs = require('fs');
const path = require('path');
const { strictEqual } = require('assert');
const disparity = require('disparity');
const jscodeshift = require('jscodeshift');

function diffFiles(fn, inputPath, outputPath, options = {}) {
  const result = fn(
    {
      path: path.join(__dirname, inputPath),
      source: fs.readFileSync(path.join(__dirname, inputPath), 'utf8'),
    },
    {
      jscodeshift,
      stats: function () {},
    },
    Object.assign(
      {},
      {
        printOptions: {
          quote: 'single',
        },
      },
      options,
    ),
  );

  const diff = disparity.unified(result.trim(), fs.readFileSync(path.join(__dirname, outputPath), 'utf8').trim(), {
    paths: [`${inputPath} (transformed)`, outputPath],
  });

  strictEqual(diff, '', `\n${diff}`);
}

module.exports = diffFiles;
