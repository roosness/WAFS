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
            customDebuggin: false,
            debugId: false,
            map: false,
            interval: false,
            intervalCounter: false,
            updateMap: false
        },
        locatieRij: [],
        markerRij: []
    };
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
            
        },
    };
    
    // DEBUGGGER
    var debug = {
        message: function (message) {
            if (conf.position.customDebugging && conf.position.debugId) {
                if (document.getElementById('debugId').innerHTML) {
                    console.log(message);
                }  
            }
        },
        geoErrorHandler: function (code, message) {
            debug.message('geo.js error ' + code + ': ' + message);
        },
        setCustomDebugging: function (debugId) {
            conf.position.debugId = this.debugId;
            conf.position.customDebuggin = true;
        }
    };
    
}());