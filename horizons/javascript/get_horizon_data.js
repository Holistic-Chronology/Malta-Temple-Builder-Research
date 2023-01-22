'use strict';

const fs = require('fs');
const path = require('path');

const {Coordinates, htCvt} = require('./AzmAlt.js');
let coords = new Coordinates;

const version = "1.05";


// Modify this if you want to change the altitude of the reference point
let reference_elevation_delta = 0.0;
// Modify this if you want to change the altitude of the horizon
let elevation_delta = 0.0;

// Modify according your needs
const makeEllipsoidAltitudeArray_data_version = "1.54";
const makeEllipsoidAltitudeArray_reference_point = "M-1011-Winter-solstice-upright-closure-point";
const makeEllipsoidAltitudeArray_seaLevel_altitude = -0.272;
const makeEllipsoidAltitudeArray_data_dir = path.join(__dirname,"data_in");
const makeEllipsoidAltitudeArray_output_dir = path.join(__dirname,"data_out");
const makeEllipsoidAltitudeArray_output_file_name = "_" + makeEllipsoidAltitudeArray_reference_point + "_horizons.json";
const makeEllipsoidAltitudeArray_description_prefix = "Set of azimuth / altitude pairs from Mnajdra South Temple Room 1 ";
const makeEllipsoidAltitudeArray_date_generated = "2021-02-08T07:09:41.000Z";
const makeEllipsoidAltitudeArray_source_point = {
  name: "M-1011",
  description: "Mnajdra South, winter solstice upright, closure point",
  latitude: 35.82665894728086,
  longitude: 14.436185526231116,
  elevation: 83.83999633789062,
  source: "Coordinates from the GNSS survey of Hertitage Malta (Katya Stroud, Josef Caruana) and Ronald Poell on 2021-01-27",
  source_reference: "GNSS_20210127_GPS0062",
  used_elevation: "ground = 83.84"
};


const makeEllipsoidAltitudeArray_fd_info = {
  reference: {
    date_generated: makeEllipsoidAltitudeArray_date_generated,
    data_version: makeEllipsoidAltitudeArray_data_version,
    description: makeEllipsoidAltitudeArray_description_prefix + makeEllipsoidAltitudeArray_reference_point,
    author: {
      name: "Ronald Poell",
      profile: "https://www.researchgate.net/profile/Ronald-Poell",
    },
    url: ""
  },
  project: {
    name: "A holistic approach to the temple builder society in Malta",
    url: "https://www.researchgate.net/project/A-holistic-approach-to-the-temple-builder-society-in-Malta",
    sponsoring_bitcoin_address: "1LDuLDeuvbbjj8tprt7M7ThGYbaJV4BycL"
  },
  software: {
    QGis: {
      version: "3.16.2",
      url: "https://qgis.org"
    },
    "get_horizon_data.js" : {
      version: version,
      author: "Ronald Poell",
      url: ""
    }
  },
  sources: {
    source_point: makeEllipsoidAltitudeArray_source_point ,
    DTM: "SIntegraM data/service, (2018), Developing Spatial Data Integration for the Maltese Islands, Planning Authority, DTM_WGS84 (The DTM of Malta in WGS84 projection)",
    seaLevel_altitude: makeEllipsoidAltitudeArray_seaLevel_altitude,
  },
  process: {
    step_1: {
      name: "Merging DTM tiles",
      description: `The tiles T4964 and T4965 have been merged using gdal because the tool used for the elevation profiles does not work across several tiles.
gdal_merge.py -ot Float32 -of GTiff -o /Path_To_Output/T4964-T4965.tif --optfile mergeInputFiles.txt
mergeInputFiles.txt:
"/Path_To_Input/T4964.tif"
"/Path_To_Input/T4965.tif"`
    },
    step_2: {
      name: "Create to horizon azimuths in QGis",
      description: `Using "Geodesic measure tool", manually add the starting point (M-1011) coordinates.
Draw a line to the end of the DTM tile.
Save the to a (temporary) layer
Export that layer in GeoJSON format (pattern : M-1011-[Azimuth].geojson) with CRS: EPSG:4326 - WGS 84`
    },
    step_3: {
      name: "Create the elevation profiles in QGis",
      description: `Using the "Terrain profile" tool:
Add the DTM tile
Use the "Selected polyline" option and select the line created in step 2
In the "Settings" tab  select "Full resolution enabled". This will use the native resolution of the DTM.
In the "Table" tab "Create Temporary layer"
Export that layer in GeoJSON format (pattern : M-1011-[Azimuth]-Profile.geojson) with CRS: EPSG:4326 - WGS 84
In the "Table" tab "Copy to clipboard (with coordinates) and past that in a text file (pattern : M-1011-[Azimuth]-Profile.txt).`
    },
    step_4: {
      name: "Generate the horizon files in Node.js",
      description: `Using the program "get_horizon_data.js" makeHorizons().
This will generate for each of the .geojson files two horizon files:
M-1011-[Azimuth]-horizon.geojson: The altitude is a calculated as rectangle triangle.
M-1011-[Azimuth]-horizon-ellipsoid.geojson: The altitude is a calculated using the WGS 84 ellipsoid.
The label property contains the azimuth and altitude (for use in QGis).
Theoritical altitudes lower than sealevel altitude for this location are set at the sealevel altitude and the distance at 35 Km. `
    }

  }
};

