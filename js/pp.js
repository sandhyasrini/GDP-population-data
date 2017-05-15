/*.............................................................................
          Graph : Purchasing Power in 2013 Vs Country
..............................................................................*/
var svg3 = d3.select("#graphWrap3").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("border","1px solid #aaa")
    .style("box-shadow","inset 0 0 2px #aaa")
    .style("border-top-left-radius","3px")
    .style("border-top-right-radius","3px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg3.call( purchasingPowerTip );

d3.json("./output/countriesAndContinents.json", function( countriesAndContinents ) {

  var noOfCountries = countriesAndContinents.length;
  // Function to check whether an entry is a country
  function isCountry( countryName ) {
    for (var i = 0; i < noOfCountries; i++) {
      if( countryName.toUpperCase() == countriesAndContinents[i].country)
        return true;
    }
    return false;
  }


  // To read the graph 1 JSON
  d3.json("./output/graph123.json",function( data ) {

    // Filtering the parsed data to get the plotting data
    var plottingData = data.filter(function( countryDetails ) {
      if( isCountry(countryDetails.countryName.toUpperCase() ) ) {
        return countryDetails;
      }
    })
    var len = plottingData.length;

    // Using Bubble Sort to sort the data in Descending order
    for (var i = 0; i < len-1; i++) {
      for (var j = 0; j < len-i-1; j++) {
        if( parseFloat( plottingData[j].pp2013 ) < parseFloat( plottingData[j+1].pp2013 ) ) {
            var temp = plottingData[j];
            plottingData[j] = plottingData[j+1];
            plottingData[j+1] = temp;
        }
      }
    }

    x.domain( plottingData.map( function(d) { return d.countryName; } ) );
    y.domain( [0, parseFloat(plottingData[0].pp2013) + 40] ); // After sorting the data in descending order

    svg3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + 5) + ")")
        .call(xAxis)
      .append("text")
        .attr("x", 420)
        .attr("y", 100)
        .attr("dy", ".71em")
        .style("font-size",20)
        .style("text-anchor", "middle")
        .text( data[0].countryName );

    d3.selectAll(".x .tick text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg3.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -220)
        .attr("y", -60)
        .attr("dy", ".71em")
        .style("font-size",20)
        .style("text-anchor", "middle")
        .text( data[0].pp2013 );

    svg3.selectAll(".bar")
          .data( plottingData )
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.countryName); })
        .attr("width", 40)
        .attr("y", function(d) { return y(parseFloat(d.pp2013)); })
        .attr("height", function(d) { return height - y(parseFloat(d.pp2013)); })
        .on('mouseover', purchasingPowerTip.show)
        .on('mouseout', purchasingPowerTip.hide);;
  });
});

