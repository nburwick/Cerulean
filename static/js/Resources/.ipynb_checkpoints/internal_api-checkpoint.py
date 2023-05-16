# Import Dependencies

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, jsonify
import datetime as dt

# Database setup
# Create mongo
uri = 'mongodb+srv://nburwick:Swim_Fast01@cluster0.nvujnf4.mongodb.net/?retryWrites=true&w=majority'
server = ServerApi('1')
# Create a new client and connect to the server
mongo = MongoClient(uri, server_api=server)
fema_data = mongo['fema_data']
tornados = fema_data['tornado_data']

# Define Home Page
@app.route("/")
def home():
    return (
    f"<h2>Welcome to Tornado Alley</h2>"
    f"<pre>Available routes are:"
    f"<ul><li>All Data - /api/v1.0/all</li></ul>"
    f"<pre>         Returns all data as a GeoJSON."
    f"<ul><li>State Data (Single State) - /api/v1.0/state</li></ul>"
    f"<pre>         Returns all data for the given state."

# Get All Data
@app.route("/api/v1.0/all")
def all_data():
    try:
        geoJSON = list(tornados.find({}))
        geoJSON = [{"geometry": doc['geometry'], "properties": doc['properties'], "type": doc['type']}
                   for doc in geoJSON]
        return jsonify(geoJSON)
    except:
        return jsonify({'error':"An Error has occurred"})
        
        
# Get Data per state
@app.route("/api/v1.0/<state>")
def state_data():
    st = str(state)
    try:
        geoJSON = list(tornados.find({"properties.st": st}))
        geoJSON = [{"geometry": doc['geometry'], "properties": doc['properties'], "type": doc['type']} 
                   for doc in geoJSON]
        return jsonify(geoJSON)
    except:
        return jsonify({'error': "A state was not selected or available"})