/* external https://www.largeformatphotography.info/sunmooncalc/AzAltDistCommon.js */

/*
 ************************************************************
    common functions for Google Maps Az/Alt/Distance tool

    Copyright 2012, 2014, 2015, 2018 Jeff Conrad
 ************************************************************
*/


Math.PI2 = 2 * Math.PI;

Math.cube = function(x)
{
    return x * x * x;
};

Math.square = function(x)
{
    return x * x;
};

Number.prototype.setRange = function(y)
{
    var x = this;

    x %= y;
    if (x < 0)
	x += y;
    return x;
};

// convert feet to meters
Number.prototype.FTtoM = function()
{
    return this * 0.3048;
};

// convert meters to feet
Number.prototype.MtoFT = function()
{
    return this / 0.3048;
};

// convert decimal degrees to radians
Number.prototype.DtoR = function()
{
    return this * Math.PI / 180;
};

// convert radians to decimal degrees
Number.prototype.RtoD = function()
{
    return this * 180 / Math.PI;
};

String.prototype.trim = trim;
String.prototype.getHemisphere = getHemisphere;
String.prototype.isPackedDMS = isPackedDMS;
String.prototype.packedDMSto = packedDMSto;
String.prototype.cleanDMS = cleanDMS;
String.prototype.DMSto = DMSto;

// convert DMS value with N|S|E|W hemisphere flag to signed value
function getHemisphere(type)
{
    var
	angle = this.toString().trim(),
	sign = 1;

    if (angle.search(/[NESW]/i) < 0)	// no hemisphere indicator
	return angle;
    // negative value not allowed w/hemisphere indicator; don't change
    // anything, and let DMSto() generate an error
    else if (angle.search(/^-/) >= 0)
	return angle;

    else if (type == "lat") {
	if (angle.search(/^[NS]/i) >= 0) {		// prepended N|S
	    if (angle.search(/^S/i) >= 0)
		sign = -1;
	    angle = angle.replace(/^[NS]\s*/i, "");
	}
	else if (angle.search(/[NS]$/i) >= 0) {		// appended N|S
	    if (angle.search(/S$/i) >= 0)
		sign = -1;
	    angle = angle.replace(/\s*[NS]$/i, "");
	}
    }
    else if (type == "lon") {
	if (angle.search(/^[EW]/i) >= 0) {		// prepended E|W
	    if (angle.search(/^W/i) >= 0)
		sign = -1;
	    angle = angle.replace(/^[EW]\s*/i, "");
	}
	else if (angle.search(/[EW]$/i) >= 0) {		// appended E|W
	    if (angle.search(/W$/i) >= 0)
		sign = -1;
	    angle = angle.replace(/\s*[EW]$/i, "");
	}
    }
    // if an invalid flag is given, it will remain and cause DMSto() to
    // return NaN

    if (sign < 0)
	angle = "-" + angle;

    return angle;
}

function isPackedDMS(type)
{
    var angle, is_packed_dms;

    // ignore the sign for this test
    angle = this.toString().trim().replace(/^-/, "");

    if (arguments.length < 1)
	type = "unspecified";

    switch (type) {
	case "lat":
					    // [d]dmmss[.ss...]
	    if (angle.search(/^\d{5,6}(\.\d*)?$/) >= 0)
		is_packed_dms = true;
	    else
		is_packed_dms = false;
	    break;
	case "lon":
	case "unspecified":
					    // [dd]dmmss[.ss...]
	    if (angle.search(/^\d{5,7}(\.\d*)?/i) >= 0)
		is_packed_dms = true;
	    else
		is_packed_dms = false;
	    break;
	default:
	    is_packed_dms = false;
	    alert("invalid type: " + type);
	    break;
    }

    return is_packed_dms;
}

// convert packed DMS to colon-separated DMS
function packedDMSto()
{
    var angle = this.toString().trim();

    return angle.replace(/(\d{2})(\d{2})(\.|$)/, ":" + "$1" + ":" + "$2" + "$3");
}

// get rid of most degree, minute, second indicators and convert to
// colon delimited DMS
function cleanDMS()
{
    var pat_deg, pat_min, pat_sec, pattern;

	// degree symbol (U+00b0, #176)
    pat_deg = "(\\d{1,2}(\\.\\d*)?)\\u00b0\\s*";
	// prime (U+0032) or ASCII apostrophe
    pat_min = "(\\d{1,2}(\\.\\d*)?)[\\u2032\']\\s*";
	// double prime (U+2033), ASCII double quote, or two ASCII apostrophes
    pat_sec = "(\\d{1,2}(\\.\\d*)?)([\\u2033\"]|\'{2})";

    pattern = RegExp(pat_deg + "(" + pat_min + "(" + pat_sec + ")?" + ")?");

    return this.replace(pattern, "$1:$4:$7");
}

