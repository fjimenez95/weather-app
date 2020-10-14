/* URL TO USE
https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
*/
// Constants and variables

const API_KEY = '80717146996368e81a2d42142e5a5b4f';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const GEO_KEY = 'pk.c59b3ca87210dbbb48916f9102e70a8a';
let cityNameInput = '';
let cityName = '';
let state = '';
let country = '';
let currentConditions = '';
let currentWeather;
let dayHigh;
let dayLow;
let currentData;
let geoData;
let fullData;

// Cached element references

const $form = $('form');
const $input = $('input[type="text"]');
const $locationName = $('#locationName');
const $currentDegree = $('#currentDegree');
const $conditionDescription = $('#conditionDescription');
const $dayHigh = $('#dayHigh');
const $dayLow = $('#dayLow');
const $currentDescriptionTitle = $('#currentConditionTitle');
const $currentTitle = $('#currentTitle');
const $highTitle = $('#highTitle');
const $lowTitle = $('#lowTitle');
const $weatherIcon = $('#weatherIcon');

// Event listeners
$form.on('submit', handleGetData);
// Functions

function handleGetData(event) {
    // HANDLE INPUT DATA
    // Remove default
    event.preventDefault();
    cityNameInput = $input.val();

    // GET CURRENT DATA - Looks up current data
    $.ajax(`${BASE_URL}weather?q=${cityNameInput}&appid=${API_KEY}&units=imperial`)
    .then(function(data) {
        currentData = data;
        defineData(true, false, false);

        // GET GEO DATA - Gets city name
        $.ajax(`https://us1.locationiq.com/v1/reverse.php?key=${GEO_KEY}&lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&format=json`)
        .then(function(data) {
            geoData = data;
            defineData(false, true, false);
        }, function(error) {
            console.log('ERROR', error);
        });

        // GET FULL DATA - Looks up full data
        $.ajax(`${BASE_URL}onecall?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&exclude=minutely,alerts&appid=${API_KEY}&units=imperial`).then(function(data) {
            fullData = data;
            defineData(false, false, true);
            // RENDER
            render();
        }, function(error) {
            console.log('ERROR', error);
        });

    }, function(error) {
        console.log('ERROR', error);
    });
}

function defineData(current, geo, full) {
    if(current) {
        // DEFINES COUNTRY
        country = currentData.sys.country;

        // DEFINES CURRENT WEATHER
        currentWeather = Math.round(currentData.main.temp);   
        
        // DEFINES CURRENT CONDITIONS
        currentConditions = currentData.weather[0].description;
    }
    if(geo) {
        // DEFINES CITY
        cityName = geoData.address.city;

        // DEFINES STATE
        state = geoData.address.state;
    }
    if(full) {
        console.log('FULL DATA - LINE 95', fullData);
        // DEFINES dayHigh
        dayHigh = Math.round(fullData.daily[0].temp.max);

        // DEFINES dayLow
        dayLow = Math.round(fullData.daily[0].temp.min);
    }

}

function render() {
    $locationName.text(`${cityName}, ${state}, ${country}`);
    $conditionDescription.text(`${currentConditions}`);
    $currentDescriptionTitle.text(`current conditions:`);
    $currentDegree.text(`${currentWeather}\u00B0`);
    $currentTitle.text(`currently:`);
    $highTitle.text(`high:`);
    $dayHigh.text(`${dayHigh}\u00B0`);
    $lowTitle.text(`low:`);
    $dayLow.text(`${dayLow}\u00B0`);
    $weatherIcon.html(`<img src="http://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" alt="${currentConditions}">`);
}


