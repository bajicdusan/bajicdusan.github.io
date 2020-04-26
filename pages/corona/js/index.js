window.onload = () => {
    // var context = new AudioContext();

    document.querySelector('.countrys-list-container').style.display = "none";
    const input = document.querySelector('#country-input');
    input.addEventListener('input', searchCountry);

}



function noScroll() {
    window.scrollTo(0, 0);
}

var covidData;
var map;
var markers = [];
var infoWindow;
let infos = [];

// const clickSound = new Audio('sound/click.mp3');


async function initMap() {
    let res = await axios.get('https://corona.lmao.ninja/v2/countries');
    covidData = res.data;
    displayCcpVirusCountries(covidData);
    // var myLatLng = { lat: 48.155028, lng: 11.261659 };
    // var vietnamIndex = covidData.findIndex(one => one['country'] == 'Vietnam');
    // let vietnam = covidData[vietnamIndex]['country']['countryInfo'];
    let europe = { lat: 48, lng: 11 }
    map = new google.maps.Map(document.getElementById('map'), {
        center: europe,
        zoom: 5,
        mapTypeId: 'roadmap',
        styles: customGoogleMapstyles,
        // styles: customGoogleMapstyles,
        streetViewControl: false,
        zoomControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy'
    });

    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        // do something only the first time the map is loaded
        document.querySelector(".loader-container").remove();

    });

    infoWindow = new google.maps.InfoWindow();

    // var marker = new google.maps.Marker({
    //     position: myLatLng,
    //     map: map,
    //     title: 'Hello World!'
    // });
    // showcountrysMarkers();
    showCovidMarkers(covidData)

}

function displayCcpVirusCountries(countries) {
    let countrysHtml = '';
    countries.map((one, index) => {
        countrysHtml += `
            <div id=${one['countryInfo']['_id']} class="country-container" onclick="clickcountry('${one['countryInfo']['iso2']}')">
                <div class="country-info-container">
                    <div class="country-name">
                        <span>${one['country']}</span>
                        <span></span>
                    </div>
                    <div class="boundary">
                    </div>
                </div>
                <div class="country-number-container">
                    <div class="country-number">
                    <img src="${one['countryInfo']['flag']}" width="20px" height="20px"/>
                    </div>
                </div>
            </div>
        `
    })
    document.querySelector('.countrys-list').innerHTML = countrysHtml;
}

function showCovidMarkers(newCovidData) {
    // var bounds = new google.maps.LatLngBounds();
    newCovidData.map((one, index) => {
        var latlng = new google.maps.LatLng(
            one['countryInfo']['lat'],
            one['countryInfo']['long']);
        let lastUpdated = new Date(one['updated']).toLocaleDateString("vn")
        let country = one['country']
        let cases = one['cases']
        let deaths = one['deaths']
        let recovered = one['recovered']
        let id = one['countryInfo']['_id']
        let iso2 = one['countryInfo']['iso2']
        // bounds.extend(latlng);
        createCovidMarker(latlng, lastUpdated, country, cases, deaths, recovered, id, iso2)
    })
    // map.fitBounds(bounds);
}

function createCovidMarker(latlng, lastUpdated, country, cases, deaths, recovered, id, iso2) {
    let html = `
        <div class="ccp-virus-info-country-container">
            <div class="info-main-container">
                <div class="info-country">
                    ${country}
                </div>
                <div class="info-last-updated">
                    <span>last updated: </span>${lastUpdated}
                </div>
            </div>
            <div class="info-secondary-container">
                <div class="info-cases">Cases: ${cases}</div>
                <div class="info-recovered">Recovered: ${recovered}</div>
                <div class="info-death">Deaths: ${deaths}</div>
            </div>
        </div>
    `

    infos[iso2] = html;

    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: iso2 + "",
        icon: 'image/corona.png',
        abc: 'ahihi'
    });
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
        // clickSound.play();
    });
    markers.push(marker);
}

function clickcountry(index) {
    document.getElementById("country-input").value = "";
    document.querySelector('.countrys-list-container').style.display = "none";
    // clickSound.play();
    var key = index.toString();
    let selectedMarker = markers.find(one => one.label.toLowerCase() === index.toLowerCase());
    infoWindow.setContent(infos[key]);
    infoWindow.open(map, selectedMarker);
}


function searchCountry() {
    let text = document.getElementById("country-input").value;
    if (text) {
        document.querySelector('.countrys-list-container').style.display = "flex";
    } else {
        document.querySelector('.countrys-list-container').style.display = "none";
    }

    // console.log(covidData)
    let oldIndex = []
    let countriesResult = covidData.filter((one, index) => {
        if (one['country'].toLowerCase().includes(text.toLowerCase())) {
            oldIndex.push(index);
            return true;
        }
    })
    countriesResult.map((one, index) => {
        one['index'] = oldIndex[index];
    })
    // console.log(countriesResult);
    displayCcpVirusCountries(countriesResult)
    // showCovidMarkers(countriesResult)

}

// function playSong() {
//     document.querySelector("#my_song").play()
// }