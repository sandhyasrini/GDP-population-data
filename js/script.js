var margin = {top: 20, right: 20, bottom: 140, left: 80},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(19);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(16);

var populationTip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Population :</strong> <span style='color:red'>" + d.population2013 + " &times;10<sup>6</sup></span>";
  });

var gdpTip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-12, 0])
  .html(function(d) {
    return "<strong>GDP : $</strong> <span style='color:red'>" + d.gdp2013 + "&times;10<sup>9</sup></span>";
  });

var purchasingPowerTip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>$</strong> <span style='color:red'>" + d.pp2013 + "&times;10<sup>9</sup></span>";
  });

var continentsPopTip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Population : </strong> <span style='color:red'>" + d.continentPopulation + "&times;10<sup>6</sup></span>";
  });

var continentGDPTip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>GDP :</strong> <span style='color:red'>" + d.continentGDP + "&times;10<sup>9</sup></span>";
  });

// Growth Graph tooltips
var growthPop2011Tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>2010-2011:</strong> <span style='color:red'>" + d.popGrowth2011 + "&times;10<sup>6</sup></span>";
  });

var growthPop2012Tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>2011-2012 :</strong> <span style='color:red'>" + d.popGrowth2012 + "&times;10<sup>6</sup></span>";
  });

var growthPop2013Tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>2012-2013:</strong> <span style='color:red'>" + d.popGrowth2013 + "&times;10<sup>6</sup></span>";
  });

  var growthPp2011Tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>2010-2011:</strong> <span style='color:red'>" + d.ppGrowth2011 + "&times;10<sup>9</sup></span>";
    });

  var growthPp2012Tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>2011-2012 :</strong> <span style='color:red'>" + d.ppGrowth2012 + "&times;10<sup>9</sup></span>";
    });

  var growthPp2013Tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>2012-2013:</strong> <span style='color:red'>" + d.ppGrowth2013 + "&times;10<sup>9</sup></span>";
    });



/*.............................................................................
                  Graph : Population in 2013 Vs Country
..............................................................................*/
var svg1 = d3.select("#graphWrap1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("border","1px solid #aaa")
    .style("box-shadow","inset 0 0 2px #aaa")
    .style("border-top-left-radius","3px")
    .style("border-top-right-radius","3px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg1.call(populationTip);

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
        if( parseFloat( plottingData[j].population2013 ) < parseFloat( plottingData[j+1].population2013 ) ) {
            var temp = plottingData[j];
            plottingData[j] = plottingData[j+1];
            plottingData[j+1] = temp;
        }
      }
    }

    x.domain( plottingData.map( function(d) { return d.countryName; } ) );
    y.domain( [0, parseFloat(plottingData[0].population2013) + 40] ); // After sorting the data in descending order

    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + 5) + ")")
        .call(xAxis)
      .append("text")
        .attr("x", 420)
        .attr("y", 100)
        .attr("dy", ".71em")
        .style("font-size",20)
        .style("text-anchor", "middle")
        .text( data[0].countryName);

    d3.selectAll(".x .tick text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg1.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -200)
        .attr("y", -60)
        .attr("dy", ".71em")
        .style("font-size",20)
        .style("text-anchor", "middle")
        .text( data[0].population2013 );

    svg1.selectAll(".bar")
          .data( plottingData )
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.countryName); })
        .attr("width", 40)
        .attr("y", function(d) { return y(parseFloat(d.population2013)); })
        .attr("height", function(d) { return height - y(parseFloat(d.population2013)); })
        .on('mouseover', populationTip.show)
        .on('mouseout', populationTip.hide);
  });
});





