// main.js
//
// Copyright (c) 2014 SFFilmings <gauravk92@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

$(function() {

    /**
     *  The `Movie` object encapsulates the data for a single Movie.
     *  Multiple Movie objects may have the same name, but unique
     *  GUIDs. The sync methods of a Backbone Model are overriden since
     *  we're not saving or restoring this data.
     *
     *  @class `Movie`
     *  @params {Object} A JSON Object with attributes
     *  @attr {String} guid A unique identifier
     *  @attr {String} name A movie title
     *  @attr {Int} year The production year
     *  @attr {String} address The location street address
     *  @attr {String} company The production studio's associated
     */
    var Movie = Backbone.Model.extend({
        defaults: function() {
            return {
                guid: "0",
                name: "blank name...",
                year: 0,
                address: "blank address...",
                company: "blank company..."
            }
        },
        initialize: function() {},
        idAttribute: 'guid',
        sync: function() {
            return null;
        },
        fetch: function() {
            return null;
        },
        save: function() {
            return null;
        }
    });

    /**
     *  A `MoviesCollection` encapsulates the business logic
     *  that is used to retrieve instances of the data set
     *  of Movie objects.
     *
     *  @class `MoviesCollection`
     *  @model `Movie`
     *  @note Must be created with a MovieFactory
     */
    var MoviesCollection = Backbone.Collection.extend({
        model: Movie,
        instantiate: function() {},
        /**
         * Returns just the names to use as tags in autocomplete
         *
         * @params null
         * @returns {Array} An `Array` of name strings
         */
        getMoviesList: function() {
            return _.uniq(this.pluck('name'));
        },
        /**
         * Returns a random Movie object from its collection
         *
         * @params null
         * @returns {Movie} movie a `Movie` instance
         */
        getRandomMovie: function() {
            var movie = this.at(Math.floor(Math.random() * this.length));
            return new Movie(movie.toJSON);
        },
        /**
         *  Invoked by the App to search through the Movies by title
         *
         *  @params {String} The title of a movie
         *  @returns {MoviesCollection} A `MoviesCollection` of filtered models
         */
        searchMovies: function(search) {
            var results = _.filter(this.models, function(model) {
                if (model.get('name') === search) {
                    return true;
                }
                return false;
            });
            results = _.map(results, function(model) {
                return model.toJSON();
            });
            return new MoviesCollection(results);
        },
        sync: function() {
            return null;
        },
        fetch: function() {
            return null;
        },
        save: function() {
            return null;
        }
    });

    /**
     *  The `MovieFactory` is in charge of taking input JSON
     *  from the SFData API and turning it into a MoviesCollection
     *  for the App to use.
     *
     *  @function `MovieFactory`
     *  @params {Object} The JSON Data Object returned from server
     *  @returns {MoviesCollection} MoviesCollection object containing Movie objects
     */
    var MovieFactory = function(data) {
        var Movies = new MoviesCollection;
        if ('data' in data) {
            var rows = data['data'];
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var guid = '',
                    guidIndex = 1;
                var name = '',
                    nameIndex = 8;
                var year = 0,
                    yearIndex = 9;
                var address = '',
                    addressIndex = 10;
                var company = '',
                    companyIndex = 12;
                if (guidIndex < row.length) {
                    guid = row[guidIndex];
                }
                if (nameIndex < row.length) {
                    name = row[nameIndex];
                }
                if (yearIndex < row.length) {
                    year = row[yearIndex];
                }
                if (addressIndex < row.length) {
                    address = row[addressIndex];
                }
                if (companyIndex < row.length) {
                    company = row[companyIndex];
                }
                var movie = Movies.create({
                    guid: guid,
                    name: name,
                    year: year,
                    address: address,
                    company: company
                });
            }
        }
        return Movies;
    }

    /**
     *  A `RecentSearch` contains search text and result counts
     *
     *  @class `RecentSearch`
     *  @params {Object} A JSON with class attributes
     *
     *  @attr {String} searchText The text content
     *  @attr {Int} resultCount The count of results
     *  @attr {Int} order The order searched
     */
    var RecentSearch = Backbone.Model.extend({
        defaults: function() {
            return {
                searchText: "blank search...",
                resultCount: 0,
                order: RecentSearches.nextOrder()

            }
        },
        initialize: function() {}
    });



    /**
     *  The recent searches are persisted by Local Storage
     *  This object is initialized on app start with any
     *  existing data
     *
     *  @class `RecentSearchesList`
     *  @model `RecentSearch`
     */
    var RecentSearchesList = Backbone.Collection.extend({

        // reference to this collection's model.
        model: RecentSearch,

        localStorage: new Backbone.LocalStorage("sffilmings-backbone"),

        /**
         *  We store the order with the searches and generate the next order here
         *  It could be done in a simpler manner but this will allow for
         *  flexible extensibility, currently we're only storing the result count.
         *  Each object is GUID stored in the local db store, we could also for
         *  ex. store and show the user date/time searched later, the objects
         *  are prepended to the `RecentSearchesView` instead of being reverse sorted
         */
        nextOrder: function() {
            if (!this.length) {
                return 1;
            }
            return this.last().get('order') + 1;
        },
        comparator: 'order'
    });

    /**
     *
     *  Recent Searches View
     *
     *  @class `RecentSearchView`
     *  @model `RecentSearch`
     */
    var RecentSearchView = Backbone.View.extend({
        tagName: "li",
        model: RecentSearch,
        template: JST['templates/recent-search-view-template.jst'],
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });


    /**
     *  The Results of a search are rendered by this object
     *
     *  @class `SearchResultsList`
     *  @model `Movie`
     */
    var SearchResultsList = Backbone.Collection.extend({
        model: Movie,
        idAttribute: 'guid',
        initialize: function() {},
        render: function() {
            return this;
        },
        nextOrder: function() {
            if (!this.length) {
                return 1;
            }
            return this.last().get('order') + 1;
        },
        comparator: 'order'
    });

    /**
     *  The individual search result view
     *
     *  @class `SearchResultView`
     */
    var SearchResultView = Backbone.View.extend({
        el: '#search-results',
        tagName: "li",

        template: JST['templates/search-result-view-template.jst'],

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function() {
            this.$el.append(this.template(this.model.toJSON()));
            return this;
        }
    });

    var MoviesModel;
    var MapMarkers = [];
    var RandomMarkerTimer;
    var TimerInterval = 1000;
    var SearchResults = new SearchResultsList;
    var RecentSearches = new RecentSearchesList;
    var EnterKeyCode = 13;
    var ShowingSearchResults = false;
    var SearchResultsCollection;


    /**
     *  Invoked by a setInterval Timer Object
     *
     *  @params null
     *  @returns null
     */
    function markRandomMovie() {

        if (MapMarkers.length > 100) {
            clearInterval(RandomMarkerTimer);
            RandomMarkerTimer = null;
        }

        var randMovie;
        if (ShowingSearchResults) {
            randMovie = SearchResultsCollection.getRandomMovie();
        } else {
            randMovie = MoviesModel.getRandomMovie();
        }

        var geocoder = new google.maps.Geocoder();
        var address = randMovie.get('address');
        geocoder.geocode({
            'address': address,
            'componentRestrictions': {
                'locality': 'San Francisco'
            }
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var marker = new google.maps.Marker({
                    map: MapObject,
                    animation: google.maps.Animation.DROP,
                    position: results[0].geometry.location
                });
                MapMarkers.push(marker);
                google.maps.event.addListener(marker, 'click', function() {
                    var infoWindow = new google.maps.InfoWindow({
                        content: address
                    });
                    infoWindow.open(MapObject, marker);
                });
            } else {
                console.log('Geocode was not successful for the following reason: ' + status);
            }
        });
    }


    // Main App View
    var MapView = Backbone.View.extend({
        el: "#panel",

        // Setup Event Notifications
        events: {
            "keypress #new-search": "searchOnEnter",
            "click #recents-list .view": "enterRecentSearch"
        },
        initialize: function() {

            // store reference to search view
            this.search = this.$("#new-search");

            // bind to view events
            this.listenTo(RecentSearches, 'add', this.addRecentSearch);
            this.listenTo(RecentSearches, 'reset', this.addRecentSearches);
            this.listenTo(RecentSearches, 'all', this.render);
            this.listenTo(SearchResults, 'add', this.render);
            this.listenTo(SearchResults, 'all', this.render);

            this.recentsList = this.$("#recents-list");
            this.searchResultsList = this.$("#search-results");

            // load recent searches on app start from local db
            RecentSearches.fetch();

            // load JSON data
            $.ajax({
                url: "https://data.sfgov.org/api/views/yitu-d5am/rows.json",
                cache: true,
                success: function(data, status) {

                    // process JSON data
                    MoviesModel = MovieFactory(data);

                    // start random map markers
                    RandomMarkerTimer = setInterval(markRandomMovie, TimerInterval);

                    // load autocomplete strings
                    var availableTags = MoviesModel.getMoviesList();
                    $("#new-search").autocomplete({
                        source: availableTags
                    });
                },
                error: function() {
                    alert('There was an error loading the data from sfgov.org.');
                }
            });
        },
        /**
         *  Removes all Map Markers from the map
         *
         *  @params null
         */
        removeAllMapMarkers: function() {
            var markers = MapMarkers;
            for (var i = 0; i < markers.length; i++) {
                this.removeMapMarker(markers[i]);
            }
        },
        /**
         *  Remove a Maps Marker object from the map
         *
         *  @params {Object} marker A Google Maps Marker object
         */
        removeMapMarker: function(marker) {
            marker.setMap(null);
        },
        /**
         *  Re-render
         *
         */
        render: function() {
            if (RecentSearches.length) {
                this.recentsList.show();
            } else {
                this.recentsList.hide();
            }
            return this;
        },

        /**
         *  Add a `RecentSearch` to a `RecentSearchView` and update
         *  the `RecentLists` contents
         *
         *  @params {RecentSearch} recentSearch An instance of the class `RecentSearch`
         *  @returns null
         */
        addRecentSearch: function(recentSearch) {
            var view = new RecentSearchView({
                model: recentSearch
            });
            this.recentsList.prepend(view.render().el);
        },

        /**
         *  Invoked at initialization to restore recents view
         */
        addRecentSearches: function() {
            RecentSearches.each(this.addRecentSearch, this);
        },
        /**
         *  Start a new search, add new RecentSearch
         */
        searchOnEnter: function(e) {
            if (e.keyCode != EnterKeyCode) {
                return;
            }
            var val = this.search.val();

            // validate the search
            if (!val) {
                return;
            }

            // clear random map markers activity
            clearInterval(RandomMarkerTimer);
            RandomMarkerTimer = null;
            this.removeAllMapMarkers();

            // perform search
            var searchResults = MoviesModel.searchMovies(val);
            var resultCount = searchResults.length;

            // reset current results
            SearchResults.reset();

            // load new results
            searchResults.each(function(model) {
                var view = new SearchResultView({
                    model: model
                });
                view.render();
            });

            // store as recent search
            RecentSearches.create({
                searchText: val,
                resultCount: resultCount
            });

            var model = searchResults.first().toJSON();
            $('#result-header').html(JST['templates/search-result-header-template.jst']({
                movie: model,
                resultCount: resultCount
            })).addClass('result');

            // Start displaying map markers
            ShowingSearchResults = true;
            SearchResultsCollection = searchResults;
            RandomMarkerTimer = setInterval(markRandomMovie, TimerInterval);

            // clear search field
            this.search.val('');
        },
        enterRecentSearch: function(e) {
            var text = e.currentTarget.getElementsByTagName('label')[0].textContent;
            this.search.val(text);
        }
    });

    // Initialize the App
    var App = new MapView;


});
