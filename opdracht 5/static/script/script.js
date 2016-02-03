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
                window.addEventListener('hashchange', function (event) {
                    var route = window.location.hash;
                    sections.toggle(route);
                });
            }
        },
    
        sections = {
            toggle: function (route) {
                var section = document.querySelectorAll('section'),
                    links = document.querySelectorAll('nav ul li a');
                
//                section.forEach.classList.remove('active');
                Array.prototype.forEach.call(section, function (section) {
                    section.classList.remove('active');
                })
                
//                for (var i = 0; i < section.length; i += 1) {
//                    section[i].classList.remove('active');
//                    links[i].classList.remove('active');
//                    console.log(links);
//                }
                console.log(section);
                document.getElementById(route).classList.add('active');
            }
        };
    
    app.init();
    
}());

//(function() {
//    'use strict';
//
//    var app = {
//        init: function() {
//            routes.init();
//        }
//    };
//
//    var routes = {
//        init: function() {
//            window.addEventListener('hashchange', function(event) {
//                var route = window.location.hash;
//                sections.toggle(route);
//            });
//        }
//    };
//
//    var sections = {
//        toggle: function(route) {
//            //var sections = document.querySelectorAll('.section');
//            //[] = Array.prototype.
//            //[].forEach.call(sections, function(section) {
//            //    //section.classList.remove('active');
//            //});
//
//            //document.querySelector(route).classList.add('active');
//        }
//    };
//
//    app.init();
//
//})();