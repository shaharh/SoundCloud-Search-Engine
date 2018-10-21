/**
 * Created by shacharhami on 19/10/2018.
 */
import clearEl from './clearEl.js';
import resultManager from './resultsManager.js';
import { storeH } from './historyManager.js';

const scPlayer = document.getElementById('player'),
    clientID = 'EBquMMXE2x5ZxNs9UElOfb4HbvZK95rc';

export const initSC = () => SC.initialize({client_id: clientID}); //initialize SC

export const embedManager = (c) => { //create callback for search results
    return () => SC.oEmbed(c, {auto_play: true})
        .then((oEmbed) => scPlayer.innerHTML = oEmbed.html);
};

export const searchSC = (t, history, params) => { //perform search
    SC.get('/tracks', {
        q: t,
        limit: params.page_size,
        linked_partitioning: 1
    }).then((tracks) => {
        clearEl(params.searchTerm);
        resultManager(tracks);
        storeH(params, history, t);
    });
};