// convert colon-separated DMS value ([dd]d:mm:ss[.ss...] or [dd]d:m[.mm]...) to decimal
// decimal value ([dd]d[.dd...]) is returned unchanged
function DMSto()
{
    var
	msg,
	angle,
	d_angle,
	sign,
	temparr;

    angle = this.toString().trim();
    // get rid of most degree, minute, second indicators
    angle = angle.cleanDMS();
    if (angle.search(/:/) < 0)
	angle = angle.replace(/\s+(\S)/g, ":$1");	// convert spaced DMS to colon-separated
    temparr = angle.split(":");

    // decimal point (if any) must be in last DMS component
    if (angle.search(/\..*:/) != -1)
	return NaN;
    // empty DMS component not allowed; only three components allowed
    if (angle.search("::") != -1 || temparr.length > 3)
	return NaN;

    if (angle.indexOf("-") != -1)
	sign = -1;
    else
	sign = 1;

    if (sign == -1)
	temparr[0] *= -1;

    d_angle = Number(temparr[0]);
    if (temparr.length > 1)		// minutes given
	d_angle += Number(temparr[1]) / 60;

    if (temparr.length > 2)		// seconds given
	d_angle += Number(temparr[2]) / 3600;

    return sign * d_angle;
}

// trim leading and trailing white space
function trim()
{
    var str;
    str = this.replace(/^\s*/, "");
    return str.replace(/\s*$/, "");
}

// WGS 84 ellipsoid
var ellipse = {
    a: 6378137,				// Earth's equatorial radius in m
    f: 1 / 298.257223563		// Earth's flattening: WGS84
    //f: 1 / 298.257222101		// Earth's flattening: GRS 80 (used in NGS invers3D)
};
ellipse.e_sq = ellipse.f * (2 - ellipse.f);		// first eccentricty squared
ellipse.ep_sq = ellipse.e_sq / (1 - ellipse.e_sq);	// second eccentricty squared

// calculate radius of curvature in plane of azimuth
// latitude and azimuth in radians
// returns radius in m
function calc_radius(lat, az)
{
    var a    = ellipse.a;	// equatorial radius, in m
    var f    = ellipse.f;	// flattening
    var e2   = ellipse.e_sq;	// (first eccentricity)^2

    var r_az;	// radius of curvature in plane of azimuth
    var r_m;	// radius of curvature in meridian
    var r_n;	// radius of curvature in prime vertical

    var denom_n = Math.sqrt(1 - e2 * Math.square(Math.sin(lat)));

    // radius of curvature in plane of prime vertical (Meusnier's Theorem)
    r_n  = a / denom_n;

    r_m = a * (1 - e2) / Math.cube(denom_n);

    // radius of curvature in plane of azimuth (Euler's Theorem)
    r_az = 1 / ((Math.square(Math.cos(az))) / r_m + Math.square(Math.sin(az)) / r_n);

    return r_az;
}

// constructor for object holding coordinates, directions, and distance
// for two points

function Coordinates()
{
    ;
}

/* end external https://www.largeformatphotography.info/sunmooncalc/AzAltDistCommon.js */




/* external https://www.largeformatphotography.info/sunmooncalc/AzAltDistGeodetic.js */

/*
  **********************************************************************
    calculate apparent altitude of one location from another, using
    either ellipsoidal geodetic inverse (Vincenty 1975) or spherical
    Earth.  Vincenty calculation provides ellipsoidal azimuth and
    distance as well.

    Requires AzAltDistCommon.js

    Version 1.2.4.1  21 June 2018

    Copyright 2012, 2014, 2015, 2018 Jeff Conrad
  **********************************************************************
*/

// calculate altitude using spherical Earth--necessary if Vincenty
// algorithm fails
Coordinates.prototype.calcAltitudeSpherical = function()
{
    var k = kRefr;		// refraction constant: typical surveying value
    var r = ellipse.a;		// equatorial, in m

    var dist_1, dist_2;
    var elev = 0;	// elevation of ground between points

    var lat_1  = this.from_lat.DtoR();
    var elev_1 = this.from_elev;
    var elev_2 = this.to_elev;
    var height_1 = this.from_ht;
    var height_2 = this.to_ht;

    var azimuth = this.azimuth.DtoR();
    var distance = this.distance;

    this.r_az = r;

    if (height_1 > 0)
	elev_1 += height_1;
    if (height_2 > 0)
	elev_2 += height_2;

    var gamma = distance / r;
    var cos_gamma = Math.cos(gamma);

    var a_side = r + elev_1;
    var b_side = r + elev_2;

    // plane triangle with center of earth at gamma vertex:
    //   a_side = distance of first point from center of earth
    //   b_side = distance of second point from center of earth
    //   c_side = straight-line distance between the two points

    // c_side is mark-to-mark distance on sphere
    var c_side = Math.sqrt(Math.square(a_side) + Math.square(b_side) -
	         2 * a_side * b_side * cos_gamma);
    this.mm_dist = c_side;

    // cos() puts result in proper quadrant; law of sines does not
    var beta = Math.acos((a_side - b_side * cos_gamma) / c_side);
    var alpha = Math.PI - beta - gamma;
    var altitude = beta.RtoD() - 90;

    // account for atmospheric refraction
    var refr = (k * distance / ( 2 * r )).RtoD();
    altitude += refr;
    this.altitude = altitude;
    this.surf_dist = this.distance;		// surface distance

    // crude test for visibility of one point from the other
    if (this.is_visible() === true) {
	this.zenith = true;
	this.distance = this.mm_dist;	// if not visible, keep surface distance
    }
    else
	this.zenith = false;
};

