/*SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. athens,gr)*/
const form = document.querySelector(".search-div form");
const input = document.querySelector("#searchField");
const msg = document.querySelector(".search-div .msg");
const list = document.querySelector(".ajax-section .cities");
/*SUBSCRIBE HERE FOR API KEY: https://home.openweathermap.org/users/sign_up*/
const apiKey = "888a73a8b27eb54c8d1ba56ed02ec435";

form.addEventListener("submit", e => {
    e.preventDefault();
    let inputVal = input.value;

    //check if there's already a city
    const listItems = list.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);


    if (listItemsArray.length > 0) {

        const filteredArray = listItemsArray.filter(el => {
            let content = "";
            //athens,gr
            if (inputVal.includes(",")) {
                //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
                if (inputVal.split(",")[1].length > 2) {
                    inputVal = inputVal.split(",")[0];
                    content = el
                        .querySelector(".city-name span")
                        .textContent.toLowerCase();
                } else {
                    content = el.querySelector(".city-name").dataset.name.toLowerCase();
                }
            } else {
                //athens
                content = el.querySelector(".city-name span").textContent.toLowerCase();
            }
            return content == inputVal.toLowerCase();
        });

        if (filteredArray.length > 0) {
            msg.textContent = `You already know the weather for ${
                filteredArray[0].querySelector(".city-name span").textContent
            } ...otherwise be more specific by providing the country code as well 😉`;

            form.reset();
            input.focus();
            return;
        }
    }

    //ajax here
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const {coord, main, name, sys, weather} = data;
            const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
                weather[0]["icon"]
            }.svg`;

            //Check if weather item exists and replaces itself with new data
            if (document.querySelector(".cities li:last-child")) {
                const listItem = document.querySelector(".cities li:last-child");
                const li = document.createElement("li");
                li.classList.add("city");
                const markup = `
                <h2 class="city-name" data-name="${name},${sys.country}">
                  <span>${name}</span>
                  <sup>${sys.country}</sup>
                </h2>
                <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
                <figure>
                  <img class="city-icon" src="${icon}" alt="${
                    weather[0]["description"]
                }">
                  <figcaption>${weather[0]["description"]}</figcaption>
                </figure>
              `;
                li.innerHTML = markup;

                listItem.parentNode.replaceChild(li, listItem);
            } else {

                //Executes on first search for the city
                const li = document.createElement("li");
                li.classList.add("city");
                const markup = `
                <h2 class="city-name" data-name="${name},${sys.country}">
                  <span>${name}</span>
                  <sup>${sys.country}</sup>
                </h2>
                <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
                <figure>
                  <img class="city-icon" src="${icon}" alt="${
                    weather[0]["description"]
                }">
                  <figcaption>${weather[0]["description"]}</figcaption>
                </figure>
              `;
                li.innerHTML = markup;


                list.appendChild(li);
            }
            document.getElementById("map").innerHTML = `${name}, ${coord.lat}, ${coord.lon} `;  //replace with call to google map api
            //TODO create news API call
            // populateNews();


            //post coordinates
            coordinates = {
                lat: coord.lat,
                lng: coord.lon
            };
            console.log(coordinates)
            setHome(name, coord); //sets home position marker


        })
        .catch(() => {
            msg.textContent = "Please search for a valid city 😩";
        });

    msg.textContent = "";
    form.reset();
    input.focus();
});


//typeahead code reused from example provided by typeahead
//http://twitter.github.io/typeahead.js/examples/
//TODO add states into file

import citiesList from './cities.js';

console.log(citiesList);

var states = citiesList;
//
// var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
//     'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
//     'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'London',
//     'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
//     'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
//     'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
//     'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
//     'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
//     'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
// ];


// constructs the suggestion engine
var states = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    // `states` is an array of state names defined in "The Basics"
    local: states
});

$('#search-div .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'states',
        source: states
    });


// map
// Initialize and add the map
function initMap() {
    // The location of Uluru
    const uluru = {lat: 51.4541078441724, lng: 0.36448899153277886};
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: uluru,
    });
}


//displaying home marker on the map
function setHome(name, coord) {
    var myLatlng = new google.maps.LatLng(coord.lat, coord.lon);
    var mapOptions = {
        zoom: 10,
        center: myLatlng
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var marker = new google.maps.Marker({
        position: myLatlng,
        title: name
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);
    //--------------------------------

//---------------------------------------
}