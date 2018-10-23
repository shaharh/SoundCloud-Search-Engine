/**
 * Created by shacharhami on 19/10/2018.
 */
import ls from './localStorageManager.js';
import clearEl from './clearEl.js';
import loopManager from './loopManager.js';
import {searchSC} from './SCfunx.js';

const historyContainer = document.getElementById('search-history'),
    cb = (x, history, params) => { //callback for printHistory
        return () => searchSC(x, history, params);
    };
export const storeH = (params, history, q) => { //format & store history in local storage
        let maximum = params.historyLength - 1;
        if (history.length > maximum) history.shift();
        history.push(q);
        ls(params.storageName, history);
    },

    getH = (name) => { //get history from local storage
        return ls(name);
    },

    printHistory = (history, params) => { // clear search field & print out history + attach event listeners
        clearEl(historyContainer);
        loopManager(history, false, (x) => cb(x, history, params), historyContainer);
    };