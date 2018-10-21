"use strict";
import * as historyManager from './modules/historyManager.js';
import { searchSC, initSC } from './modules/SCfunx.js';
(function init() {
    const searchBtn = document.getElementById('search'),
        params = {
            'page_size': 6,
            'historyLength': 5,
            'searchTerm': document.getElementById('search-term'),
            'storageName': 'search-history'
        };
    let history = [],
        init = () => { //initialize app
            initSC(); //initialize SC
            attachListeners();
            history = historyManager.getH(params.storageName) || []; //initialize history
            historyManager.printHistory(history, params); //print initial values
        },
        attachListeners = () => { //attach event listeners to static elements
            searchBtn.addEventListener('click', () => searchSC(params.searchTerm.value, history, params));
            params.searchTerm.addEventListener('keyup', (e) => {
                if (e.keyCode === 13) searchSC(params.searchTerm.value, history, params);
            });
            window.addEventListener('historyStored', () => historyManager.printHistory(history, params));
        };
    document.addEventListener('DOMContentLoaded', () => init()); //run the app
}());