/*
  ********************************************************************
    Remaining methods and functions Adapted from Jeff Conrad C
    translation of NGS invers3D (200208.19, Stephen J.  Frakes, NGS),
    based on Vincenty (1975) algorithm
  ********************************************************************
*/

// calculate geodetic inverse on ellipsoid
Coordinates.prototype.calcGeodeticInverse = function()
{
    var
        tol_az_s  = 5e-5,       // tolerance for conversion of azimuth seconds
        tol_dist  = 5e-5,       // tolerance for values less than 5e-5 meters
        tol_zen_s = 5e-3;       // tolerance for conversion of zenith seconds
    var
        //b_az,           // back azimuth sta2 -> sta1
        //f_az,           // forward azimuth sta1 -> sta2
        //el_dist,        // ellipsoid distance in m
	//mm_dist,	// mark-to-mark (chord) distance in m
        lon1, lat1,     // sta 1 lat, lon  in radians
        lon2, lat2;     // sta 2 lat, lon  in radians

    // convert lon1 & lon2 to  0 -> PI2 radians
    // lat1 = coords.from_lat.DtoR();
    // lon1 = coords.from_lng.DtoR();
    // lat2 = coords.to_lat.DtoR();
    // lon2 = coords.to_lng.DtoR();
    // Modified Poell
    lat1 = this.from_lat.DtoR();
    lon1 = this.from_lng.DtoR();
    lat2 = this.to_lat.DtoR();
    lon2 = this.to_lng.DtoR();


    if (lon1 < 0.0 )
        lon1 = lon1 + Math.PI2;
    if (lon2 < 0.0 )
        lon2 = lon2 + Math.PI2;

    /*
	************************
	compute geodetic inverse
	************************
    */
    var AzDist = {};
    // returns f_az, b_az, el_dist in AzDist
    if (this.gpn_hri(AzDist) === false)		// iteration did not converge
	return false;

    // check for a non distance ... lat1, lon1 & lat2, lon2 equal zero ?
    if (AzDist.el_dist < tol_dist) {
        AzDist.f_az = 0.0;
        AzDist.b_az = 0.0;
    }

    AzDist.f_az = AzDist.f_az.setRange(Math.PI2);
    AzDist.b_az = AzDist.b_az.setRange(Math.PI2);	// we don't really need this ...

    this.azimuth = AzDist.f_az.RtoD();
    // surface distance used to check visibility
    this.distance = this.surf_dist = this.el_dist = AzDist.el_dist;

    /*
	****************
	compute altitude
	****************
    */

    // set values < tol_dist to zero
    var dh = zvalue (this.to_elev + this.to_ht - (this.from_elev + this.from_ht), tol_dist);
    var xyz1 = {}, xyz2 = {};
    this.to_xyz(this.from_lat, this.from_lng, (this.from_elev + this.from_ht), xyz1);
    this.to_xyz(this.to_lat, this.to_lng, (this.to_elev + this.to_ht), xyz2);

    var dx = zvalue (xyz2.x - xyz1.x, tol_dist);
    var dy = zvalue (xyz2.y - xyz1.y, tol_dist);
    var dz = zvalue (xyz2.z - xyz1.z, tol_dist);

    // mark-to-mark (chord) distance
    var mm_dist = Math.sqrt(Math.square(dx) + Math.square(dy) + Math.square(dz) );
    this.mm_dist = mm_dist;

    // convert ECEF (XYZ) diffs to ENU (east, north, up) diffs
    var dxyz = {};
    var denu = {};
    dxyz.dx = dx;
    dxyz.dy = dy;
    dxyz.dz = dz;
    this.xyz2enu(dxyz, denu);

    // set values < tol_dist to zero
    denu.de = zvalue (denu.de, tol_dist);
    denu.dn = zvalue (denu.dn, tol_dist);
    denu.du = zvalue (denu.du, tol_dist);

    // get altitude if second station is visible from first
    if (mm_dist > tol_dist) {
	var
            r_az,       // radius of curvature in plane of azimuth
            refr,       // atmospheric refraction in rad
            alt;    	// apparent altitude

        if (Math.abs(denu.du / mm_dist) > 0.99985 )
            this.zenith = false;
        else {
            // compute true (unrefracted) altitude
	    alt = Math.asin(denu.du / mm_dist);

	    r_az = calc_radius(lat1, AzDist.f_az);
	    // compute refraction
            refr = kRefr * AzDist.el_dist / ( 2 * r_az );
            // add to get apparent altitude
            alt += refr;

	    this.r_az = r_az;
	    this.altitude = alt.RtoD();

	    if (this.is_visible() === true) {
		this.zenith = true;
		this.distance = mm_dist;	// if not visible, keep surface distance
	    }
	    else
		this.zenith = false;
        }
    }
    else
        this.zenith = false;

    return true;
};

