# Squid Chrome Extension
The Chrome extension is built using TypeScript. The options page uses Angular 2, and the pop-up just uses jQuery. This decision was made to keep the pop-up lightweight and fast. Angular 2 was mostly used as an experiment.

## Building
Run the following from */chromextension*:
```
    npm install
    gulp
```
This will create an unpackaged chrome extenstion in */chromeextension/build*.

### Most-used gulp commands
* *gulp* -- Cleans, builds
* *gulp clean*
* *gulp zip* -- Cleans, builds, and creates zipped build in */chromeextension/build/archive.zip*
* *gulp ziponly* -- Only the zip step from above

## Known Issues
* The unit tests, run by *npm test*, do not work