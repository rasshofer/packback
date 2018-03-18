/* global test, expect */
const fs = require('fs');
const path = require('path');
const packback = require('../packback');

test('API', () => {
  expect(typeof packback).toBe('object');
  expect(typeof packback.use).toBe('function');
  expect(typeof packback.pack).toBe('function');
  expect(typeof packback.packFile).toBe('function');
});

packback.use({
  test: (filename) => /\.txt$/.test(filename),
  pattern: /include\s*(\()?(.*?)\.txt(\)?)/g,
  matcher: (matches) => `${matches[2]}.txt`
});

packback.use({
  test: (filename) => /\.html/.test(filename),
  pattern: /<!--#include file="(.*?)\.html" -->/g,
  matcher: (matches) => `${matches[1]}.html`,
  decorator: (content, file) => [`<!-- START ${path.basename(file)} -->`, content.trim(), `<!-- END ${path.basename(file)} -->`].join('\n')
});

[{
  name: 'Custom handler',
  path: 'custom-handler',
  input: 'input.txt',
  output: 'output.txt'
}, {
  name: 'Decorator',
  path: 'decorator',
  input: 'input.html',
  output: 'output.html'
}, {
  name: 'Missing handler',
  path: 'missing-handler',
  input: 'input.test',
  output: 'output.test'
}].forEach((props) => {
  test(props.name, () => {
    const input = path.resolve(__dirname, props.path, props.input);
    const output = path.resolve(__dirname, props.path, props.output);
    const packed = packback.packFile(input);

    expect(packed).toBe(fs.readFileSync(output, 'utf8'));
  });
});

test('Virtual file', () => {
  const output = path.resolve(__dirname, 'custom-handler', 'output.txt');
  const packed = packback.pack(['test1', 'include demo/test.txt', 'test4'].join('\n'), {
    file: 'virtual.txt',
    context: path.resolve(__dirname, 'custom-handler')
  });

  expect(packed).toBe(fs.readFileSync(output, 'utf8').trim());
});

test('Missing options', () => {
  expect(() => {
    packback.pack('test');
  }).toThrow();
});

test('Missing filename', () => {
  expect(() => {
    packback.pack('test', {
      context: path.resolve(__dirname, 'custom-handler')
    });
  }).toThrow();
});
