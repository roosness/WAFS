/*global console, alert, $, window, document*/

// SCRIPT.JS

(function () {
    "use strict";
    var app = {
        init: function () {
            routes.init();
        }
    },
    routes = {
        init: function () {
            window.location.hash = "1";
            window.addEventListener('hashchange', function (event) {
                var route = window.location.hash;
                sections.toggle(route);
            });
        }
    },
    
    sections = {
        toggle: function (route) {
            var section = document.querySelectorAll('section'),
                // deze links is nog ongebruikt en voor nu dus overbodig
                links = document.querySelectorAll('nav ul li a'),
                routeSplit = route.split('#');
            Array.prototype.forEach.call(section, function (section) {
                section.classList.remove('active');
            });
            document.getElementById(routeSplit[1]).classList.add('active');
        }
    };
    
    app.init();
    
}());
