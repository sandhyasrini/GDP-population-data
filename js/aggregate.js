
/*.............................................................................
          Graph : GDP and Population by continent
..............................................................................*/
var svg6 = d3.select("#graphWrap6").append("svg")
    .attr("width", width + margin.left + margin.right + 60)
    .attr("height", height + margin.top + margin.bottom)
    .style("border","1px solid #aaa")
    .style("box-shadow","inset 0 0 2px #aaa")
    .style("border-top-left-radius","3px")
    .style("border-top-right-radius","3px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg6.call( continentsPopTip );
svg6.call( continentGDPTip );

d3.json("./output/countriesAndContinents.json", function( countriesAndContinents ) {

  var noOfCountries = countriesAndContinents.length;
  // To get continents array
  var continents = [];
  for (var i = 0; i < noOfCountries; i++) {
    var found = false;
    for (var j = 0; j < continents.length; j++) {
      if ( countriesAndContinents[i].continent == continents[j] ) {
        found = true;
        break;
      }
    }

    if ( !found ) {
      continents.push(countriesAndContinents[i].continent);
    }
  }

  // Function to check whether an entry is a country
  function isCountry( countryName ) {
    for (var i = 0; i < noOfCountries; i++) {
      if( countryName.toUpperCase() == countriesAndContinents[i].country)
        return true;
    }
    return false;
  }
  // Function to check whether an entry is a country
  function isUnion( countryName ) {
    for (var i = 0; i < noOfCountries; i++) {
      if( countryName.toUpperCase() == countriesAndContinents[i].union)
        return true;
    }
    return false;
  }

  // To read the graph 1 JSON
  d3.json("./output/continent_wise_graph.json",function( data ) {

    // Filtering the parsed data to get the plotting data
    var initialPlottingData = data.filter( function( countryDetails ) {
      if( isCountry( countryDetails.countryName.toUpperCase() ) || isUnion( countryDetails.countryName.toUpperCase() ) ) {
        return countryDetails;
      }
    })



    var plottingData = [];


    // To aggregate Population and GDP data for countries and add in plottingData
    var initialPlottingDataLen = initialPlottingData.length;
    for (var i = 0; i < continents.length; i++) {
      var continentData = {
        continentName : continents[i],
        continentPopulation : 0,
        continentGDP : 0
      };
      plottingData.push( continentData );
      for (var j = 0; j < initialPlottingDataLen; j++) {
        var country = initialPlottingData[j].countryName;
        for (var k = 0; k < noOfCountries; k++) {
          if ( country.toUpperCase() == countriesAndContinents[k].country &&  continents[i] == countriesAndContinents[k].continent ) {
            plottingData[i].continentPopulation += parseFloat( parseFloat( initialPlottingData[j].population2013 ).toPrecision(3) );
            plottingData[i].continentGDP += parseFloat( parseFloat( initialPlottingData[j].gdp2013 ).toPrecision(3) );
            break;
          }
        }// End For 3
      }// End For 2
    }// End For 1

    // To find the domain[] for y-axis
    var yDomainPopMax = plottingData[0].continentPopulation;
    for (var i = 0; i < plottingData.length; i++) {
      if ( yDomainPopMax < plottingData[i].continentPopulation ) {
        yDomainPopMax = plottingData[i].continentPopulation;
      }
    }
    var yDomainGDPMax = plottingData[0].continentGDP;
    for (var i = 0; i < plottingData.length; i++) {
      if ( yDomainGDPMax < plottingData[i].continentGDP ) {
        yDomainGDPMax = plottingData[i].continentGDP;
      }
    }

    var yGDP = d3.scale.linear()
        .range([height, 0])
        .domain([0,yDomainGDPMax + 40]);

    var yGDPAxis = d3.svg.axis()
        .scale(yGDP)
        .orient("left")
        .ticks(16);


    x.domain( continents );
    y.domain( [0, yDomainPopMax + 40] );


    svg6.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + 5) + ")")
        .call(xAxis)
      .append("text")
        .attr("x", 420)
        .attr("y", 100)
        .attr("dy", ".71em")
        .style("font-size",20)
        .style("text-anchor", "middle")
        .text( "Continents" );

    d3.selectAll(".x .tick text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg6.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -220)
        .attr("y", -60)
        .attr("dy", ".71em")
        .style("font-size",20)
        .style("text-anchor", "middle")
        .text( "Population (2013) in Millions" );

        // Y-axiss for GDP
    svg6.append("g")
        .attr("class", "y axis rt-axis")
        .attr("transform","translate(860,0)")
        .call(yGDPAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -200)
        .attr("y", 55)
        .attr("dy", ".71em")
        .style("font-size",20)
        .style("text-anchor", "middle")
        .text( "GDP(2013) in Billions" );

    svg6.selectAll(".rt-axis line")
        .attr("x2",6);

    svg6.selectAll(".rt-axis .tick text")
        .attr("x",9)
        .style("text-anchor","start");

    svg6.select(".rt-axis path")
        .attr("d","M6,0H0V440H6");

    svg6.selectAll(".populationBar")
          .data( plottingData )
      .enter().append("rect")
        .attr("class", "bar populationBar")
        .attr("x", function(d) { return x(d.continentName); })
        .attr("width", 60)
        .attr("y", function(d) { return y(parseFloat(d.continentPopulation)); })
        .attr("height", function(d) { return height - y(parseFloat(d.continentPopulation)); })
        .on('mouseover', continentsPopTip.show)
        .on('mouseout', continentsPopTip.hide);

    svg6.selectAll(".gDPBar")
          .data( plottingData )
      .enter().append("rect")
        .attr("class", "bar gDPBar")
        .attr("x", function(d) { return x(d.continentName) + 62; })
        .attr("width", 60)
        .attr("y", function(d) { return yGDP(parseFloat(d.continentGDP)); })
        .attr("height", function(d) { return height - yGDP(parseFloat(d.continentGDP)); })
        .on('mouseover', continentGDPTip.show)
        .on('mouseout', continentGDPTip.hide);

    svg6.append("rect")
        .attr("height",15)
        .attr("width",15)
        .attr("fill","#a54dff")
        .attr("x", 10);


    svg6.append("rect")
        .attr("height",15)
        .attr("width",15)
        .attr("fill","#3399ff")
        .attr("x", 100);

    svg6.append("text")
        .attr("class","legend-text")
        .text("Population")
        .attr("x", 30)
        .attr("y", 13);

    svg6.append("text")
        .attr("class","legend-text")
        .text("GDP")
        .attr("x", 120)
        .attr("y", 13);

  });
});
