/**
 * Created by shacharhami on 19/10/2018.
 */
import getJSON from './getJSON.js';
import resultManager from './resultsManager.js';

export default (next) => { //manage creation / destruction of 'next' button
    let nextBtn = document.getElementById('nextBtn');
    if (nextBtn == null && next != null) {
        let el = document.createElement('a'),
            btnText = 'next';
        el.id = 'nextBtn';
        el.append(btnText);
        app.appendChild(el);
        attachListener(el);
    } else if (nextBtn != null && next == null) {
        app.removeChild(nextBtn);
    } else if (nextBtn != null && next != null) {
        let oldEl = nextBtn,
            newEl = oldEl.cloneNode(true);
        oldEl.parentNode.replaceChild(newEl, oldEl);
        attachListener(newEl);
    }
    function attachListener(x) {
        x.addEventListener('click', () => {
            getJSON(next, (err, data) => {
                err != null ? console.error(err) : resultManager(data);
            });
        });
    }
}