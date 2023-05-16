# Project 3

![alt text](https://github.com/nburwick/Cerulean/blob/main/images/readme_pic.png)

For centuries, tornadoes have raised concerns as one of the most violent and devastating natural disasters. With their immense power and high-speed winds, they cause extensive damage, amounting to millions or even billions of dollars, impacting buildings, infrastructure, and the environment. The comprehensive dataset provided by FEMA offers valuable insights into tornadoes in the United States, including occurrence counts, affected regions, fatalities, property loss, and average intensity.

Given the widespread destruction and frequency of tornado occurrences across the United States, the primary objective of this project is to uncover valuable insights, such as identifying the regions that have suffered the most from tornadoes between 1950 and 2022. This analysis will consider factors such as property loss, fatalities, areas most affected, and the magnitudes of tornadoes in order to gain a deeper understanding of their impact.

## Our team:
- Manxuan Zhang 
- Tom Laverty
- Nathon Burwick
- Jessica Hartman
- Brandy Bowden
- Julie Tang
- Victoria Sanders
- Ramnath Gowrishankar
- Arthi Ranganathan
- Ratima Chowadee
- Alireza Shams

## Built with:
- Python
- Flask
- MongoDB
- HTML
- CSS
- JavaScript
- D3

## Installation
To run the app:
1. Git clone- https://github.com/nburwick/Cerulean.git
2. CD into local directory
3. CD into Flask directory
4. Run python app.py
5. Launch Go Live Server in VSCode for index.html


## Implementation Details
This repository provides a collection of scripts and files that demonstrate the project's key features including:

1. MongoDB Tornado Data.ipynb - Performs the ETL, which includes:
    1. Requesting an API endpoint
    2. Saving this data as a MongoDB database for future use

2. index.html - 
    1. Accesses all the libraries being used in the dashboard
    2. Displays various page contents:
        1. Dropdown menus to view data by state and year
        2. Links to JavaScript and CSS files to render various visualizations

3.  pipeline.js - 
    1. Creates and calls the data via the "update_api" function to call data (can be called in other JS Scripts)
    2. Accesses all the functions to build the map

4. style.css - This file stores all the styling specifications for various “ids” and “classes” in the index.html file.

## Credits
- FEMA Tornado Data: https://gis-fema.hub.arcgis.com/datasets/fedmaps::tornado-tracks-1/about 
- D3.js documentation: https://d3js.org
- Leaflet.js
- Plotly.js