import * as $ from 'jquery'
// import json from './assets/json.json'
// import xml from './assets/data.xml'
// import csv from './assets/data.csv'
import './babel'
import './styles/styles.css'
// import './styles/less.less'
import './styles/scss.scss'

// console.log('JSON:', json)
// console.log('XML:', xml)
// console.log('CSV:', csv)

var swapiModule = (function() {
    var rootURL = "http://localhost:3000/"; // to be changed to the http://swapi.co/api/ later on, CORS issue;

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

function init() {
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

    //get all people
    // swapiModule.getPeople().then(function(data) {
    //   log("Result of getPeople", data);
    // });
    // //get all people, page 2
    // swapiModule.getPeople({page: 2}).then(function(data) {
    //   log("Result of getPeople (page 2)", data);
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
  }
