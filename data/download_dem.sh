bbox=1.8972,41.2460,2.3119,41.533
wget "http://www.ign.es/wcs/mdt?service=WCS&request=GetCoverage&version=1.0.0&format=GeoTIFF&coverage=mdt:Elevacion4258_25&bbox=$bbox&crs=EPSG:4258&resx=0.0005&resy=0.0005" -O DEM.tif
#gdaldem hillshade DEM.tif hillshade.tif -s 111120 -of GTiff
