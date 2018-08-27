/*
 * Great-circle distance calculation using the haversine formula
 *
 * See: http://www.movable-type.co.uk/scripts/latlong.html
 * See also: http://en.wikipedia.org/wiki/Great-circle_distance
 */
'use strict';

function distance(lon1, lat1, lon2, lat2) {

    function toRadians(deg) {
        return deg * Math.PI / 180;
    }

    var R = 6371000; // earth radius, meters
    var φ1 = toRadians(lat1);
    var φ2 = toRadians(lat2);
    var Δφ = toRadians(lat2 - lat1);
    var Δλ = toRadians(lon2 - lon1);

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
}
