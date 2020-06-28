// import * as $ from 'jquery'
import './styles/styles.css'
import './styles/scss.scss'
// import * as swapiModule from './swapi.js'

var swapiModule = (function() {
    var rootURL = "https://swapi.dev/api/";

    function request(url, cb) {
      return fetch(url)
        .then(function(res) {
          return res.json();
        })
        .then(function(data) {
          if (typeof cb === "function") {
            cb(data);
          }

          return data;
        })
        .catch(function(err) {
        //   console.log(err);
        });
    }

    function getResources(cb) {
      return request(rootURL, cb);
    }

    function singularRequestGenerator(path) {
      return function(id, cb) {
        return request(rootURL + path + "/" + id + "/", cb);
      };
    }

    function pluralRequestGenerator(path, q) {
      return function() {

        let queryObject = undefined;
        let cb = undefined;

        if (arguments.length > 1) {
            queryObject = arguments[0];
            cb = arguments[1];
        } else if (arguments[0]) {
            // If given exactly one argument
            if (typeof arguments[0] === "function") {
                cb = arguments[0];
                queryObject = null;
            } else {
                cb = null;
                queryObject = arguments[0];
            }
        }

        if (queryObject) {
          let searchParams = new URLSearchParams();
          for (let key of Object.keys(queryObject)) {
            let value = queryObject[key];
            searchParams.append(key, value);
          }
          return request(rootURL + path + "/?" + searchParams.toString(), cb);
        }

        return request(rootURL + path + "/", cb);

      };
    }

    return {
      getResources: getResources,
      getPerson: singularRequestGenerator("people"),
      getPeople: pluralRequestGenerator("people"),
      getFilm: singularRequestGenerator("films"),
      getFilms: pluralRequestGenerator("films"),
      getPlanet: singularRequestGenerator("planets"),
      getPlanets: pluralRequestGenerator("planets"),
      getSpecies: singularRequestGenerator("species"),
      getAllSpecies: pluralRequestGenerator("species"),
      getStarship: singularRequestGenerator("starships"),
      getStarships: pluralRequestGenerator("starships"),
      getVehicle: singularRequestGenerator("vehicles"),
      getVehicles: pluralRequestGenerator("vehicles")
    };

})();

document.addEventListener("DOMContentLoaded", init, false);
document.addEventListener("character:done", (e) => {initRecommendations(e.detail.planet)}, false) // passing the planet url via custom event

const searchInput = document.querySelector('.search__input');
const sortSelect = document.querySelector('#sort');
var direction = 1;

sortSelect.addEventListener("change", () => {
    sort(sortSelect.value, direction *= -1);
    sortSelect.blur();
});

if (searchInput) {
    const grid = document.querySelector('.characters__grid');

    import('lodash').then(_ => {
        searchInput.oninput = _.debounce(() => {
            if (searchInput.value == "") {
                initMain();
            } else {
                swapiModule.getPeople({search: searchInput.value}).then(function(data) {
                    grid.innerHTML = "";
                    if (!data.results.length) {
                        grid.innerHTML = "<h2 class='search__message--failure'>Nothing found :( May the search be with you! )</h2>"
                    } else {
                        data.results.forEach(element => renderCard('#char-card', element));
                    }
                });
            }
        }, 500);
        // [TODO] nice to implemet the case with multiple pages on search result
    });
}

function init() {
    // get all people
    // swapiModule.getPeople({search: "r2"}).then(function(data) {
    //   console.log("Result of getPeople", data);
    // });

    //get all people, page 2
    // swapiModule.getPeople({page: 8}).then(function(data) {
    //   console.log("Result of getPeople (page 2)", data);
    // });

    // //get one person (assumes 1 works)
    // swapiModule.getPerson(1).then(function(data) {
    //   log("Result of getPerson/1", data);
    // });

    const url = location.search.substring(1);
    let urlParams = url ? JSON.parse('{"' + url.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) }) : null;
    let personToRender = urlParams ? urlParams.char : 1; // 1 as a temp fallback

    if (document.getElementById("home")) {
        initMain();
    } else {
        swapiModule.getPerson(personToRender).then(function(data) {
            // console.log(`Result of getPerson/${personToRender}`, data);
            const t = document.querySelector('#character-container');
            const main = document.querySelector('main');

            // prepare data
            let planetURL = data.homeworld;
            const planetsTestString = "planets/";
            const filmsTestString = "films/";
            let planetID = planetURL.substring(planetURL.indexOf(planetsTestString) + planetsTestString.length, planetURL.length - 1);
            let charAttrsHTML = '';
            for (var attr in data) {
                let propValue = data[attr];
                if (attr != "name" && propValue != "" && (!isNaN(propValue) || (!validURL(propValue) && !isDate(propValue) && !isArray(propValue) && propValue != ""))) {
                    charAttrsHTML += `<li class="characters__attr characters__attr--${attr} characters__attr--big"><span class="attr">${attr.replace(/_/g, ' ')}</span> : <span class="characters__val--${attr}">${propValue}</span></li>`
                }
            }

            let moviesHTML = '';
            for (var movie in data.films) {
                let propValue = data.films[movie];
                let movieID = propValue.substring(propValue.indexOf(filmsTestString) + filmsTestString.length, propValue.length - 1);

                moviesHTML += `
                <li class="character__movie">
                    <img src="https://starwars-visualguide.com/assets/img/films/${movieID}.jpg" alt="Starship image"
                        class="character__movie-img"
                        loading="lazy"
                        onerror="this.onerror=null; this.src='https://starwars-visualguide.com/assets/img/placeholder.jpg';" />
                </li>`
            }

            // set
            t.content.querySelector('.character__name').textContent = data.name;
            t.content.querySelector('.character__attrs').innerHTML = charAttrsHTML;
            t.content.querySelector('.character__planets-title').innerHTML = 'Planets';
            t.content.querySelector('.character__planets-list').innerHTML = `
                <li class="character__planet"><img src="https://starwars-visualguide.com/assets/img/planets/${planetID}.jpg"
                    alt="Characters image" class="character__planet-img"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='https://starwars-visualguide.com/assets/img/placeholder.jpg';" /></li>`;;
            t.content.querySelector('.character__movies-title').innerHTML = 'Movies';
            t.content.querySelector('.character__movies-list').innerHTML = moviesHTML;


            t.content.querySelector('.character__image-container').innerHTML = `
            <img src="https://starwars-visualguide.com/assets/img/characters/${personToRender}.jpg"
                    alt="Characters image" class="character__img"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='https://starwars-visualguide.com/assets/img/placeholder.jpg';" />`;

            // add to document DOM
            let clone = document.importNode(t.content, true); // where true means deep copy
            let placeholderEl = document.getElementById('character-container-placeholder');
            placeholderEl.remove();

            main.prepend(clone);
            return data; // passing data
        }).then(function(data){
            var event = new CustomEvent('character:done', { 'detail': {'planet' : data.homeworld} });
            document.dispatchEvent(event);
        });
    }
}