// End modifications according your needs


// Will be assigned by the program
let azimuth;          // 124.0006
let geojson_profile;  // "M-1011-" + azimuth + "-Profile.geojson"
let text_profile;     // "M-1011-" + azimuth + "-Profile.txt"
let geojson_d;        // JSON.parse(fs.readFileSync(path.join(data_dir, geojson_profile)).toString())
let txt_d;            // fs.readFileSync(path.join(data_dir, text_profile)).toString()
let heading;          // azimuth + "°"
let name;             // "M-1011 " + heading + " horizon"
let output;           // "M-1011-" + azimuth + "-horizon.geojson"
let output_el;        // "M-1011-" + azimuth + "-horizon-ellipsoid.geojson"

async function makeHorizon() {
  let txt_lines = txt_d.split("\n");
  let data = [];
  txt_lines.forEach(line => {
    // 0.0	449073.47751295974	3964868.757051367	83.75
    //0.173795534595292	449073.627533159	3964868.669308403	83.73999786376953
    let items = line.split("	");
    data.push(items);
  });
  let reference_elevation = geojson_d.features[0].properties.Value + reference_elevation_delta;
  if (geojson_d.features[0].geometry.coordinates.length === 2) {
    geojson_d.features[0].geometry.coordinates.push(reference_elevation);
  }


  let max_altitude = -9999;
  let max_point;

  let horizon_line = {
    "type": "FeatureCollection",
    "name": name,
    "features": [
      { "type": "Feature",
        "properties": {
          "azimuth": azimuth
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [ geojson_d.features[0].geometry.coordinates, [] ] } }
    ]
  }

  let max_altitude_el = -9999;
  let max_point_el;

  let horizon_line_el = {
    "type": "FeatureCollection",
    "name": name,
    "features": [
      { "type": "Feature",
        "properties": {
          "azimuth": azimuth
        },
        "geometry": {
          "type": "LineString",
          "coordinates": [ geojson_d.features[0].geometry.coordinates, [] ] } }
    ]
  }

  geojson_d.features.forEach((f,i) => {
    let elevation = f.properties.Value + elevation_delta;
    let delta_elevation = elevation - reference_elevation;
    let distance = parseFloat(data[i][0]);
    let h = Math.sqrt(delta_elevation * delta_elevation + distance * distance);
    let altitude_rad = Math.atan2(delta_elevation,h);
    let altitude_deg = altitude_rad * (180/Math.PI);

    // if (i > 0) {
      max_altitude = Math.max(max_altitude,altitude_deg);
    // }

    if (max_altitude === altitude_deg) {
      max_point = {altitude: Math.round(altitude_deg * 10000)/10000, dist: Math.round(distance * 100)/100, lat: f.geometry.coordinates[0], lon: f.geometry.coordinates[1] , elev: elevation};
      horizon_line.features[0].properties = {
        "label": heading + " " + Math.round(altitude_deg * 10000)/10000 +"°",
        "distance": Math.round(distance * 100)/100,
        "units": "m",
        "altitude": altitude_deg,
        "azimuth": azimuth
      }
      horizon_line.features[0].geometry.coordinates[1] = f.geometry.coordinates
      if (horizon_line.features[0].geometry.coordinates[1].length === 2) {
        horizon_line.features[0].geometry.coordinates[1].push(elevation);
      }
    }
    if (max_altitude < makeEllipsoidAltitudeArray_seaLevel_altitude) {
      horizon_line.features[0].properties = {
        "label": heading + " " + makeEllipsoidAltitudeArray_seaLevel_altitude +"°",
        "distance": 35000,
        "units": "m",
        "altitude": makeEllipsoidAltitudeArray_seaLevel_altitude,
        "azimuth": azimuth
      }
      horizon_line.features[0].geometry.coordinates[1] = f.geometry.coordinates

    }

    if (i > 0) {
      // geodetic altitude
      // get location heights
      coords.from_ht  = 0 * htCvt;
      coords.to_ht    = 0 * htCvt;
      coords.from_elev = reference_elevation * htCvt;
      coords.to_elev = elevation * htCvt;
      coords.from_lat = geojson_d.features[0].geometry.coordinates[1];
      coords.from_lng = geojson_d.features[0].geometry.coordinates[0];
      coords.to_lat = f.geometry.coordinates[1];
      coords.to_lng = f.geometry.coordinates[0];
      coords.azimuth = azimuth;
      if (coords.distance === 0) {			// surface distance
  	     // not necessarily an error, but warn because altitude cannot
  	     // be calculated
      } else if (coords.calcGeodeticInverse() === true) {
        // try to get ellipsoidal azimuth and distance
      } else {
         // calculate altitude using spherical Earth if ellipsoidal
         // calculation fails to converge
         coords.calcAltitudeSpherical();
      }

      max_altitude_el = Math.max(max_altitude_el,coords.altitude);

      if (max_altitude_el === coords.altitude) {
        max_point_el = {altitude: Math.round(coords.altitude * 10000)/10000, dist: Math.round(coords.distance * 100)/100, lat: f.geometry.coordinates[0], lon: f.geometry.coordinates[1] , elev: coords.to_elev};
        horizon_line_el.features[0].properties = {
          "label": heading + " " + Math.round(coords.altitude * 10000)/10000 +"°",
          "distance": Math.round(coords.distance * 100)/100,
          "ellipsoid distance": Math.round(coords.el_dist * 100)/100,
          "surface distance": Math.round(coords.surf_dist * 100)/100,
          "units": "m",
          "altitude" : coords.altitude,
          "azimuth": azimuth
        }
        horizon_line_el.features[0].geometry.coordinates[1] = f.geometry.coordinates
        if (horizon_line_el.features[0].geometry.coordinates[1].length === 2) {
          horizon_line_el.features[0].geometry.coordinates[1].push(coords.to_elev);
        }
      }
      if (max_altitude_el < makeEllipsoidAltitudeArray_seaLevel_altitude) {
        horizon_line_el.features[0].properties = {
          "label": heading + " " + makeEllipsoidAltitudeArray_seaLevel_altitude +"°",
          "distance": 35000,
          "units": "m",
          "altitude" : makeEllipsoidAltitudeArray_seaLevel_altitude,
          "azimuth": azimuth
        }
        horizon_line_el.features[0].geometry.coordinates[1] = f.geometry.coordinates

      }

    }

  })


  fs.writeFileSync(path.join(data_dir,output),JSON.stringify(horizon_line));
  fs.writeFileSync(path.join(data_dir,output_el),JSON.stringify(horizon_line_el));
  if (max_point.lat != max_point_el.lat || max_point.lon != max_point_el.lon) {
    console.log("Points differ",azimuth);
    console.log(max_point);
    console.log(max_point_el);
  }
}

