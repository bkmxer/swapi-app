/**
 * @description Determines if a string is a valid https/http URL or not
 * @param {string} str The string to check
 * @return {boolean}
 */
function validURL(str) {
  let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

/**
 * @description Determines if a string is a valid Date
 * @param {string} date The string to check
 * @return {boolean}
 */
function isDate(date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

/**
 * @description Determines if a provided value is an Array
 * @param {string} arr The string to check
 * @return {boolean}
 */
function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

/**
 *
 * @description Determines if a provided value is an Array
 * @param {string} arr The string to check
 * @return {boolean}
 */
function removeElement(id) { // not in use
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}

/**
 * @description Inserts the char card
 * @param {string} template Card template ID
 * @param {object} card Character object
 * @return {void}
 */
function renderCard(template, char) {
    console.log('rendering: ', template, char);
    const t = document.querySelector(template);
    const target = document.querySelector('.characters__grid');

    // prepare data
    let charAttrsHTML = '';
    const charTestString = 'people/';
    let personToRender = char.url.substring(char.url.indexOf(charTestString) + charTestString.length, char.url.length - 1);
    console.log(personToRender)
    for (var attr in char) { // make re-usable
        let propValue = char[attr];
        if (attr != "eye_color" && attr != "name" && propValue != "" && (!isNaN(propValue) || (!validURL(propValue) && !isDate(propValue) && !isArray(propValue) && propValue != ""))) {
            charAttrsHTML += `<li class="characters__attr"><span class="attr">${attr.replace(/_/g, ' ')}</span> : ${propValue}</li>`
        }
    }

    // set
    t.content.querySelector('.characters__name').textContent = char.name;
    t.content.querySelector('.characters__attrs').innerHTML = charAttrsHTML;
    t.content.querySelector('.card__more-button').href = `./character.html?char=${personToRender}`;
    t.content.querySelector('.characters__attrs').innerHTML += `
        <li class="characters__attr" style="color: ${char.eye_color};">
        <span class="attr">${('eye_color').replace(/_/g, ' ')}</span> : ${char.eye_color}</li>`; // :D it doesn't really makes sense, just for fun
    t.content.querySelector('.characters__img-wrap').innerHTML = `
    <img src="https://starwars-visualguide.com/assets/img/characters/${personToRender}.jpg"
            alt="Characters image" class="characters__img"
            loading="lazy"
            onerror="this.onerror=null; this.src='https://starwars-visualguide.com/assets/img/placeholder.jpg';" />`;

    // add to document DOM
    let clone = document.importNode(t.content, true); // where true means deep copy
    const plchlds = document.getElementsByClassName('characters__card--placeholder');

    while (plchlds[0]) {
        plchlds[0].parentNode.removeChild(plchlds[0]);
    }

    target.append(clone);
}