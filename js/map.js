
var southWest = new L.LatLng(38.07264,13.25765),
northEast = new L.LatLng(38.22180, 13.49370),
bounds = new L.LatLngBounds(southWest, northEast);

var base = new L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery <a href="http://cloudmade.com">CloudMade</a>'
});

var ortofoto = L.tileLayer('http://map.sitr.regione.sicilia.it/ArcGIS/rest/services/CACHED/ortofoto_ata20072008_webmercatore/MapServer/tile/{z}/{y}/{x}.jpg')

var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/c3a7f588de384e0ab3b58bf0310123fe/{styleId}/256/{z}/{x}/{y}.png',
cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';

var minimal   = L.tileLayer(cloudmadeUrl, {styleId: 22677}),
midnight  = L.tileLayer(cloudmadeUrl, {styleId: 999}),
motorways = L.tileLayer(cloudmadeUrl, {styleId: 46561});    

//inserisco controlli layer
var baseMaps = {
	"OpenStreetMap": minimal
};

var overlayMaps = {
	"Ortofoto": ortofoto
};

var map = new L.Map('map',{
	minZoom:1,
	maxZoom:18,
	crs:L.CRS.EPSG3857,
	layers: [minimal]
});




L.control.layers(baseMaps,overlayMaps).addTo(map);

map.attributionControl.addAttribution("Dati a cura di <a href='https://www.facebook.com/mazzolagiu'>Giuseppe  Mazzola</a>");

//inserisco funzione per caricare minimappa

function load_minim() {
	map.setView(map.getCenter(),map.getZoom());

	var osm2 = new L.TileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {minZoom: 0, maxZoom: 18});
	var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true,zoomLevelOffset:-5 }).addTo(map);
}

//inserisco funzione per caricare minimappa

var markers = L.markerClusterGroup({showCoverageOnHover: false,spiderfyOnMaxZoom: true});


var geoJsonLayer = L.geoJson(ma_pa, 
	{pointToLayer: function (feature, latlng) {

		if (feature.properties.CATEGORIA == 'altro') {
			var raggio = 4
			var colore = "#A6E22E"
			var icona = "./imgs/ruins-2.png"
			var myIcon = L.Icon.extend({
				iconUrl: './imgs/ruins-2.png'
			})
		}
		if (feature.properties.CATEGORIA == 'chiese') {
			var raggio = 4
			var colore = "#F92672"
			var icona = "./imgs/church-2.png"   
			var myIcon = L.Icon.extend({
				iconUrl: './imgs/church-2.png'
			})         
		}
		if (feature.properties.CATEGORIA == 'palazzi e ville') {
			var raggio = 4
			var colore = "#FD971E"
			var icona = "./imgs/palace-2.png"
			var myIcon = L.Icon.extend({
				iconUrl: './imgs/palace-2.png'
			})         
		}
		return new L.Marker(latlng, {
			icon: new myIcon({
				iconUrl: icona,
				iconSize: [32, 37],
				iconAnchor:   [16, 37],
				popupAnchor:  [0, -30] ,
				shadowUrl: "./imgs/shadow.png",
				shadowSize: [51, 37]
			})
		});
	},
	onEachFeature: function(feature, layer)
	{
		poptxt = "<strong>" + feature.properties.name + "</strong>" + "<br/>" + feature.properties.description;
		layer.bindPopup(poptxt,{
			maxWidth:300,
			maxHeight:260,
			closeButton:false,
			autoPanPadding:([0,40])
		});
	}
});
markers.addLayer(geoJsonLayer);

//controllo di geolocalizzazione

function onLocationFound(e) {
	var radius = e.accuracy / 2;

	L.marker(e.latlng).addTo(map)
	.bindPopup("Sei in un intorno di " + radius + " metri da qui").openPopup();

	L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
	alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

		//map.locate({setView: true, maxZoom: 14});
//controllo di geolocalizzazione		


map.addLayer(markers);

map.fitBounds(bounds);



window.onload = load_minim();

map.panBy([1, 1]);