let file_suffix = "M-1011-";
let data_dir = makeEllipsoidAltitudeArray_data_dir;

async function makeHorizons() {

  let files = fs.readdirSync(data_dir);
  // console.log("makeHorizons: Base horizon files");
  // console.log(files);
  let data = [];
  files.forEach((f) => {
    if (f.indexOf("-Profile.geojson") > -1) {
      azimuth = parseFloat(f.substring(file_suffix.length,file_suffix.length + "109.8478".length));
      let azimuthStr = f.substring(file_suffix.length,file_suffix.length + "109.8478".length);
      geojson_profile = file_suffix + azimuthStr + "-Profile.geojson";
      text_profile = file_suffix + azimuthStr + "-Profile.txt";
      heading = azimuthStr + "°";
      name = file_suffix + heading + " horizon";
      output = file_suffix + azimuthStr + "-horizon.geojson";
      output_el = file_suffix + azimuthStr + "-horizon-ellipsoid.geojson";
      geojson_d = JSON.parse(fs.readFileSync(path.join(data_dir, geojson_profile)).toString());
      txt_d = fs.readFileSync(path.join(data_dir, text_profile)).toString();

      makeHorizon();
    }
  });
}

const stellarium_data_dir = makeEllipsoidAltitudeArray_data_dir;