// Compute the length of a meridional arc between two latitudes
// returns distance on meridional arc in arc
Coordinates.prototype.gpn_arc = function()
{
/*
 *****************************************************************************
   Written by:  Robert (Sid) Safford
   C version:   Jeff Conrad
   JS version:  Jeff Conrad

   Input Parameters:
   -----------------
   this.lat1           Lat Station 1
   this.lat2           Lat Station 2

   Returns:
   -----------------
   arc          meridional geodetic Distance between two latitudes

   Global Variables and Constants:
   -------------------------------
   ellipse.a     Semi-Major Axis of Reference Ellipsoid
   ellipse.f     Flattening (0.0033528 ... )
   ellipse.e_sq  1st eccentricity Squared for Reference Ellipsoid
 *****************************************************************************
*/

    var flag90;
    var tol = 5e-15;
    var
	lat1 = this.from_lat.DtoR();
	lat2 = this.to_lat.DtoR();
    var
        a, b,c, d, e, f,
        da, db, dc, dd, de, df,
        s1, s2,
        e2, e4, e6, e8, ex,
        t1, t2, t3, t4, t5;

    // Check for a 90 degree lookup
    flag90 = false;

    if (Math.abs(lat1) < tol && Math.abs(PI / 2.0 - Math.abs(lat2)) <  tol)
        flag90 = true;
    else
        flag90 = false;

    da = (lat2 - lat1);
    s1 = 0.0;
    s2 = 0.0;

    // Compute the length of a meridional arc between two latitudes
    e2 = ellipse.e_sq;
    e4 = e2 * e2;
    e6 = e4 * e2;
    e8 = e6 * e2;
    ex = e8 * e2;

    t1 = e2 * (  3.0 / 4.0);
    t2 = e4 * ( 15.0 / 64.0);
    t3 = e6 * ( 35.0 / 512.0);
    t4 = e8 * (315.0 / 16384.0);
    t5 = ex * (693.0 / 131072.0);

    a  = 1.0 + t1 + 3.0 * t2 + 10.0 * t3 + 35.0 * t4 + 126.0 * t5;

    if ( ! flag90 ) {
        b  = t1 + 4.0 * t2 + 15.0 * t3 + 56.0 * t4 + 210.0 * t5;
        c  = t2 + 6.0 * t3 + 28.0 * t4 + 120.0 * t5;
        d  = t3 + 8.0 * t4 + 45.0 * t5;
        e  = t4 + 10.0 * t5;
        f  = t5;

        db = Math.sin(lat2 *  2.0) - Math.sin(lat1 *  2.0);
        dc = Math.sin(lat2 *  4.0) - Math.sin(lat1 *  4.0);
        dd = Math.sin(lat2 *  6.0) - Math.sin(lat1 *  6.0);
        de = Math.sin(lat2 *  8.0) - Math.sin(lat1 *  8.0);
        df = Math.sin(lat2 * 10.0) - Math.sin(lat1 * 10.0);

        // Compute the s2 part of the series expansion
        s2 = -db * b / 2.0 + dc * c / 4.0 - dd * d / 6.0 + de * e / 8.0 - df * f / 10.0;
    }
    // Compute the s1 part of the series expansion
    s1 = da * a;

    // Compute the arc length
    return ellipse.a * (1.0 - ellipse.e_sq) * (s1 + s2);
};

