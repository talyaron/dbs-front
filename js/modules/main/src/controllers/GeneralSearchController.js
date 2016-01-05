var GeneralSearchController = function($scope, $state, langManager, $stateParams, $http, apiClient, $modal, $q, $location, header, $window) {
    var self = this, params = {};
    this.$state = $state;
    this.$window = $window;
    this._collection  = ($stateParams.collection !== undefined)?$stateParams.collection:'allResults';
    this.results = {hits: []};    
    this.external_results = [];
    this.$modal = $modal;
    this.$location = $location;
    this.$http = $http;
    this.apiClient = apiClient;
    header.show_search_box();
    this.header = header;
    this.$scope = $scope;
    this.external_total = '';
    this.loading = true;
    this.loading_ext = true;
    this.google_query = "";
    this.langManager = langManager;
    this.query_words = [
        {en:'Jewish', he:'יהודי', selected: false},
        {en:'Jews', he:'יהודים', selected: false},
        {en:'Synagogue', he:'בית הכנסת', selected: false},
        {en:'Ghetto', he:'גטו', selected: false},
        {en:'Community', he:'קהילה', selected: false}
    ];

    this.collection_map = {

        allResults: {
            En: 'All results',
            He: 'כל התוצאות' 
        },
        
        places: {
            En:'Places',
            He: 'מקומות'
        },

        media: {
            En: 'Images & Videos',
            He: 'תמונות + וידאו',
            api: 'photoUnits,movies'
        },

        personalities: {
            En: 'Personalities',
            He: 'אישים'
        },

        familyNames: {
            En: 'Family names',
            He: 'שמות משפחה'
        }
    };    

    Object.defineProperty(this, 'query', {
        get: function() {
            return this.query_string;
        },

        set: function(new_query) {
            this.query_string = new_query;
            this.results = {hits: []};
        }
    });

    Object.defineProperty(this, 'collection', {
        get: function() {
            return this._collection;
        },

        set: function(new_collection) {
            this._collection = new_collection;
            $state.go('general-search', {q: this.header.query, collection: new_collection});
        }
    });
    if ($stateParams.q !== undefined) {
       header.query = this.query = $stateParams.q;
 
        $http.get(apiClient.urls.search, {params: this.api_params()})
        .success(function (r) {  
            self.results = r.hits;
            self.loading = false;
        });

        if(this.collection == 'allResults' || this.collection == 'media') {
            $http.get("http://www.europeana.eu/api/v2/search.json?wskey=End3LH3bn&rows=14&start=1", {params: this.api_params_ext()})
            .success(function(r) {
                self.external_total = r.totalResults;
                self.push_ext_items(r);
                self.loading_ext = false;
            })
        }
    };
}; 
        
GeneralSearchController.prototype = {

    push_ext_items: function(r) {
        if (r.items) {
            for (var i=0; i < r.items.length; i++) {
                var item = r.items[i];
                if (item.edmPreview)
                    this.external_results.push({thumbnail: {data: item.edmPreview[0]}, UnitType: item.type, Header: {En: item.title[0], He: item.title[0]}, url: item.guid, UnitText1: {En: item.title[1], He: item.title[1]}});
                else 
                    this.external_results.push({UnitType: item.type, Header: {En: item.title[0], He: item.title[0]}, url: item.guid, UnitText1: {En: item.title[1], He: item.title[1]}});
            }
        }
    },

    api_params: function () {
        var params = {};
        params.q = this.header.query;
        if (this.collection != 'allResults') {
            if (this.collection_map[this.collection].hasOwnProperty('api'))
                params.collection = this.collection_map[this.collection].api
            else
                params.collection = this.collection;
        }
        params.from_ = this.results.hits.length;
        return params;
    }, 

    fetch_more: function() {
        var query_string = this.query_string,
            results = this.results;

        this.$http.get(this.apiClient.urls.search, {params: this.api_params()})
        .success(function (r){
            results.hits = results.hits.concat(r.hits.hits);
        });
    }, 

    api_params_ext: function () {
        var params = {};
        params.query = this.header.query;

        if (this.collection == 'media')
            params.qf = 'TYPE:(IMAGE OR VIDEO)';
        
        params.start = this.external_results.length;
        return params;
    }, 

    fetch_more_ext: function() {
        var query_string = this.query_string,
            self = this;

        this.$http.get("http://www.europeana.eu/api/v2/search.json?wskey=End3LH3bn&rows=14", {params: this.api_params_ext()})
        .success(function (r) { self.push_ext_items(r)});

    },

    google_search: function() {
        this.$window.open('http://google.com/?q=' + this.google_query, '_blank');
    },

    google_search_on_enter:function ($event) {
        if ($event.keyCode === 13 && this.query_string.length > 1)
            this.google_search();
    },

    toggle_selected: function(word) {
        if(!word.selected && this.google_query.length > 0) {
            word.selected = true;
            this.google_query = this.google_query + '+' + word[this.langManager.lang];
        }
        else {
            word.selected = false;
            var parsed_string = [];
            parsed_string = this.google_query.split('+');
            for(var i = 0; i < parsed_string.length; i++) {
                if (parsed_string[i] === word[this.langManager.lang]) {
                    parsed_string.splice(i, 1);
                }
            }
            this.google_query = parsed_string.join("+");
        }
    },

    read_about_center: function (collection_name) {
        this.$state.go('about_center', {collection: this.collection});
    }
};

angular.module('main').controller('GeneralSearchController', ['$scope', '$state', 'langManager', '$stateParams', '$http', 'apiClient', '$modal', '$q', '$location', 'header', '$window', GeneralSearchController]);
