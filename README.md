[![Build Status](https://semaphoreci.com/api/v1/projects/015e73fb-96c2-45a0-9589-d668b5c816f1/1545568/badge.svg)](https://semaphoreci.com/rburbidge-31/squidchrome)

# Squid Chrome Extension
The Chrome extension is built using TypeScript. The options page uses Angular 2, and the pop-up just uses jQuery. This decision was made to keep the pop-up lightweight and fast. Angular 2 was mostly used as an experiment.

## Building
Run the following from */chromextension*:
```
    npm install
    gulp
```
This will create an unpackaged chrome extenstion in */chromeextension/build*.

## Testing
Tests run in karma.
* *npm test* -- Runs tests continuously
* *npm run testSingle* -- Runs tests 

### Most-used gulp commands
* *gulp* -- Cleans, builds
* *gulp clean*
* *gulp zip* -- Cleans, builds, and creates zipped build in */chromeextension/build/archive.zip*
* *gulp ziponly* -- Only the zip step from above
