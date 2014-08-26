# SFFilmings

An MVC single page webapp for mapping and searching filming locations in San Francisco.

## Blur Filter Credits

See `http://codepen.io/FWeinb/pen/Dfoaw` for original example

Only Desktop Safari and Chrome Canary with experimental features on currently support this. (08/2014)

## Installation

The development is largely dependent on Front End HTML5, CSS3, and 'MV' Javascript. A few libraries are imported, notably BackBone, BackBone LocalStorage adaptor, jQuery, and jQuery UI.Autocomplete. The manual deployment consists of a simple node Express application to static route requests to the `public` folder. The app is designed to use Parse for static hosting, at sffilmings.parseapp.com.

To get started with installing the node dependencies from the `package.json` don't forget to run the command:

    $ npm install

To simply start a server run command:

    $ node app.js -p 9000

And navigate your browser to `http://localhost:9000/`
       
The Production deployment is through Parse

    $ grunt deploy
    
## Setup

You may need to install grunt-cli globally if you already haven't:

    $ npm install -g grunt-cli
    
## Running tests from a command line

SFFilmings includes a set of Test Specs written in Jasmine within the specs subdirectory:

    $ grunt jasmine

### Testing setup

You may need to install phantomjs for headless testing manually if the Jasmine package does not install it successfully

For example, on Mac:

    $ brew install phantomjs

## Development

All files are beautified at build time, BackBone view templates (JST files) are compiled, and all Jasmine Specs are run:

    $ grunt build
    
Live building can be accomplished with:

    $ grunt watch
    
This will run the build step on a file save (may not work for html editing, future improvement).

## Contact

Follow Gaurav Khanna on Twitter ([@gauravk92](https://twitter.com/gauravk92))

## Future Improvements

- More tests
- More detailed information when clicking a pin in the map: showing movie cover image, actors images, and possibly nearby films for those actors, or related movies
- Image Atlasing and tools like Image Optim or ImageMin could be utilized in a Grunt task if more extensive usage of movie covers or image assets slows down rendering/updating
- Custom autocomplete UI to fit with theme
- profile bottlenecks and reuse more Objects through pooling instead of always create/destroy
- Setup bower components when it's more mature and the imported dependencies become more time consuming to manage manually
- Setup Theseus debug environment with Grunt if Back End processing becomes more extensive
- Cleanup Gruntfile.js, use header variables throughout to isolate the implementation details
- Setup livereload in a more robust manner, using grunt-inject, its current implementation is finicky and it may not function at all
- Minify and concat with UglifyJS and serve source maps

## License

SFFilmings is available under the MIT license. See the LICENSE file for more info.