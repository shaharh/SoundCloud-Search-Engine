/**
 * Created by shacharhami on 19/10/2018.
 */

export default (coll, prop, cbFunc, container) => { //used to print out dynamic data & attach callback functions for 'click' event
    let c = '',
        cb;
    for (let i = 0; i < coll.length; i++) {
        let a = document.createElement('li'),
            b;
        if (prop) {
            prop.forEach((el) => {
                if (prop.indexOf(el) % 2 === 0) {
                    b = coll[i][el];
                } else {
                    c = coll[i][el];
                    cb = cbFunc(c);
                }
            });
        } else {
            b = coll[i];
            cb = cbFunc(b);
        }
        a.append(b);
        a.addEventListener('click', cb);
        container.appendChild(a);
    }
}