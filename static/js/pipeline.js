// Connect to Flask API

var dataGlobal;

async function update_api(state) {
  try {
    let st = state || "all";
    var url = `http://localhost:8000/api/v1.0/${st}`;
    const response = await d3.json(url);
    dataGlobal = response;
    return dataGlobal;
  } catch (error) {
    // Handle any errors that occur during the API request
    console.error(error);
    throw error; // Propagate the error further if needed
  }
}