async function initRecommendations(planet) {
    for (var page = 1; page < 10; page++) {
        await log(planet, page);
    }
}

async function log(planet, pageCounter) {
    return await
        swapiModule.getPeople({page: pageCounter})
        .then(function(data) {

            let filteredResults = data.results.filter(function(result){
                return result.homeworld == planet;
            });
            // console.log("Result of getPeople", filteredResults);
            filteredResults.forEach(element => renderCard('#char-card', element));
        });
}

async function initMain() {
    for (var page = 1; page < 10; page++) {
        await logAll(page);
    }
}

async function logAll(pageCounter) {
    return await
        swapiModule.getPeople({page: pageCounter})
        .then(function(data) {
            // console.log("Result of getPeople", filteredResults);
            const grid = document.querySelector('.characters__grid');
            if (pageCounter == 1) grid.innerHTML = "";
            data.results.forEach(element => renderCard('#char-card', element));
        });
}

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
 *
 * @description Sorts the DOM elements
 * @param {string} template Card template ID
 * @param {object} card Character object
 * @return {void}
 */
function sort(attrName, direction) {
    var list = document.getElementById('characters-grid');

    // [TODO] re-do using a spread operator
    var items = list.childNodes;
    var itemsArr = [];

    for (var i in items) {
        if (items[i].nodeType == 1) { // get rid of the whitespace text nodes
            itemsArr.push(items[i]);
        }
    }

    itemsArr.sort(function(a, b) {
        var valA = a.querySelector(`.characters__val--${attrName}`).innerText.trim() ? a.querySelector(`.characters__val--${attrName}`).innerText.trim() : 0;
        var valB = a.querySelector(`.characters__val--${attrName}`).innerText.trim() ? a.querySelector(`.characters__val--${attrName}`).innerText.trim() : 0;

        console.log(valA, valB);
        return valA == valB
                ? 0
                : (valA > valB ? 1 : -1);
    });

    console.log(itemsArr);

    for (i = 0; i < itemsArr.length; ++i) {
        list.appendChild(itemsArr[i]);
    }
}

/**
 *
 * @description Inserts the char card
 * @param {string} template Card template ID
 * @param {object} card Character object
 * @return {void}
 */
function renderCard(template, char) {
    // console.log('rendering: ', template, char);
    const t = document.querySelector(template);
    const target = document.querySelector('.characters__grid');

    // prepare data
    let charAttrsHTML = '';
    const charTestString = 'people/';
    let personToRender = char.url.substring(char.url.indexOf(charTestString) + charTestString.length, char.url.length - 1);
    // console.log(personToRender)
    for (var attr in char) { // make re-usable
        let propValue = char[attr];
        if (attr != "eye_color" && attr != "name" && propValue != "" && (!isNaN(propValue) || (!validURL(propValue) && !isDate(propValue) && !isArray(propValue) && propValue != ""))) {
            charAttrsHTML += `<li class="characters__attr characters__attr--${attr}"><span class="attr">${attr.replace(/_/g, ' ')}</span> : <span class="characters__val--${attr}">${propValue}</span></li>`
        }
    }

    // set
    t.content.querySelector('.characters__name').textContent = char.name;
    t.content.querySelector('.characters__attrs').innerHTML = charAttrsHTML;
    t.content.querySelector('.card__more-button').href = `./character.html?char=${personToRender}`;
    t.content.querySelector('.characters__attrs').innerHTML += `
        <li class="characters__attr  characters__attr--${'eye_color'}" style="color: ${char.eye_color};">
        <span class="attr">${('eye_color').replace(/_/g, ' ')}</span> : <span>${char.eye_color}</span></li>`; // :D it doesn't really makes sense, just for fun
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