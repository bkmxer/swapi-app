# swapi-app
Start Wars API-base application

## Steps to run
1) Clone the REPO or download the ZIP file.
2) Run NPM i (ensure to have node env v12.13 or higher)
3) Run npm run watch (watcher) & npm run start (server)
4) open localhost with port :4200
5) See your application

Another available scripts:
-    "npm run dev" - running a dev more
-    "npm run build" - biuilding an app for prod
-    "npm run watch" - startting thee watcher
-    "npm run start" - starting webpack server

!!!NOTE: Consider changing sort option several times, the first sort result is not rellevant, to be fixed.

## Initial requirements
Create a catalogue of people in Star Wars, where you can search for people, and be able to see their extra information like what planet they’re from and what year they’re born. We would also like to know what other people come from that same planet, so that should be in there as well. Build it using modern Vanilla javaScript, HTML and SCSS and use the star wars API for content http://swapi.dev. It should have the following features:

· Display a simple catalogue of people, with filter and sort options
· People detail page with basic info, planet they’re from, and links to people also on that planet
· Mobile first and creative user interface ( This is very open, the interface should look how you want it to )
· Think about API error handling


We estimate this task to take between 6-8 hours and we will be looking for code quality, application architecture, reusability and UX.

* Clarifications
- make a catalog of all the characters that display when the page loads (or when the API call is done).
- search functionality that filters then down
- sort function (think tallest to shortest or whatever metric you really want to use).
- The click on a character, I should see a character detail page with their information. It should also show other characters from their planet that I can click on and load their character detail page.


## FURTHER ACTIONS:
- [ ] Think of Cache enhancement
- [ ] Add fallback when no results found in the recommendations
- [ ] Check sorting issue, probably related to data loading
- [ ] Do not show the same heroes already on the scree in the recommendations
- [ ] Add all the ico images for devices
- [ ] Add social links
- [ ] Better code splitting is required in between main and character pages
- [ ] IDEA: Add a wookie lang selector
- [ ] [TODO] nice to implemet the case with multiple pages on search result
- [ ] [TODO] re-do using a spread operator
- [ ] [TODO] As a possible option, this may be re-created with sort after fetching data


