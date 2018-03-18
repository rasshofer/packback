const fs = require('fs');
const path = require('path');

const handlers = [];

function use(config) {
  handlers.push(config);
}

function pack(content, opts) {
  if (!opts) {
    throw new Error('Missing options');
  }

  if (!opts.file) {
    throw new Error('Missing (virtual) filename');
  }

  const handler = handlers.find((item) => item.test(opts.file));

  if (!handler) {
    return content;
  }

  const context = opts.context || path.dirname(opts.file);

  return content.replace(handler.pattern, (...args) => {
    const file = path.resolve(context, handler.matcher(args));
    const replacement = fs.readFileSync(file, 'utf8');
    const packed = pack(replacement, {
      file
    });

    if (typeof handler.decorator === 'function') {
      return handler.decorator(packed, file);
    }

    return packed;
  });
}

function packFile(file) {
  const content = fs.readFileSync(file, 'utf8');

  return pack(content, {
    file
  });
}

module.exports = {
  use,
  pack,
  packFile
};
