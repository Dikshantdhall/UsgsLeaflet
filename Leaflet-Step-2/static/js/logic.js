var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var link1 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

function chooseColor(mag){
    if(mag < 0){
        return "#e6e8cf";
    }else if(mag >=0 && mag < 1){
        return "#e8eb34";
    }else if(mag >= 1 && mag < 2){
        return "#ebd634";
    }else if(mag >= 2 && mag < 3){
        return "#b7eb34";
    }else if(mag >= 3 && mag <4){
        return "#4feb34";
    }else if(mag >= 4 && mag <5){
        return "#eba234";
    }else{
        return "#eb3d34";
    }
};


function chooseMag(mag){
    if(mag < 0){
        return 5
    }else if(mag >=0 && mag < 1){
        return  6
    }else if(mag >= 1 && mag < 2){
        return 7;
    }else if(mag >= 2 && mag < 3){
        return 8;
    }else if(mag >= 3 && mag <4){
        return 9;
    }else if(mag >= 4 && mag <5){
        return 10;
    }else{
        return 11;
    }
};

var Grayscale = L.tileLayer("https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.dark",
accessToken: API_KEY
})

var Satellite = L.tileLayer("https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.satellite",
accessToken: API_KEY
})
var Outdoors = L.tileLayer("https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.outdoors",
accessToken: API_KEY
})


var baseMaps = {
    "Satellite":Satellite,
    "Grayscale": Grayscale,
    "Outdoors":Outdoors
};


d3.json(link).then(data => {
    var earthquake = L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng,{
            radius:chooseMag(feature.properties.mag),
            fillColor:chooseColor(feature.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    },
    onEachFeature:(feature, layer) => {
        layer.bindPopup(`Place: ${feature.properties.place}<br> Magnitude: ${feature.properties.mag}</h2>`)
    }
    })
    d3.json(link1).then(d=> {
        var faultLine = L.geoJSON(d, {color:"#FFA500"})
        var overlayMaps ={
            "Fault Lines":faultLine,
            "Earthquakes":earthquake
        };

        var myMap = L.map("map", {
            center:[47.1164, -101.2996],
            zoom: 3,
            layers: [Satellite, earthquake, faultLine]
        });
        L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(myMap)
        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            mag = [0,1,2,3,4,5],
            labels = [];

        for (var i = 0; i < mag.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(mag[i]) + '"></i> ' +
                mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
        }return div;}
        legend.addTo(myMap);
    })
})
