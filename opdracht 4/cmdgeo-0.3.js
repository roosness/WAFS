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
        locatieRij: [],
        markerRow: [],
        customDebuggin: false,
        debugId: false
    },
    
    // DEBUGGGER
        debug = {
            message: function (message) {
                if (conf.customDebugging && conf.debugId) {
                    if (document.getElementById('debugId').innerHTML) {
                        console.log(message);
                    }
                }
            },
            geoErrorHandler: function (code, message) {
                debug.message('geo.js error ' + code + ': ' + message);
            },
            setCustomDebugging: function (debugId) {
                conf.debugId = this.debugId;
                conf.customDebuggin = true;
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
                a = {type: a};
//                a.target || (a.target = this);
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
                enableHighAccuracy: true;
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
                                localStorage[locaties[i][0]] = 1 
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
    
    var generateMap = function ()
    
    
}());