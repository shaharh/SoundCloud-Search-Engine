/**
 * Created by shacharhami on 19/10/2018.
 */

export default (url, callback) => { //general getJSON
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = () => {
        let status = xhr.status;
        status == 200 ? callback(null, xhr.response) : callback(status);
    };
    xhr.send();
}