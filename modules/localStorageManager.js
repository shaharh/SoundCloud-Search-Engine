/**
 * Created by shacharhami on 19/10/2018.
 */

const ls = window.localStorage,
    historyStored = new Event('historyStored');
export default (name, payload = null) => { //get or store history in local storage according to condition
    if (payload != null) {
        ls.setItem(name, JSON.stringify(payload));
        window.dispatchEvent(historyStored);
    } else {
        return JSON.parse(ls.getItem(name));
    }
}