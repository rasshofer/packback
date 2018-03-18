# Packback

> A simple tool to bundle files (= pack back multiple files into a single file)

[![Build Status](https://travis-ci.org/rasshofer/packback.svg)](https://travis-ci.org/rasshofer/packback)
[![Coverage Status](https://coveralls.io/repos/github/rasshofer/packback/badge.svg)](https://coveralls.io/github/rasshofer/packback)
[![Dependency Status](https://david-dm.org/rasshofer/packback/status.svg)](https://david-dm.org/rasshofer/packback)
[![Dependency Status](https://david-dm.org/rasshofer/packback/dev-status.svg)](https://david-dm.org/rasshofer/packback)

## Usage

```shell
npm install --save-dev packback
```

```js
const packback = require('packback');

const packed = packback.packFile('./src/input.html');

fs.writeFileSync('./build/packed.html', packed);
```

```js
const packback = require('packback');

const packed = packback.pack(`
  Lorem ipsum
  include test.pug
  Lorem ipsum
`, {
  file: 'dummy.txt',
  context: __dirname
});

fs.writeFileSync('./build/packed.html', packed);
```

## Handlers

Packback enables the use of handlers to process files. You can easily write your own handlers by providing the following options/properties. In addition, you can find pre-built handlers on [npm](https://www.npmjs.com/browse/keyword/packback).

### Options

#### `test`

A callback function that returns whether the handler is appropriate for a fetched file or not.

Example: `(filename) => /\.txt$/.test(filename)`

#### `pattern`

A regular expression to find matches within the file content.

Example: `/include\s*(\()?(.*?)\.txt(\)?)/g`

#### `matcher`

A callback function that is called for each match and returns the real file name for further processing. This may be useful in case the import statement conceals some parts of the real filename (like Node.js does with the optional `.js` file extension for `require` calls).

Example: ``(matches) => `${matches[2]}.txt` ``

#### `decorator` (optional)

A callback function that is called for each match just before inserting the content into the overall bundle. This may be useful to implement further processing of contents (like implementing debugging markers).

Example: ``(content, file) => [`<!-- START ${path.basename(file)} -->`, content.trim(), `<!-- END ${path.basename(file)} -->`].join('\n')``

### Example

```js
const packback = require('packback');

packback.use({
  test: (filename) => /\.html/.test(filename),
  pattern: /<!--#include file="(.*?)\.html" -->/g,
  matcher: (matches) => `${matches[1]}.html`,
  decorator: (content, file) => [`<!-- START ${path.basename(file)} -->`, content.trim(), `<!-- END ${path.basename(file)} -->`].join('\n')
});

const packed = packback.packFile('./src/input.html');

fs.writeFileSync('./build/packed.html', packed);
```

## Changelog

* 2.0.0
  * Initial version

## License

Copyright (c) 2018 [Thomas Rasshofer](http://thomasrasshofer.com/)  
Licensed under the MIT license.

See LICENSE for more info.
