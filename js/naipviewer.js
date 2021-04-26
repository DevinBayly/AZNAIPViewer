<link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/leaflet.css" rel="stylesheet" />
<link href="https://raw.githubusercontent.com/ebrelsford/Leaflet.loading/master/src/Control.Loading.css" /><script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/leaflet.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-ajax/2.1.0/leaflet.ajax.min.js"></script><script src='https://raw.githubusercontent.com/ebrelsford/Leaflet.loading/master/src/Control.Loading.js'></script>
<div id="map">&nbsp;</div>
<script>
	$(document).ready(function () {
		
		var indexGroup;
		
		var map = L.map('map', {
			center: [34.35, -111.789],
			zoom:6
		});
		
		var scale = L.control.scale().addTo(map);
		
		var indexGroup = new L.layerGroup({zIndex:1}).addTo(map);
		var wmsGroup = new L.layerGroup({zIndex:2}).addTo(map);

		// ---------------------------------------------
		// CREATE AND ADD BASEMAP LAYER
		var osm_attrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
		
		var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
					attribution: osm_attrib}).on('load', function() {
						$("#map").animate({ opacity: 1 }, "slow") 
					} ).addTo(map);
				
		// ---------------------------------------------
		$(".naip_year").click(function() {
 				$(".naip_year").css({"color":"", "border":""})
 				$(this).css({"color":"#6375d1", "border":"2px solid #7c7c7c"})
				$(".naip_year").removeClass("lactive ").addClass("linactive");
				$(this).removeClass("linactive").addClass("lactive ");

				addToMap(this);
		});
		
		function removeLayers(group) {
			group.eachLayer( function (layer) {
				$(".leaflet-overlay-pane").animate(
					{ opacity : 0
					},
					{
						duration: 250,
						complete: function() { group.removeLayer(layer); }
					}
				)
			})
		}
		
		// ---------------------------------------------
		// ADD LAYERS TO MAP FUNCTION
		function addToMap(element) {
		
			removeLayers(indexGroup);
			removeLayers(wmsGroup);

			$("html, body").animate({ scrollTop: $('#naip_buttons').offset().top }, 1000);
			var id = $(element).attr("id");

			// CONSTRUCT WMS REQUEST FOR PREVIEW, IF AN IMAGERY LAYER
			if (id.includes("Imagery")) {
				wms_layer_workspace = "UniversityLibrary"
				var wmsLayer = L.tileLayer.wms('https://geo.library.arizona.edu/geoserver/ows?', {
					layers: wms_layer_workspace + ":" + id,
					format: 'image/png',
					transparent: true,
					tiled: true
				}).addTo(wmsGroup);
			};

			// construct wfs request for layers
			var rootUrl = 'https://geo.library.arizona.edu/geoserver/ows';

			var defaultParameters = {
				service: 'WFS',
				version: '1.0.0',
				request: 'GetFeature',
				typeName: 'TiledDatasetIndices:' + id,
				outputFormat: 'text/javascript',
				format_options: 'callback: getJson',
				srsName:'EPSG:4326'
			};
			
			var parameters = L.Util.extend(defaultParameters);
			
			$.ajax({
				jsonp : false,
				url: rootUrl + L.Util.getParamString(parameters),
				dataType: 'jsonp',
				jsonpCallback: 'getJson',
				success: handleJson
			});
			
			function getJson(data) {
				//console.log("callback function fired");
			}

			var defaultStyle = {
				color: "#2262CC",
				weight: 1,
				opacity: 0.3,
				fillOpacity: 0.1,
				fillColor: "#2262CC"
			}
			var hoverStyle = {
				color: "#800000",
				weight: 3,
				opacity: 1,
				fillOpacity: 0.1
			}

			var geojsonlayer;

			var layerYear = id.split("_")[2];
			var layerTheme = id.split("_")[1];
			if (layerTheme.includes("Imagery")) {
				var layerType = "Orthoimagery";
			} else {
				var layerType = "";
			}

			var layerTitle = "NAIP " + layerType + ", " + layerYear

			function handleJson(data) {
				geojsonlayer=L.geoJson(data, {
					onEachFeature: function (feature, layer) {
									layer.setStyle(defaultStyle);
									(function(layer, properties) {
										layer.on("mouseover", function(e) {
											layer.setStyle(hoverStyle);
										});
										layer.on("mouseout", function(e) {
											layer.setStyle(defaultStyle);
										});
										layer.on("click", function(e) {
											var downloadUrl = properties.downloadUrl;
console.log(downloadUrl);
											popup.html("<b style='font-size:small'>" + layerTitle +"</b><br/><br/>" +
													"<b>FILE:</b><br/>&emsp;" + properties.recordIdentifier + 
													"<br/><b>SIZE:</b><br/>&emsp;" + properties.note +
													"<br/><br/><a href='" + properties.downloadUrl + "' id='' ><button class='downloadLink'>Download</button>" );
											layer._popup.setContent(popup[0])
										})
									})(layer, feature.properties);
									layer.bindPopup(popup[0]);
								  }
				}).addTo(indexGroup);
				
				if (map.getZoom() < 16) {
					map.fitBounds(geojsonlayer.getBounds(), { animate: true, duration: 2.0, easeLinearity: 0.2});
					$(".leaflet-overlay-pane").animate({opacity:1},{duration:2000});
				}
			}
		}
	});
	

	var popup = $('<div />')

</script>
