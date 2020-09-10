var dropDown = d3.select("#selDataset");

// populate drop down menu 
d3.json("samples.json").then(function(data){
    var dataNames = data.names
    dataNames.forEach(function(item){
        dropDown.append("Option").text(item).property("value", item)
    })
    optionChanged(dataNames[0])
})

// horizontal bar chart

function optionChanged(name) {
    //Bubble Chart Variables
    var otuIds = []
    var otuSamples = []
    var labels = []

    //Bar Chartt Varibales
    var yticks = []
    var xValues = []
    
    //get otu Ids and Samples
    
    d3.json("samples.json").then(function(data){
        var samples = data['samples']

        //for each dictionary in the samples array
        //push values to chart variables
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
                    // otuIds.push(object['otu_ids'])
                    // otuSamples.push(object['sample_values'])
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
    console.log(otuIds)
    console.log(otuSamples)
    console.log(labels)
    console.log(yticks)
    console.log(xValues)
    console.log(dataSet)
    console.log(bubbleData)

}


// var dataSet = [{
//     type: 'bar',
//     x: otuSamples,
//     y: otuIds,
//     orientation: 'h'
// }]

// Plotly.newPlot('bar', dataSet)



// You can also define an anonymous function inline
// students.forEach(function(name) {
//     console.log(name);
//   });

// var dataSet = [{
//     type: 'bar',
//     x: [20, 14, 23],
//     y: ['giraffes', 'orangutans', 'monkeys'],
//     orientation: 'h'
//   }];
  
//   Plotly.newPlot('bar', data);



// // Use `Object.values` and `forEach` to iterate through keys
// Object.keys(userInfo).forEach(key => console.log(key));

// // Use `Object.values` and `forEach` to iterate through values
// Object.values(userInfo).forEach(value => console.log(value));

// // Use `Object.entries` and `forEach` to iterate through keys and values
// Object.entries(userInfo).forEach(([key, value]) => console.log(`Key: ${key} and Value ${value}`));
