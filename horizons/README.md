# Horizon data sets

The primary purpose of these sets are a usage for the Stellarium program.

They are composed of a full 360° view when no buildings would obstruct the horizon.

They are constructed for a detailed section, covering the area of interest following the [Method](#Method for the detailed section).
The rest of the 360° view is a more coarse section (as well in granularity as precision) and is only present in the Stellarium horizon files.

From the work data as described in the [Method](#Method for the detailed section) section, only the geojson files of step 2 are available. 
The other ones are not provided due to a lack of space in the repository. They can be created by importing the provided files in QGis and following the method described.

Feature references like _M-1011_ are available in the site-features section of this repository.

This part of the repository contains its own citation files.

These horizons were used for the astronomical calculations in [Winter solstice at Mnajdra: The days without light](https://www.researchgate.net/publication/366485108_Winter_solstice_at_Mnajdra_The_days_without_light)


# Sets

- M-1011: Mnajdra South, winter solstice upright, closure point.

     Coordinates from the GNSS survey of Heritage Malta (Katya Stroud, Josef Caruana) and Ronald Poell on 2021-01-27:
     GNSS\_20210127\_GPS0062: 14.436185526231116, 35.82665894728086, 83.83999633789062
- M-1028: Mnajdra North, Room 7, Left Seat, Center back.

	The coordinates are derived through an interpolation of the distances to other GNSS points : M-1016 6.792, M-1017 5.979, M-1018 1.892, M-1019 4.701 (all GNSS points from the same survey as above)
    14.436240233803508, 35.82678401943594, 85.37999725341797

The M-1028 data set is declined in several variants required for the simulations of possible geological changes:

- altitude of the top of the lower back upright + 0 m, horizon at + 0 m.
- altitude of the top of the lower back upright + 1 m, horizon at + 0 m.
- altitude of the top of the lower back upright + 2 m, horizon at + 0 m.
- altitude of the top of the lower back upright + 3 m, horizon at + 0 m.
- altitude of the top of the lower back upright + 4 m, horizon at + 0 m.
- altitude of the top of the lower back upright + 0 m, horizon at - 1 m.
- altitude of the top of the lower back upright + 0 m, horizon at - 2 m.
- altitude of the top of the lower back upright + 0 m, horizon at - 3 m.
- altitude of the top of the lower back upright + 0 m, horizon at - 4 m.
- altitude of the top of the lower back upright + 1 m, horizon at - 1 m.
- altitude of the top of the lower back upright + 1 m, horizon at - 2 m.
- altitude of the top of the lower back upright + 1 m, horizon at - 3 m.
- altitude of the top of the lower back upright + 1 m, horizon at - 4 m.
- altitude of the top of the lower back upright + 2 m, horizon at - 2 m.
- altitude of the top of the lower back upright + 3 m, horizon at - 3 m.
- altitude of the top of the lower back upright + 4 m, horizon at - 4 m.


The sets provided consist of a json file and a corresponding Stellarium configuration set of files.

## Structure of the json file

```json
{
  "info": {
  	 ...
  },
  "data_synopsis": {
    "min_azimuth": 109.8221,
    "max_azimuth": 124.0006,
    "azimuth_range": 14.1785,
    "min_altitude": -0.272,
    "max_altitude": 2.013621435617044,
    "altitude_range": 2.2856214356170437
  },
  "data": [
    [ 109.8221, 2.013621435617044 ]
    ...
  ]
}
```

## Structure of a Stellarium directory


Each directory has 3 files:

- description.en.utf8
- horizon_mnajdra.txt
- landscape.ini

These directories should be placed in the Stellarium configuration directory, in the section "landscapes".


# Method used for determination of the altitudes of the detailed section

## Base data
SIntegraM data/service, (2018), Developing Spatial Data Integration for the Maltese Islands, Planning Authority, DTM_WGS84 (The DTM of Malta in WGS84 projection).

The area of interest (Mnajdra) is covered by the tiles T4964 and T4965.


## Step 1: Merging DTM tiles
The tiles T4964 and T4965 have been merged using gdal because the tool used for the elevation profiles does not work across several tiles.

```gdal_merge.py -ot Float32 -of GTiff -o /Path_To_Output/T4964-T4965.tif --optfile mergeInputFiles.txt```

mergeInputFiles.txt:

"/Path\_To\_Input/T4964.tif"<br>
"/Path\_To\_Input/T4965.tif"



## Step 2: Create the horizon azimuths in QGis
Using "Geodesic measure tool":

- manually add the starting point (e.g. M-1011) coordinates.
- Draw a line to the end of the DTM tile.
- Save the line in a (temporary) layer
- Export that layer in GeoJSON format (pattern : M-1011-[Azimuth].geojson) with CRS: EPSG:4326 - WGS 84

These files are provided.

## Step 3: Create the elevation profiles in QGis
Using the "Terrain profile" tool:

- Add the DTM tile.
- Use the "Selected polyline" option and select the line created in step 2
- In the "Settings" tab  select "Full resolution enabled". This will use the native resolution of the DTM.
- In the "Table" tab "Create Temporary layer"
- Export that layer in GeoJSON format (pattern : M-1011-[Azimuth]-Profile.geojson) with CRS: EPSG:4326 - WGS 84
- In the "Table" tab "Copy to clipboard (with coordinates)" and past that in a text file (pattern : M-1011-[Azimuth]-Profile.txt).

## Step 4: Generate the horizon files in Node.js
Using the program "get\_horizon\_data.js" makeHorizons().

This will generate for each of the .geojson files two horizon files:

- M-1011-[Azimuth]-horizon.geojson. The altitude is a calculated as rectangle triangle.
- M-1011-[Azimuth]-horizon-ellipsoid.geojson. The altitude is a calculated using the WGS 84 ellipsoid.

The label property contains the azimuth and altitude (for use in QGis).

Theoretical altitudes lower than sea-level altitude for this location are set at sea-level altitude and the distance at 35 Km.


# Code
The javascript provided is for reference purposes only. It is by no means a "ready-to-use" library.
It can be used as it is on the sample data provided, but it will need tuning to your needs if you want to use it for your own data. See the comments in the code to know what you should modify.


Usage:

- Install nodejs if needed
- **no need** for ```npm i```
- ```cd <repository dir>```
- run the code with:
    ```node get_horizon_data.js```
    

The code will generate for the provided files:

- ./data\_in/M-1011-109.8221-horizon-ellipsoid.geojson
- ./data\_in/M-1011-109.8221-horizon.geojson
- ./data\_out/2021-02-08\_070941\_M-1011-Winter-solstice-upright-closure-point_horizons.json

