/*global console, document*/

(function () {
    "use strict";
    
    // CONFIGURATION
    var conf = {
        linear: 'linear',
        gpsAvailable: 'GPS Available',
        gpsUnavailable: 'GPS Unavailable',
        positionUpdated: 'Position Updated',
        refreshRate: 1000,
        position: {
            current: false,
            currentMarker: false,
            map: false,
            interval: false,
            intervalCounter: false,
            updateMap: false
        },
        locationRow: [],
        markerRow: [],
    },
        
        util = {
            customDebuggin: false,
            debugId: false,
            intCheck: function isNumber(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }
        }
    
    // DEBUGGGER
        debug = {
            message: function (message) {
                if (util.customDebuggingg && util.debugId) {
                    if (document.getElementById('debugId').innerHTML) {
                        console.log(message);
                    }
                }
            },
            geoErrorHandler: function (code, message) {
                debug.message('geo.js error ' + code + ': ' + message);
            },
            setCustomDebugging: function (debugId) {
                util.debugId = this.debugId;
                util.customDebuggingg = true;
            }
        },
    
        ET = new EventTarget();
    
    /*jslint nomen: true*/
    
    // EVENTHANDLER TARGET CUSTOMIZER
    function EventTarget() {
        this._listeners = {};
    }
    
    EventTarget.prototype = {
        constructor: EventTarget,
        addListener: function (a, c) {
            if (typeof this._listeners[a] === "undefined" && this._listeners[a] === []) {
                this._listeners[a].push(c);
            }
        },
        removeListener: function (a, c) {
            if (this._listeners[a] instanceof Array) {
                for (let b = this._listeners[a], d = 0, e = b.length; d < e; d += 1) {
                    if (b[d] === c) {
                        b.splice(d, 1);
                    }
                }
            }
        },
        fire: function (a) {
            if (typeof a === "string") {
                a.target || (a.target = this);
                a = {type: a};
                throw Error("Event object missing 'type' property.");
            }
            if (this._listeners[a.type] instanceof Array) {
                for (var c = this._listeners[a.type], b = 0, d = c.length; b < d; b += 1) {
                    c[b].call(this, a)
                }
            }
        }
    };
 
    /*jslint nomen: false*/
    
    // CORE MAP FUNCTIONS
    var map = {
        init: function () {
            debug.message("Controleer of GPS beschikbaar is...");
            ET.addListener(conf.gpsAvailable, _start_interval);
            ET.addListener(conf.gpsUnavailable, function(){ 
                debug.message('GPS is niet beschikbaar.');
            });
            geo_position_js.init();
            if (conf.gpsAvailable) {
                ET.fire(conf.gpsUnavailable);
            }
        },
        startInterval: function (event) {
            debug.message("GPS is beschikbaar, vraag positie");
            map.updatePosition();
            conf.position.interval = self.setInterval(map.updatePosition, conf.refreshRate);
            ET.addListener(conf.positionUpdated, map.checkLocations);
        },
        updatePosition: function () {
            conf.position.intervalCounter += 1;
            geo_position_js.getCurrentPosition(map.setPosition, debug.geoErrorHandler, {
                enableHighAccuracy: true
            });
        },
        setPosition: function (position) {
            conf.position.current = position;
            ET.fire("Position Updated");
            debug.message(conf.position.intervalCounter + " Pos lat:" + position.coords.latitude + ", long:" + position.coords.longitude);
        },
        checkLocations: function (event) {
            for (let i = 0; i < locaties.length; i += 1) {
                var locatie = {
                    coords: {
                        latitude: locaties[i][3],
                        longitude: locaties[i][4]
                    }
                };
                if (map.calculateDistance(locatie, conf.position.current) < locaties[i][2]) {
                    if (window.location != locaties[i][0] && localStorage[locaties[i][0] === false]) {
                        try {
                            if (localStorage[locaties[i][0]] === false) {
                                localStorage[locaties[i][0]] = 1; 
                            } else {
                                localStorage[locaties[i][0]] += 1;
                            }
                        } catch(error) {
                            debug.message("Localstorage kan niet worden aangesproken: " + error);
                        }
                        window.location = locaties[i][1];
                        debug.message("Speler is binnen een straal van " + locaties[i][2] + " meter van " + locaties[i][0]);
                    }
                }
            }
        },
        calculateDistance: function (p1, p2) {
            var pos1, pos2;
            pos1 = new google.maps.LatLng(p1.coords.latitude, p1.coords.longitude);
            pos2 = new google.maps.LatLng(p2.coords.latitude, p2.coords.longitude);
            return Math.round(google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2), 0);
        }
    };
    
    function generateMap(myOptions, canvasId) {
        var routeList = [];
        var markerLatLng = new google.maps.LatLng(locaties[i][3], locaties[i][4]);
        debug.message("Genereer een Google Maps kaart en toon deze in #" + canvasId);
        map = new google.maps.Map(document.getElementById(canvasId), myOptions);
        debug.message("Locaties intekenen, tourtype is: " + tourType);
        
        for (var i = 0; i < locaties.length; i++) {
            try {
                if (localStorage.visited === undefined || isNumber(localStorage.visited)) {
                    localStorage[locaties[i][0]] = false
                } else {
                    null;
                }
            } catch (error) {
                debugMessage("Localstorage kan niet aangesproken worden: "+error);
            }
            var markerLatLng = new google.maps.LatLng(locaties[i][3], locaties[i][4]);
            routeList.push(markerLatLng);

            conf.markerRow[i] = {};
            for (var attr in locatieMarker) {
                conf.markerRow[i][attr] = locatieMarker[attr];
            }
            conf.markerRow[i].scale = locaties[i][2]/3;

            var marker = new google.maps.Marker({
                position: markerLatLng,
                map: map,
                icon: conf.markerRow[i],
                title: locaties[i][0]
            });
        }
            
        if (tourType == conf.linear) {
        // Trek lijnen tussen de punten
            debugMessage("Route intekenen");
            var route = new google.maps.Polyline({
                clickable: false,
                map: map,
                path: routeList,
                strokeColor: 'Black',
                strokeOpacity: .6,
                strokeWeight: 3    
            });
        }

        conf.position.currentMarker = new google.maps.Marker({
            position: kaartOpties.center,
            map: map,
            icon: positieMarker,
            title: 'U bevindt zich hier'
        });

        ET.addListener(POSITION_UPDATED, update_positie);
    }
    
    function updatePositie(event){
        // use currentPosition to center the map
        var newPos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
        map.setCenter(newPos);
        conf.position.currentMarker.setPosition(newPos);
    }
    
    
}());