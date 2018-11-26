var searchFormModel = Backbone.Model.extend({
    results: {},
    clientID: 'EBquMMXE2x5ZxNs9UElOfb4HbvZK95rc',
    searchTerm: '',
    nextHref: '',
    initialize: function () {
        SC.initialize({client_id: this.clientID});
    },
    search: function (searchTerm, resultsLimit) {
        this.set('searchTerm', searchTerm);
        SC.get('/tracks', {
            q: searchTerm,
            limit: resultsLimit || 6,
            linked_partitioning: 1
        }).then(function (tracks) {
            this.set('results', tracks.collection);
            this.isNextHref(tracks);
        }.bind(this));
    },
    isNextHref: function (tracks) {
        if (tracks.next_href) {
            this.set('nextHref', tracks.next_href);
        } else {
            this.set('nextHref', '');
        }
    },
    getJSON: function (url) {
        var xhr = new XMLHttpRequest();
        var model = this;
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            var status = xhr.status;
            var response = xhr.response;
            if (status == 200) {
                this.set('results', response.collection);
                this.isNextHref(response);
            }
        }.bind(this);
        xhr.send();
    }
});
var searchFormModelInstance = new searchFormModel();
var searchFormView = Backbone.View.extend({
    model: searchFormModelInstance,
    template: _.template("<input class='<%= data.inputClassName %>' " +
        "placeholder='<%= data.placeholderText %>'/>" +
        "<button type='button' class='<%= data.btnClassName %>'>" +
        "<%= data.btnText %></button>"),
    tagName: 'form',
    className: 'search-form',
    id: 'search-form',
    btnText: 'search',
    placeholderText: 'search',
    events: {
        'click .search-form__button': 'startSearch',
        'keydown .search-form__input': 'detectEnterKey'
    },
    detectEnterKey: function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.startSearch(e);
        }
    },
    startSearch: function (e) {
        var searchTerm = this.$('.' + this.inputClassName)[0].value;
        this.model.search(searchTerm);
        this.clear();
    },
    clear: function () {
        this.$('input')[0].value = '';
    },
    initialize: function () {
        this.btnClassName = this.className + '__button';
        this.inputClassName = this.className + '__input';
        this.$el.append(this.template({data: this}));
    }
});
var searchForm = new searchFormView();
var historyListModel = Backbone.Model.extend({
    localStorage: window.localStorage,
    searchTerm: '',
    limit: 6,
    initialize: function () {
        this.set('history', JSON.parse(this.localStorage.getItem('history')));
        this.listenTo(searchFormModelInstance,
            'change:searchTerm',
            function (e) {
                this.saveHistory(e.attributes.searchTerm);
                this.set('searchTerm', e.attributes.searchTerm);
            }.bind(this));
    },
    saveHistory: function (searchTerm) {
        var staticHistory = this.get('history');
        staticHistory.push(searchTerm);
        if (staticHistory.length >= this.limit) {
            staticHistory.shift();
        }
        this.localStorage.setItem('history', JSON.stringify(staticHistory));
    },
    search: function (searchTerm) {
        searchFormModelInstance.search(searchTerm);
    }
});
var historyListModelInstance = new historyListModel();
var historyListView = Backbone.View.extend({
    className: 'history-list',
    id: 'history-list',
    tagName: 'ul',
    historyList: [],
    print: function (historyList) {
        this.$el.empty();
        for (entry in historyList) {
            this.$el.append(
                '<li class="history-list__entry">' +
                historyList[entry] +
                '</li>'
            );
        }
    },
    initialize: function () {
        var model = this.model;
        this.print(model.get('history'));
        this.listenTo(model, 'change', function (e) {
            this.print(e.attributes.history);
        });
        this.$el.on('click', function (e) {
            if (e.target.className == 'history-list__entry') {
                model.search(e.target.innerHTML);
            }
        })
    }
});
var historyList = new historyListView({model: historyListModelInstance});
var searchResultsView = Backbone.View.extend({
    className: 'search-results',
    id: 'search-results',
    tagName: 'ul',
    childClassName: '__result',
    print: function (reply) {
        this.clear();
        for (result in reply.results) {
            var res = reply.results[result];
            this.$el.append('<li data-link="' + res.uri + '"' +
                ' class="' + this.className + this.childClassName + '">' +
                res.title +
                '</li>');
        }
    },
    clear: function () {
        this.$el.empty();
    },
    initialize: function () {
        this.listenTo(this.model, 'change:results', function (e) {
            this.print(e.changed);
        });
    }
});
var searchResults = new searchResultsView({model: searchFormModelInstance});
var playerView = Backbone.View.extend({
    id: 'player',
    className: 'player',
    initialize: function () {
        var view = this;
        this.model.on('change', function (e) {
            view.attachPlayerListeners();
        });
    },
    attachPlayerListeners: function () {
        $('.search-results__result').on('click', function (e) {
            this.$el.html('<h3>Loading...</h3>');
            this.embedPlayer(e.currentTarget.attributes[0].value);
        }.bind(this));
    },
    embedPlayer: function (uri) {
        SC.oEmbed(uri, {auto_play: true})
            .then(function (oEmbed) {
                $('#player').html(oEmbed.html);
            });
    }
});
var player = new playerView({model: searchFormModelInstance});
var nextBtnView = Backbone.View.extend({
    id: 'next-btn',
    className: 'next-btn',
    tagName: 'a',
    attributes: {
        'href': '#'
    },
    nextHref: '',
    btnText: 'Next',
    create: function () {
        this.$el.show();
    },
    destroy: function () {
        this.$el.hide();
    },
    initialize: function () {
        var model = this.model;
        this.destroy();
        this.$el.append(this.btnText);
        this.listenTo(model, 'change:nextHref', function (e) {
            this.nextHref = model.get('nextHref');
            if (!this.nextHref == '') {
                this.create();
            } else {
                this.destroy();
            }
        }.bind(this));
        this.$el.on('click', function (e) {
            e.preventDefault();
            if (!this.nextHref == '') {
                model.getJSON(this.nextHref);
            } else {
                this.destroy();
            }
        }.bind(this));
    },
    render: function () {
        return this;
    }
});
var nextBtn = new nextBtnView({model: searchFormModelInstance});
var appView = Backbone.View.extend({
    id: 'application',
    initialize: function () {
        this.$el.append('<div id="' + this.id + '"></div>');
        this.$('#' + this.id).append(
            searchForm.render().el,
            historyList.el,
            searchResults.el,
            player.el,
            nextBtn.el
        );
    }
});
var app = new appView({el: 'body'});