/*
    compute geodetic inverse from geographic positions using modified
    Helmert-Rainsford method

*/
Coordinates.prototype.gpn_hri = function(AzDist)
{
/*
 *****************************************************************************
   Written by:   Robert (Sid) Safford
   C version:    Jeff Conrad
   JS version:   Jeff Conrad

   Solution of the geodetic inverse problem after Thaddeus Vincenty ("TV"),
   USAF and NGS.  Modified Rainsford's method with Helmert's elliptical
   terms, effective in any azimuth and at any distance short of antipodal;
   from/to stations must not be the geographic pole.  Latitudes and
   longitudes in radians positive north and west forward and back azimuths
   returned in radians clockwise from north.  Geodesic distance s returned
   in meters.

   **** Note ****
   1. Do not use for meridional arcs and be careful on the equator.
   2. Azimuths are from north(+) clockwise and
   3. Longitudes are positive east(+)

   input parameters:
   -----------------
   this.lat1    lat station 1                               degrees
   this.lon1    lon station 1                               degrees
   this.lat2    lat station 2                               degrees
   this.lon2    lon station 2                               degrees

   output parameters:
   ------------------
   AzDist.f_az     (sta 1 -> sta 2)                       radians
   AzDist.b_az     (sta 2 -> sta 1)                       radians
   AzDist.el_dist  geodetic dist between sta(s) 1 & 2     meters

   global variables and constants:
   -------------------------------
   ellipse.a     semi-major axis of reference ellipsoid      meters
   ellipse.f     flattening (0.0033528...)
   ellipse.e_sq  1st eccentricity squared
 *****************************************************************************
*/

    var count;		// interation counter for iterative procedure
    var maxcount = 99;	// maximum interations for iterative procedure
    var
	tol0 = 5.0e-15,	// tolerance for checking computation value
	tol1 = 5.0e-14,	// tolerance for checking a real zero value
	tol2 = 7.0e-03,	// tolerance for close to zero value
	tol3 = 0.5e-13;	// tolerance for longitude difference in iterative procedure
    var
	a0, a2, a4, a6,
	aa,		// constant from function gpn_loa()
	arc,		// meridional arc distance latitude lat1 to lat2 (in meters)
	b0, b2, b4, b6,
	b,
	bb,		// constant from function gpn_loa()
	sigma,		// angular distance between points
	sin_sigma,
	cos_sigma,
	sin_alpha,	// alpha is azimuth of geodesic at equator
	dlon,		// temporary value for difference in longitude (radians)
	dlon_abs,	// absolute value of longitude difference in radians
	f0,		// (1 - f)
	f, f2, f3, f4,	// powers of ellipse flattening
	q0, q2, q4, q6,
	r2, r3,
	t4, t6,
	sin_az1, sin_az2,
	tan_az1, tan_az2,
	u1, u2,
	sin_lon, cos_lon,
	sin_u1, sin_u2,
	cos_u1, cos_u2,
	w,
	dlon_diff, xz,
	z;
    var az1, az2, s;	// parameters returned in C version
    var
	lat1 = this.from_lat.DtoR(),
	lon1 = this.from_lng.DtoR(),
	lat2 = this.to_lat.DtoR(),
	lon2 = this.to_lng.DtoR();

    // test the longitude difference with tol1
    // tol1 is approximately 0.000000001 arc seconds
    // if dlon < tol1, treat as meridional arc
    dlon = lon2 - lon1;
    dlon_abs = Math.abs(dlon);

    if (dlon_abs < tol1 ) {
        lon2 += tol1;
        alert("** Longitudal difference is near zero **");

	// calculate distance on meridional arc
        arc = this.gpn_arc;
        AzDist.el_dist = Math.abs(arc);

        if (lat2 > lat1 ) {
	    AzDist.f_az = 0.0;
	    AzDist.b_az = Math.PI;
	}
        else {
	    AzDist.f_az = Math.PI;
	    AzDist.b_az = 0.0;
	}
        return true;
    }

    // test for longitude difference over 180 degrees
    if (dlon >= 0.0 && Math.PI <= dlon && dlon < Math.PI2 )
	dlon -= Math.PI2;
    else if (Math.PI <= dlon_abs && dlon_abs < Math.PI2 )
	dlon += Math.PI2;

    // If longitude difference over 180 degrees, turn it around
    if (dlon_abs > Math.PI)
        dlon_abs = Math.PI2 - dlon_abs;

    /*
	Compute the limit in longitude; it is equal
	to twice the distance from the equator to the pole,
	as measured along the equator (east/west)
    */

    // test for antipodal longitude difference
    if (dlon_abs >= Math.PI * (1.0 - ellipse.f)) {
	var near_equator = true;
	var lat1_abs, lat2_abs;

        lat1_abs = Math.abs(lat1);
        lat2_abs = Math.abs(lat2);

	// neither lat1 nor lat2 is near the equator
        if (lat1_abs > tol2 && lat2_abs > tol2 )
	    near_equator = false;

	// longitude difference is greater than lift-off point
	// now check to see if  "both"  lat1 & lat2 are on equator
        else if (lat1_abs < tol1 && lat2_abs > tol2 )
	    near_equator = false;
        else if (lat2_abs < tol1 && lat1_abs > tol2 )
	    near_equator = false;

	if (near_equator === true) {
	    // check for either lat1 or lat2 just off the equator but < tol2
	    if (lat1_abs > tol1 || lat2_abs > tol1 ) {
		alert("** Too close to equator; cannot compute geodesic **");
		AzDist.f_az = 0.0;
		AzDist.b_az = 0.0;
		AzDist.el_dist = -1.0;
		return false;
	    }
	    else {		// Longitude difference beyond lift-off point
		var
		    loa = {
			az1: 0,	// forward azimuth
			az2: 0,	// back azimuth
			sms: 0	// equatorial - geodesic distance (S - s) "Sms"
		    },
		    equ_dist;	// equatorial distance in meters

		// compute the azimuth to antipodal point
		// sets f_az, b_az
		this.gpn_loa(dlon, loa);

		/* compute the equatorial distance & geodetic */
		equ_dist = ellipse.a * Math.abs(dlon);
		AzDist.f_az = loa.az1;
		AzDist.b_az = loa.az2;
		AzDist.el_dist = equ_dist - loa.sms;

		return true;
	    }
	}
    }

    f    = ellipse.f;
    f0   = (1.0 - f);
    b    = ellipse.a * f0;			/* semi-minor axis of ellipsoid */
    f2   = Math.square(ellipse.f);
    f3   = ellipse.f * f2;
    f4   = ellipse.f * f3;

    // the longitude difference
    dlon_abs = Math.abs(dlon);

    count = 0;

    // the reduced latitudes
    u1    = f0 * Math.sin(lat1) / Math.cos(lat1);
    u2    = f0 * Math.sin(lat2) / Math.cos(lat2);

    u1    = Math.atan(u1);
    u2    = Math.atan(u2);

    sin_u1   = Math.sin(u1);
    cos_u1   = Math.cos(u1);

    sin_u2   = Math.sin(u2);
    cos_u2   = Math.cos(u2);

    dlon_diff = 1.0;

    // numbers in parens are equation numbers in Vincenty 1975
    while (count++ <= maxcount && dlon_diff >= tol3) {
	cos_lon  = Math.cos(dlon_abs);
	sin_lon  = Math.sin(dlon_abs);

	cos_sigma  = sin_u1 * sin_u2 + cos_u1 * cos_u2 * cos_lon;		// (15)
	sin_sigma  = Math.sqrt(Math.square(sin_lon * cos_u2)
	           + Math.square(sin_u2 * cos_u1 - sin_u1 * cos_u2 * cos_lon));	// (14)

	sigma   = Math.atan2(sin_sigma, cos_sigma);				// (16)
	sin_alpha = cos_u1 * cos_u2 * sin_lon / sin_sigma;			// (17)

	w   = 1.0 - Math.square(sin_alpha);		// (cos_alpha)^2
	t4  = Math.square(w);
	t6  = w * t4;

	// the coefficients of type A (Rainsford 1955)
	a0  = f - f2 * (1.0 + f + f2) * w / 4.0 + 3.0 * f3 * (1.0
	    + 9.0 * f / 4.0) * t4 / 16.0 - 25.0 * f4 * t6 / 128.0;
	a2  = f2 * (1.0 + f + f2) * w / 4.0 - f3 * (1.0 + 9.0 * f / 4.0) * t4 / 4.0
	    + 75.0 * f4 * t6 / 256.0;
	a4  = f3 * (1.0 + 9.0 * f / 4.0) * t4 / 32.0 - 15.0 * f4 * t6 / 256.0;
	a6  = 5.0 * f4 * t6 / 768.0;

	// the multiple angle functions
	q0  = 0.0;
	if (w > tol0 )
	    q0 = -2.0 * sin_u1 * sin_u2 / w;

	// q2 = cos(2 sigma_m)
	q2  = cos_sigma + q0;							// (18)
	q4  = 2.0 * Math.square(q2) - 1.0;
	q6  = q2 * (4.0 * Math.square(q2) - 3.0);
	r2  = 2.0 * sin_sigma * cos_sigma;
	r3  = sin_sigma * (3.0 - 4.0 * Math.square(sin_sigma));

	// the longitude difference
	s  = sin_alpha * (a0 * sigma + a2 * sin_sigma * q2 + a4 * r2 * q4 + a6 * r3 * q6);
	xz  = dlon + s;

	dlon_diff = Math.abs(xz - dlon_abs);
	dlon_abs = xz;
    }

    if (count - 1 > maxcount && dlon_diff >= tol3) {
	alert('No solution after ' + (count - 1) + ' iterations');
	return false;
    }

    // the coefficients of type b
    z   = ellipse.ep_sq * w;		// u^2 in Vincenty 1975

    b0  = 1.0 + z * (1.0 / 4.0 + z * ( -3.0 / 64.0 + z * (5.0 / 256.0 -
          z * 175.0 / 16384.0)));
    b2  = z * ( -1.0 / 4.0 + z * (1.0 / 16.0 + z * ( -15.0 / 512.0 +
          z * 35.0 / 2048.0)));
    b4  = Math.square(z) * ( -1.0 / 128.0 + z * (3.0 / 512.0 - z * 35.0 / 8192.0));
    b6  = Math.cube(z) * ( -1.0 / 1536.0 + z * 5.0 / 6144.0);

    // distance in meters
    s   = b * (b0 * sigma + b2 * sin_sigma * q2 + b4 * r2 * q4 + b6 * r3 * q6);	// (19)
    AzDist.el_dist = s;

    // first compute az1 & az2 for along the equator
    if (dlon > Math.PI )
	dlon -= Math.PI2;

    if (Math.abs(dlon) > Math.PI )
	dlon += Math.PI2;

    az1 = Math.PI / 2.0;
    if (dlon < 0.0 )
	az1 *= 3.0;

    az2 = az1 + Math.PI;
    if (az2 > Math.PI2 )
	az2 -= Math.PI2;

    // now compute az1 & az2 for latitudes not on the equator
    if (! (Math.abs(sin_u1) < tol0 && Math.abs(sin_u2) < tol0) ) {
        tan_az1 =  sin_lon * cos_u2 / (sin_u2 * cos_u1 - cos_lon * sin_u1 * cos_u2);
        tan_az2 =  sin_lon * cos_u1 / (sin_u1 * cos_u2 - cos_lon * sin_u2 * cos_u1);
        sin_az1 =  sin_alpha / cos_u1;
        sin_az2 = -sin_alpha / cos_u2;

	// azimuths from north, longitudes positive east
	az1   = Math.atan2(sin_az1, sin_az1 / tan_az1);
	az2   = Math.PI - Math.atan2(sin_az2, sin_az2 / tan_az2);
    }

    if (az1 < 0.0 )
	az1 += Math.PI2;

    if (az2 < 0.0 )
	az2 += Math.PI2;

    AzDist.f_az = az1;
    AzDist.b_az = az2;

    return true;
};

