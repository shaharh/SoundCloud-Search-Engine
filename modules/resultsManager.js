/**
 * Created by shacharhami on 19/10/2018.
 */
import nextBtnManager from './nextBtnManager.js';
import loopManager from './loopManager.js';
import { embedManager } from './SCfunx.js';
import clearEl from './clearEl.js';

const resultsContainer = document.getElementById('results'),
    nextContainer = document.getElementById('next-btn');
export default (results) => { // format and print out results + event listeners
    clearEl(resultsContainer);
    let resultList = results,
        collection = resultList.collection;
    nextBtnManager(resultList.next_href, nextContainer);
    loopManager(collection, true, (c) => embedManager(c), resultsContainer);
};
