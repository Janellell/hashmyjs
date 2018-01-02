#!/usr/bin/node
/**
 * @description CLI script for the package.
 * To use it, run `npm start [your files or write to STDIN]`
 * @module index
 */
/* eslint-env node, es6 */

const hmj = require('./src/hashmyjs.js'), prgm = require('commander'), clr = require('colors'), DEBUG = process.env.DEBUG === true, pkg = require('./package.json');

clr.setTheme(require('./src/clr'));

let format = 'text', output = 'STDOUT', input = 'any', validInput = false;

prgm.arguments('[files...]')
  .version(pkg.version)
  .description(pkg.description)
  .option('-f, --format [format]', 'Specify the format of the output (text (default), json, csv)')
  .option('-o, --output [path]', 'Output to a file instead of in the STDOUT')
  .option('-i, --interactive', 'Forces to read the input from the STDIN')
  .action((files, options) => {
    validInput = true;
    if (DEBUG) console.log(clr.debug(`files=${files}`));
    if (DEBUG) console.log(clr.debug('options.args[0]='), options.args[0]);

    if (prgm.format) format = prgm.format;
    if (prgm.output) output = prgm.output;
    if (prgm.interactive) input = 'STDIN';
    hmj.run(format, input, output, files);
  })
  .parse(process.argv);

if (!validInput) {
  let argc = process.argv.length;
  if (argc <= 2) prgm.help();
  else if (argc <= 3) {
    switch (process.argv[2]) {
      case '-i':
      case '--interactive':
        hmj.run('text', 'STDIN');
        break;
    }
  } else {
    for (let i = 2; i < argc; ++i) {
      switch (process.argv[i]) {
        case '-f':
        case '--format':
          format = process.argv[++i];
          break;
        case '-i':
        case '--interactive':
          input = 'STDIN';
          break;
        case '-o':
        case '--output':
          output = process.argv[++i];
          break;
      }
    }
    hmj.run(format, input, output);
  }
}