// Compute the lift-off-azimuth constants from geographic positions
Coordinates.prototype.gpn_loa = function (dl, loa)
{
/*
 *****************************************************************************
   Written by:  Robert (Sid) Safford
   C and JavaScript versions:   Jeff Conrad

   Input parameters:
   -----------------
   dl           lon difference

   Output parameters:
   ------------------
   loa.az1      az point1 -> point2
   loa.az2      az point2 -> point1
   loa.a0       const
   loa.b0       const
   loa.sms      distance ... equatorial - geodesic  (S - s)   "sms"
 *****************************************************************************
*/

    var iter;
    var tol = 5e-13;
    var
        az,
        dlon,
        cons,
        f,      // flattening of reference ellipsoid
        c2,
        cs,
        s,
        t1, t2, t4, t6, t8,
        u2, u4, u6, u8;

    dlon = Math.abs(dl);
    cons = (Math.PI - dlon) / (Math.PI * ellipse.f);
    f    = ellipse.f;

    // Compute an approximate az
    az   = Math.asin(cons);

    t1   =     1.0;
    t2   =  ( -1.0 / 4.0) * f * (1.0 + f + Math.square(f));
    t4   =     3.0 / 16.0 * Math.square(f) * (1.0 + (9.0 / 4.0) * f);
    t6   = ( -25.0 / 128.0) * Math.cube(f);

    iter = 0;

    while (iter++ <= 6) {
        s    = Math.cos(az);
        c2   = Math.square(s);

        // Compute new a0
        loa.a0   = t1 + t2 * c2 + t4 * Math.square(c2) + t6 * Math.cube(c2);
        cs   = cons / loa.a0;
        s    = Math.asin(cs);
        if ( Math.abs(s - az) < tol )
            break;

        az   = s;
    }

    loa.az1 = s;
    if (dl < 0.0)
        loa.az1 = Math.PI2 - loa.az1;

    loa.az2 = Math.PI2 - loa.az1;

    // Equatorial - geodesic  (S - s)   "Sms"
    s    = Math.cos(loa.az1);

    u2   = ellipse.ep_sq * Math.square(s);
    u4   = Math.square(u2);
    u6   = u4 * u2;
    u8   = u6 * u2;

    t1   =     1.0;
    t2   =    (1.0 / 4.0) * u2;
    t4   =   ( -3.0 / 64.0) * u4;
    t6   =    (5.0 / 256.0) * u6;
    t8   = ( -175.0 / 16384.0) * u8;

    loa.b0   = t1 + t2 + t4 + t6 + t8;
    s    = Math.sin(loa.az1);
    loa.sms  = ellipse.a * Math.PI * (1.0 - ellipse.f * Math.abs(s) * loa.a0 - loa.b0 * (1.0 - ellipse.f));
};

