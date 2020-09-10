const dropDown = d3.select("#selDataset");
const metaPanel = d3.select("#sample-metadata")

// populate drop down menu 
d3.json("samples.json").then(function(data){
    var dataNames = data.names
    dataNames.forEach(function(item){
        dropDown.append("Option").text(item).property("value", item)
    })
    optionChanged(dataNames[0])
})

function optionChanged(name) {    
    d3.json("samples.json").then(function(data){

        //Populate meta daata panel
        metaData(name)

        var samples = data['samples']

        //Bubble Chart Variables
        var otuIds = []
        var otuSamples = []
        var labels = []

        //Bar Chart Varibales
        var yticks = []
        var xValues = []
        //for each dictionary in the samples array
        samples.forEach(function(object){
            //Check to see if 
            //selected subject ID numbers is found in object
            if (object.id == name) {
                //If so, then
                //push the otu_ids, sample_values, and otu_labes arrays to the Bubble Chart Variables
                for (var i = 0; i < object.otu_ids.length; i++) {
                    otuIds.push(object.otu_ids[i])
                    otuSamples.push(object.sample_values[i])
                    labels.push(object.otu_labels[i])
                }
                //If the length of the otu_ids array is greater or equal to 10
                //then push the first 10 values to the Bar Chart Variables
                if(object['otu_ids'].length >= 10) {
                    for (var i = 0; i < 10; i++) {
                        yticks.push(`OTU ${object['otu_ids'][i]}`)
                        xValues.push(object['sample_values'][i])
                      }
                }
                //If the length is less than 10
                //push the entire array to the Bar chart values
                else if(object['otu_ids'].length < 10) {
                    for (var i = 0; i < object['otu_ids'].length; i++) {
                    yticks.push(`OTU ${object['otu_ids'][i]}`);
                    xValues.push(object['sample_values'][i]);
                    }
                }
            }
        })
        
        //bar plot
        var dataSet = [{
            type: 'bar',
            x: xValues.reverse(),
            y: yticks.reverse(),
            orientation: 'h'
        }]
        Plotly.newPlot('bar', dataSet)

        //bubble chart
        var bubbleLayout = {
            title: "Bacteria Culters Per Sample",
            hovermode: "closest",
            xaxis: { title: "OTU ID"},
            margin: {t: 30}
        }

        var bubbleData = [
            {
                x: otuIds,
                y: otuSamples,
                text: labels,
                mode: "markers",
                marker: {
                    size: otuSamples,
                    color: otuIds,
                    colorscale: "Earth"
                }
            }
        ]
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);  
    })
}

function metaData(input){
    var node = document.getElementById('sample-metadata');
    node.innerHTML = "";
    d3.json("samples.json").then(function(data) {
        var metadata = data.metadata
        metadata.forEach(function(object){
            if (object.id == input) {
                Object.entries(object).forEach(([key, value]) => metaPanel.append("h6").text(`${key.toUpperCase()}: ${value}`))
            }
        })
    })
}
