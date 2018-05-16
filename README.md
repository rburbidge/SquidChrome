[![Build Status](https://semaphoreci.com/api/v1/projects/015e73fb-96c2-45a0-9589-d668b5c816f1/1545568/badge.svg)](https://semaphoreci.com/rburbidge-31/squidchrome)

# Squid Chrome Extension
The Chrome extension is built using TypeScript. The options page uses Angular 2, and the pop-up just uses jQuery. This decision was made to keep the pop-up lightweight and fast. Angular 2 was mostly used as an experiment.

## Building
Run the following from the root directory:
```
    npm install
    gulp
```
This will create an unpackaged chrome extenstion in */build*.

## Testing
Tests run in karma.
* *npm test* -- Runs tests continuously
* *npm run testSingle* -- Runs tests 

### Most-used commands
Builds end up in the /build directory.

* *npm start* -- Running watch build to keep /build updated.
* *npm test* -- Run tests.
* *gulp* -- Cleans, builds
* *gulp clean*
* *gulp watch* -- DO NOT run this task directly! Use "npm start" instead! "npm start" runs webpack watch concurrently with this.
* *gulp build:dev* -- Creates a dev build. Suitable for development. This works with localhost or remote server.
* *gulp build:prod* -- Creates a prod build.
* *gulp archive --version=x.x.x.x* -- Creates a prod build of the specified version in archive ./squid-x.x.x.x.zip.