// convert dx, dy, dz to de, dn, du
// input lat, lon are positive north and east in degrees
Coordinates.prototype.xyz2enu = function(dxyz, denu)
{
    var
	ds,
	dx, dy, dz;     /* differences in rectangular coordinates of stations */
    var
	lat = this.from_lat.DtoR(),
	lon = this.from_lng.DtoR();
    // rotate by lon
    dx = dxyz.dx * Math.cos(lon) + dxyz.dy * Math.sin(lon);
    dy = dxyz.dy * Math.cos(lon) - dxyz.dx * Math.sin(lon);
    dz = dxyz.dz;

    // rotate by lat
    ds = dx * Math.cos(Math.PI / 2 - lat) - dz * Math.sin(Math.PI / 2.0 - lat);
    denu.de = dy;
    denu.du = dz * Math.cos(Math.PI / 2 - lat) + dx * Math.sin(Math.PI / 2 - lat);
    denu.dn = -ds;
};

/*
    compute x, y, z from lat, lon, ellipse ht (Rapp 1975, 17)
    Rapp, R.H. 1975. Geometric Geodesy (notes), Vol. I.
    Columbus, Ohio: The Ohio State University.
*/
Coordinates.prototype.to_xyz = function(lat, lon, el_ht, xyz)
{
    var
	en,
	sin_lat,
	cos_lat,
	w;

    lat = lat.DtoR();
    lon = lon.DtoR();

    sin_lat = Math.sin(lat);
    cos_lat = Math.cos(lat);
    w = Math.sqrt(1 - ellipse.e_sq * Math.square(sin_lat));
    en = ellipse.a / w;

    xyz.x = (en + el_ht) * cos_lat * Math.cos(lon);
    xyz.y = (en + el_ht) * cos_lat * Math.sin(lon);
    xyz.z = (en * (1 - ellipse.e_sq) + el_ht) * sin_lat;
};

