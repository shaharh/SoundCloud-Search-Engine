/**
 * Created by shacharhami on 19/10/2018.
 */

export default (coll, prop, cbFunc, container) => { //used to print out dynamic data & attach callback functions for 'click' event
    let b = '',
        c = '',
        cb = '',
        img = '';
    const dataLoop = () => {
            for (let i = 0; i < coll.length; i++) {
                const keys = Object.keys(coll[i]);
                if (prop) {
                    for (const key in keys) {
                        const currVal = coll[i][keys[key]];
                        switch (keys[key]) {
                            case 'title' :
                                b = currVal;
                                break;
                            case 'uri' :
                                c = currVal;
                                cb = cbFunc(c);
                                break;
                            case 'artwork_url' :
                                img = currVal;
                                break;
                        }
                    }
                } else {
                    b = coll[i];
                    cb = cbFunc(b);

                }
                createListItem(b, cb, img);
            }
        },
        createListItem = (b, cb, img) => {
            let a = document.createElement('li');
            if (img && img != '') {
                a.appendChild(createImg(img));
            }
            a.append(b);
            a.addEventListener('click', cb);
            container.appendChild(a);
        },
        createImg = (img) => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute("src", img);
            return imgEl;
        };
    dataLoop();
}