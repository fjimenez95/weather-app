/* URL TO USE
https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
*/
// Constants and variables

const API_KEY = '80717146996368e81a2d42142e5a5b4f'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?'
let cityName = '';

// Cached element references

const $form = $('form');
const $input = $('input[type="text"]');
const $cityName = $('#cityName');

// Event listeners
$form.on('submit', handleGetData);
// Functions

function handleGetData(event) {
    // HANDLE INPUT DATA
    // Remove default
    event.preventDefault();
    cityName = $input.val();


    // API CALL
    $.ajax(`${BASE_URL}q=${cityName}&appid=${API_KEY}&units=imperial`)
    .then(function(data) {
        console.log('Data', data);
        console.log('Longitude', data.coord.lat);
        console.log('Longitude', data.coord.lon);
    }, function(error) {
        console.log('Error', error);
    })
}