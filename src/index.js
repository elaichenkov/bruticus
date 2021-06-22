function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.Identifier)
    .forEach((path) => {
      if (path.value.name === 'it') {
        j(path).replaceWith(j.identifier('test'));
        path.parentPath.value.arguments[1].params.push('{ page }');
        console.log(path.parentPath.value.arguments[1].params);
      } else if (path.value.name === 'describe') {
        j(path).replaceWith(j.identifier('test.describe'));
      } else if (path.value.name.startsWith('before') || path.value.name.startsWith('after')) {
        j(path).replaceWith(`test.${path.node.name}`);
      } else if (path.value.name === '$') {
        j(path).replaceWith(j.identifier('page.$'));
      }
    })
    .toSource();
}

module.exports = transformer;
