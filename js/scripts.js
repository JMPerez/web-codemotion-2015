(function($) {
    'use strict'
    $(document).ready(function() {

        if ($(window).scrollTop() >= 100) {
            $('#top-section').addClass('after-scroll');
            $('#top-section .logo').removeClass('logo-light').addClass('logo-dark');
        }

        var didScroll = false;

        $(window).scroll(function() {
            didScroll = true;
        });

        setInterval(function() {
            if (didScroll) {
                didScroll = false;
                var scroll = $(this).scrollTop();
                var header = $('#top-section');
                var logo = $('#top-section .logo');

                if (scroll >= 10) {
                    header.addClass('after-scroll');
                    logo.removeClass('logo-light').addClass('logo-dark');
                } else {
                    header.removeClass('after-scroll');
                    logo.removeClass('logo-dark').addClass('logo-light');
                }
            }
        }, 250);

        $(function() {
            $('a[href*=#]:not([href=#])').click(function() {
                if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    if (target.length) {
                        $('html,body').animate({
                            scrollTop: target.offset().top
                        }, 1000);
                        return false;
                    }
                }
            });
        });
        $(function() {
            $('a[href=#]').click(function() {
                event.preventDefault();
            });
        });

        var $dropdown = $('.top-section .f-dropdown');
        var $menu = $('.top-section .menu');

        var hide = function() {
            $dropdown.removeClass('open');            
            document.removeEventListener("click", hide);
        }

        var show = function(e) {
            e.stopPropagation();
            $dropdown.toggleClass('open');
            document.addEventListener("click", hide);
        }

        $menu[0].addEventListener("click", show);

    });
    
    // Google maps static
    if (typeof staticGoogleMaps !== 'undefined') {
        $('#canvas-map').addClass('image-section').css('background-image','url(http://maps.googleapis.com/maps/api/staticmap?zoom=14&center=' + mobileCenterMapCoordinates +'&size=' + $(window).width() + 'x700&scale=2&language=en&markers=icon:' + icon +'|'+ eventPlaceCoordinates +'&maptype=roadmap&style=visibility:on|lightness:40|gamma:1.1|weight:0.9&style=element:labels|visibility:off&style=feature:water|hue:0x0066ff&style=feature:road|visibility:on&style=feature:road|element:labels|saturation:-30)');
    }

    //Google maps
    var canvasMap = document.getElementById('canvas-map');
    if (googleMaps && canvasMap) {
        var map;
        var markers = [];
        var MY_MAPTYPE_ID = 'custom_style';

        var initialize = function() {

            var zoomedOpts = [{
                stylers: [{
                    lightness: 40
                }, {
                    visibility: 'on'
                }, {
                    gamma: 1.1
                }, {
                    weight: 0.9
                }]
            }, {
                elementType: 'labels',
                stylers: [{
                    visibility: 'off'
                }]
            }, {
                featureType: 'water',
                stylers: [{
                    color: '#5dc7ff'
                }]
            }, {
                featureType: 'road',
                stylers: [{
                    visibility: 'on'
                }]
            }, {
                featureType: 'road',
                elementType: "labels",
                stylers: [{
                    saturation: -30
                }]
            }];

            var mapOptions = {
                zoom: 17,
                minZoom: 2,
                scrollwheel: false,
                panControl: false,
                draggable: true,
                zoomControl: false,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_TOP
                },
                scaleControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                center: centerMap,
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
                },
                mapTypeId: MY_MAPTYPE_ID
            };
            if ($(window).width() < 640) {
                mapOptions.center = mobileCenterMap;
            }

            map = new google.maps.Map(canvasMap, mapOptions);
            var marker = new google.maps.Marker({
                position: eventPlace,
                animation: google.maps.Animation.DROP,
                icon: icon,
                map: map
            });
            markers.push(marker);
            var zoomedMapOptions = {
                name: 'Zoomed Style'
            };
            var zoomedMapType = new google.maps.StyledMapType(zoomedOpts, zoomedMapOptions);
            map.mapTypes.set('zoomed', zoomedMapType);
            map.setMapTypeId('zoomed');

        }

        google.maps.event.addDomListener(window, 'load', initialize);
    }

})(jQuery);
