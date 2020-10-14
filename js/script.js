// WEATHER APPLICATION TO PROVIDE LOCAL OR USER DEFINED WEATHER DATA
// FREDDY JIMENEZ

// ***** CONSTANTS AND VARIABLES *****

const {
    openWeatherAPIKey,
    geoLocationAPIKey,
} = CONFIG;

const API_KEY = openWeatherAPIKey;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const GEO_KEY = geoLocationAPIKey;
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
let currentLon;
let currentLat;

// ***** CACHED ELEMENT REFERENCES *****

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
const $currentLocation = $('#currentLocation');

// ***** EVENT LISTENERS *****
$form.on('submit', handleGetData);
$currentLocation.on('click', getLocation);

// ***** FUNCTIONS *****

function handleGetData(event) {
    if (event) {
        event.preventDefault();
    }
    // CHECK IF USER SELECTED CURRENT LOCATION OR PROVIDED AN INPUT        
    if (currentLat) {
    // CALLS GEO PLUGIN TO CHECK CITY IF CURRENT LOCATION IS SELECTED
    cityNameInput = geoplugin_city();    
    } else {
        // PREVENTS PAGE FROM REFRESHING AFTER SELECTING SUBMIT ON FORM
        event.preventDefault();
        // HANDLE INPUT DATA
        cityNameInput = $input.val();
    }

    // GET CURRENT DATA - Looks up current weather data by city name and provides lat/lon for GeoData call and FullData call
    $.ajax(`${BASE_URL}weather?q=${cityNameInput}&appid=${API_KEY}&units=imperial`)
    .then(function(data) {
        currentData = data;
        // Defines variables from this dataset in defineData functions
        defineData(true, false, false);

        // GET GEO DATA - Gets city and state name
        $.ajax(`https://us1.locationiq.com/v1/reverse.php?key=${GEO_KEY}&lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&format=json`)
        .then(function(data) {
            geoData = data;
            // Defines variables from this dataset in defineData functions
            defineData(false, true, false);
        }, function(error) {
            console.log('ERROR', error);
        });

        // GET FULL DATA - Looks up full weather data (current, daily, hourly) based on lat/lon
        $.ajax(`${BASE_URL}onecall?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&exclude=minutely,alerts&appid=${API_KEY}&units=imperial`).then(function(data) {
            fullData = data;
            // Defines variables from this dataset in defineData functions
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
    // PROVIDES ERROR IF NO CITY/STATE COMES BACK FROM API CALL
    if (!cityName || !state) {
    $locationName.text(`excuse us - there was a technical error. please try again :(`);
    } else {
    // FULL RENDER IF CITY/STATE IS PROVIDED BACK FROM API CALL
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
}

// OBTAINS CURRENT LOCATION OF USER
function getLocation() {
    currentLat = geoplugin_latitude();
    currentLon = geoplugin_longitude();
    handleGetData();
}