// crude check for visibility of second point from first
// assumes intervening terrain is at sea level
// by Jeff Conrad
Coordinates.prototype.is_visible = function()
{
    var visible;
    var
	distance,	// distance from first point to second on ellipsoid or sphere
	dist_1,		// distance from first point to horizon at elevation 'elev'
	dist_2,		// distance from second point to horizon at elevation 'elev'
	elev,		// elevation of terrain betwteen 1st and 2nd points
	height_1,	// height of first point above terrain between points
	height_2,	// height of second point above terrain between points
	k = kRefr,
	r = this.r_az;	// radius in plane of azimuth or of sphere, m

    elev = 0;		// elevation other than zero not implemented
    distance = this.distance;	// surface distance, on ellipsoid or sphere

    /*
	test for occlusion of second point from curvature of earth;
	default elev for intervening surface is sea level!
    */

    height_1 = this.from_elev + this.from_ht - elev;
    height_2 = this.to_elev + this.to_ht - elev;
    if (height_1 < 0)
	height_1 = 0;
    if (height_2 < 0)
	height_2 = 0;

    // account for refraction
    r *= 1 / (1 - k);

    // max distances to horizon for points 1, 2
    dist_1 = Math.sqrt(2 * r * height_1);
    dist_2 = Math.sqrt(2 * r * height_2);

    if (dist_1 + dist_2 >= distance)
	visible = true;
    else
	visible = false;

    return visible;
};

// check for dx, dy, dz or
// de, dn, du values below tolerance
function zvalue (val, tol)
{
    if (Math.abs(val) < tol )
        val = 0;

    return val;
}

/* end external https://www.largeformatphotography.info/sunmooncalc/AzAltDistGeodetic.js */


/* external https://www.largeformatphotography.info/sunmooncalc/AzAltDist.js */

var FTtoM = 0.3048;
var MtoFT = 1 / FTtoM;
var MItoKM = 1.609344;
var KMtoMI = 1 / MItoKM;
var KMtoM = 1e3;

var kRefr = 1 / 7;		// atmospheric refraction coefficient

// precision to display on form
const LATLNG_PRECIS = 6;
const ELEV_PRECIS = 2;
const HT_PRECIS = 2;
const AZ_PRECIS = 3;
const ALT_PRECIS = 3;
const DIST_PRECIS = 3;

// conversion factors for height and distance
// var htCvt, distCvt;
// height and distance units to show on form
// var htUnits, distUnits;

const htUnits = 'm';
const distUnits = 'km';
const htCvt = 1;
const distCvt = KMtoM;

/* end external https://www.largeformatphotography.info/sunmooncalc/AzAltDist.js */

// module.exports.calcGeodeticInverse = calcGeodeticInverse;
// module.exports.calcAltitudeSpherical = calcAltitudeSpherical;
module.exports.Coordinates = Coordinates;
module.exports.htCvt = htCvt;
