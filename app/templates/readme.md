# <%= moduleName %> [![Build Status](https://travis-ci.org/<%= githubUsername %>/<%= moduleName %>.svg?branch=master)](https://travis-ci.org/<%= githubUsername %>/<%= moduleName %>)

> Binary wrapper for <%= softwareName %>


## CLI

```
$ npm install --global <%= moduleName %>
```

```
$ <%= softwareName %> --help
```


## API

```
$ npm install --save <%= moduleName %>
```

```js
const execFile = require('child_process').execFile;
const <%= softwareName %> = require('<%= moduleName %>');

execFile(<%= softwareName %>, ['--version'], (err, stdout) => {
	console.log(stdout);
});
```


## License

MIT © [<%= name %>](<%= website %>)