async function makeAltitudeTableStellarium() {
  let files = fs.readdirSync(stellarium_data_dir);
  console.log("makeAltitudeTableStellarium: Base horizon files");
  console.log(files);
  let data = [];
  console.log("*****************************");
  console.log("Copy the below values in the appropriate place in the Stellarium 'horizon.txt' file.")
  files.forEach((f) => {
    if (f.indexOf("horizon-ellipsoid") > -1) {
      let d = JSON.parse(fs.readFileSync(path.join(stellarium_data_dir, f)).toString());
      let label = d.features[0].properties.label;
      label = label.replace(/°/g,"");
      console.log(label);
      let labels = label.split(",");
      data.push(labels);

    }
  });
  console.log("*****************************");
}


async function saveAltitudeData(d,ds) {
  let fd = {
    info: makeEllipsoidAltitudeArray_fd_info,
    data_synopsis: ds,
    data: d
  }

  let prefix = fd.info.reference.date_generated.slice(0,10) + "_" + fd.info.reference.date_generated.slice(11,19).replace(/\-|\:/g,"");
  let fn = prefix + makeEllipsoidAltitudeArray_output_file_name;
  let fp = path.join(makeEllipsoidAltitudeArray_output_dir,fn);
  fs.writeFileSync(fp,JSON.stringify(fd,null,2));
}

async function makeEllipsoidAltitudeArray() {
  let files = fs.readdirSync(makeEllipsoidAltitudeArray_data_dir);
  console.log(files);
  let data = [];
  let min_azimuth = 360;
  let max_azimuth = 0;
  let min_altitude = 99999;
  let max_altitude = -99999;
  files.forEach((f) => {
    if (f.indexOf("horizon-ellipsoid") > -1) {
      let d = JSON.parse(fs.readFileSync(path.join(makeEllipsoidAltitudeArray_data_dir, f)).toString());
      let azimuth = d.features[0].properties.azimuth;
      let altitude = d.features[0].properties.altitude;
      data.push([azimuth,altitude]);
      min_azimuth = Math.min(min_azimuth,azimuth);
      max_azimuth = Math.max(max_azimuth,azimuth);
      min_altitude = Math.min(min_altitude,altitude);
      max_altitude = Math.max(max_altitude,altitude);

    }
  });
  let synopsis = {
    min_azimuth: min_azimuth,
    max_azimuth: max_azimuth,
    azimuth_range: max_azimuth - min_azimuth,
    min_altitude: min_altitude,
    max_altitude: max_altitude,
    altitude_range: max_altitude - min_altitude
  }
  return {data,synopsis}
}

async function makeAltitudeData() {
  const {data,synopsis} = await makeEllipsoidAltitudeArray();
  await saveAltitudeData(data,synopsis);
}

(async function() {
  // make the -horizon.geojson and -horizon-ellipsoid.geojson files
  await makeHorizons();
  // make the _horizons.json file
  await makeAltitudeData();
  // output in the console the horizon data for Stellarium.
  await makeAltitudeTableStellarium();

})()
