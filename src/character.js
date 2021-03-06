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

    function pluralRequestGenerator(path) {
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

function init() {
    console.log('HELLO FROM CHAR')
    var con = document.querySelector("#console");

    function log() {
      console.log(...arguments);

      var pre = document.createElement("pre");

      for (var arg of arguments) {
        switch (typeof arg) {
          case "string":
            pre.append(arg);
            break;
          default:
            pre.append(JSON.stringify(arg, null, 2));
        }

        pre.append(" ");
      }

      con.append(pre);
    }

    // log("load");

    // get all people
    swapiModule.getPeople().then(function(data) {
      console.log("Result of getPeople", data);
    });

    //get all people, page 2
    // swapiModule.getPeople({page: 8}).then(function(data) {
    //   console.log("Result of getPeople (page 2)", data);
    // });

    // //get one person (assumes 1 works)
    // swapiModule.getPerson(1).then(function(data) {
    //   log("Result of getPerson/1", data);
    // });

    // //get all films
    // swapiModule.getFilms().then(function(data) {
    //   log("Result of getFilms", data);
    // });

    // //get all films, page 1
    // swapiModule.getFilms({page: 1}).then(function(data) {
    //   log("Result of getFilms (page 1)", data);
    // });

    // //get one film (assumes 1 works)
    // swapiModule.getFilm(1).then(function(data) {
    //   log("Result of getFilm/1", data);
    // });

    // //get all starships
    // swapiModule.getStarships().then(function(data) {
    //   log("Result of getStarships", data);
    // });
    // //get all starships, page 2
    // swapiModule.getStarships({page: 2}).then(function(data) {
    //   log("Result of getStarships (page 2)", data);
    // });

    // //get one starship (assumes 2 works)
    // swapiModule.getStarship(2).then(function(data) {
    //   log("Result of getStarship/2", data);
    // });

    // //get all vehicles
    // swapiModule.getVehicles().then(function(data) {
    //   log("Result of getVehicles", data);
    // });
    // //get all vehicles, page 2
    // swapiModule.getVehicles({page: 2}).then(function(data) {
    //   log("Result of getVehicles (page 2)", data);
    // });

    // //get one vehicle (assumes 4 works)
    // swapiModule.getVehicle(4).then(function(data) {
    //   log("Result of getVehicle/4", data);
    // });

    // //get all species
    // swapiModule.getAllSpecies().then(function(data) {
    //   log("Result of getAllSpecies", data);
    // });
    // //get all species, page 2
    // swapiModule.getAllSpecies({page: 2}).then(function(data) {
    //   log("Result of getAllSpecies (page 2)", data);
    // });

    // //get one species (assumes 1 works)
    // swapiModule.getSpecies(1).then(function(data) {
    //   log("Result of getSpecies/1", data);
    // });

    // //get all planets
    // swapiModule.getPlanets().then(function(data) {
    //   log("Result of getPlanets", data);
    // });
    // //get all planets, page 2
    // swapiModule.getPlanets({page: 2}).then(function(data) {
    //   log("Result of getPlanets (page 2)", data);
    // });

    // //get one planet (assumes 1 works)
    // swapiModule.getPlanet(1).then(function(data) {
    //   log("Result of getPlanet/1", data);
    // });

    const url = location.search.substring(1);
    let urlParams = url ? JSON.parse('{"' + url.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) }) : null;
    let personToRender = urlParams ? urlParams.char : 1; // 1 as a temp fallback

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
                charAttrsHTML += `<li class="characters__attr characters__attr--big"><span class="attr">${attr.replace(/_/g, ' ')}</span> : ${propValue}</li>`
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
            console.log("Result of getPeople", filteredResults);
            filteredResults.forEach(element => renderCard('#char-card', element));
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