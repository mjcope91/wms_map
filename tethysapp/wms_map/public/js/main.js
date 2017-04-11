var app;

require(["esri/Color",
              "esri/layers/ArcGISDynamicMapServiceLayer",
              "esri/layers/ArcGISTiledMapServiceLayer",
              "esri/map",
              "esri/graphic",
              "esri/graphicsUtils",
              "esri/tasks/Geoprocessor",
              "esri/tasks/FeatureSet",
              "esri/tasks/LinearUnit",
              "esri/symbols/SimpleMarkerSymbol",
              "esri/symbols/SimpleLineSymbol",
              "esri/symbols/SimpleFillSymbol",

              "esri/toolbars/draw",
              "dojo/parser", "dijit/registry",

              "dijit/layout/BorderContainer", "dijit/layout/ContentPane", 
              "dijit/form/Button", "dijit/WidgetSet", "dojo/domReady!"
              ],
        function(Color, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, Map, Graphic, graphicsUtils, 
          Geoprocessor, FeatureSet, LinearUnit, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
          Draw, parser,registry){

            var map, gp;
            var featureSet = new FeatureSet();

            parser.parse();

        map = new Map("map", {
          basemap: "streets",
          center: [-111.57, 40.18], //center at -15.469, 36.428 zooom: 3
          zoom: 12
        });

      var layer;
      layer = new ArcGISDynamicMapServiceLayer("http://geoserver.byu.edu:6080/arcgis/rest/services/Michael_Cope/DEM/MapServer");
      map.addLayer(layer);               

        map.on("load", createToolbar);

        // loop through all dijits, connect onClick event
        // listeners for buttons to activate drawing tools
        registry.forEach(function(d) {
          // d is a reference to a dijit
          // could be a layout container or a button
          if ( d.declaredClass === "dijit.form.Button" ) {

            d.on("click", activateTool);
          }
        });
///***How to clear old polygon graphics/DEM before drawing new polygon
        function activateTool() {
          var tool = this.label.toUpperCase().replace(/ /g, "_");
          toolbar.activate(Draw[tool]);
          map.hideZoomSlider();
        }

        function createToolbar(themap) {
          toolbar = new Draw(map);
          toolbar.on("draw-end", addToMap);
        }

        function addToMap(evt) {
          var symbol;
          toolbar.deactivate();
          map.showZoomSlider();
          switch (evt.geometry.type) {
            case "point":
            case "multipoint":
              symbol = new SimpleMarkerSymbol();
              break;
            case "polyline":
              symbol = new SimpleLineSymbol();
              break;
            default:
              symbol = new SimpleFillSymbol();
              break;
          }
          var graphic = new Graphic(evt.geometry, symbol);
          map.graphics.add(graphic);
        }

            gp = new Geoprocessor("http://geoserver.byu.edu:6080/arcgis/rest/services/Michael_Cope/Mining/GPServer/Mining");
            console.log(gp)
            gp.setOutputSpatialReference({
              wkid: 102100
            });
            //map.on("click", addPoint);

//           function addPoint(evt) {
//             map.graphics.clear();
//             var pointSymbol = new SimpleMarkerSymbol();
//             pointSymbol.setSize(14);
//             pointSymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1));
//             pointSymbol.setColor(new Color([0, 255, 0, 0.25]));

//             var graphic = new Graphic(evt.mapPoint, pointSymbol);
//             map.graphics.add(graphic);

          //   var features = [];
          //   features.push(graphic);
          //   featureSet.features = features;
          // }

///*******Question: getting the job to run correctly and produce results
          function run_service() {
            var params = {
              //"Input_raster_or_feature_pour_point_data": featureSet
              "polygon": map.graphics.graphics[1].geometry.rings[0]
             };
            gp.submitJob(params, completeCallback, statusCallback);
          }

          function statusCallback(jobInfo) {
            console.log(jobInfo.jobStatus);
            if (jobInfo.jobStatus === "esriJobSubmitted") {
              $("#volstatus").html("<h7 style='color:blue'><b>Job submitted...</b></h7>");
            } else if (jobInfo.jobStatus === "esriJobExecuting") {
                $("#volstatus").html("<h7 style='color:red;'><b>Calculating...</b></h7>");
            } else if (jobInfo.jobStatus === "esriJobSucceeded") {
                $("#volstatus").html("<h7 style='color:green;'><b>Succeed!</b></h7>");
            }
          }

          function completeCallback(jobInfo) {
            console.log("getting data");
            gp.getResultData(jobInfo.jobId, "volume", displayResults);
          }

///**** How to display results? (populate a field on the Tethys menu vs popup, new DEM)
          function displayResults(result) {


          }
//           function displayWatershed(result, messages) {
//               var polySymbol = new SimpleFillSymbol();
//               polySymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 0.5]), 1));
//               polySymbol.setColor(new Color([255, 127, 0, 0.7]));
//               var features = result.value.features;
//               for (var f = 0, fl = features.length; f < fl; f++) {
//                   var feature = features[f];
//                   feature.setSymbol(polySymbol);
//                   map.graphics.add(feature);
//               }
//               map.setExtent(graphicsUtils.graphicsExtent(map.graphics.graphics), true);
//           }

          //adds public functions to variable app
          app = {run_service: run_service};
    });