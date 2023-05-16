var tornadoStats = new Map()

            var layout = {
                title: {
                text:'Tornado Stats',
                font: {
                    family: 'Courier New, monospace',
                    size: 24
                },
                xref: 'paper',
                x: 0.05,
                },
                xaxis: {
                title: {
                    text: 'Month',
                    font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                    }
                },
                },
                yaxis: {
                title: {
                    text: 'Year',
                    font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                    }
                }
                }
            };

            function linechart(){
                var state = document.getElementById('states').value
                d3.json("https://raw.githubusercontent.com/nburwick/Cerulean/main/static/Resources/Tornado_Tracks.geojson")
            .then(function(response) {
                

                // console.log("Response: ", response)
               processData(response)
               pickYear()
            })}

            function pickYear() {
                var year = document.getElementById("yearLine").value;
                plotGraph(tornadoStats, year)
            }

            async function processData(data) {
                // console.log("Features: ", data["features"])
                data["features"].forEach(feature => {
                    var year = feature["properties"]["yr"]
                    var month = feature["properties"]["mo"]
                    aggregateData(tornadoStats, year, month)
                });
                // console.log("Tornado Stats: ", tornadoStats)
                updateYearDropDown(tornadoStats)
            }

            function updateYearDropDown(tornadoStats) {
                var years = Object.keys(tornadoStats)
                years.sort((a,b) => d3.ascending(b,a))
                d3.select("#yearLine")
                .selectAll("option")
                .data(years)
                .enter()
                .append("option")
                .text(d => d)
                .attr("value", d => d)
            }

            function aggregateData(tornadoStats, year, month) {
                if (tornadoStats[year] === undefined) {
                    tornadoStats[year] = new Map();
                    for (let i = 1; i < 13; i++) {
                        tornadoStats[year][i] = 0;
                    }
                }
                tornadoStats[year][month]++;
            }

            function plotGraph(tornadoStats, year) {
                var TESTER = document.getElementById('line');
                var testYearData = tornadoStats[year] 
                var tempData = convertDataToGraph(testYearData)
                
                Plotly.newPlot( TESTER, [tempData], {
                title: { text: year + " Tornado Stats"},
                xaxis: { title: { text: "Month" } },
                yaxis: { title: { text: "Count" } },
            margin: { t: 100 }, height: 400 }
                );
            }

            function convertDataToGraph(yearData, year) {
                // console.log(yearData[1])
                var tempData = new Map()
                tempData["x"] = new Array()
                tempData["y"] = new Array()
                for (let i = 1; i < 13; i++) {
                    // console.log(i)
                    tempData["x"].push(getMonthName(i))
                    tempData["y"].push(yearData[i])
                }
                tempData["name"] = "TESTING"
                return tempData
            }

            function getMonthName(monthValue) {
                switch(monthValue) {
                    case 1: return "JAN"
                    case 2: return "FEB"
                    case 3: return "MAR"
                    case 4: return "APR"
                    case 5: return "MAY"
                    case 6: return "JUN"
                    case 7: return "JUL"
                    case 8: return "AUG"
                    case 9: return "SEP"
                    case 10: return "OCT"
                    case 11: return "NOV"
                    case 12: return "DEC"
                    
                }
            }
            linechart();