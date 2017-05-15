/*.............................................................................
      Graph : Growth in Population and Purchasing Power from 2010 to 2013
..............................................................................*/
var svg4 = d3.select("#graphWrap4").append("svg")
    .attr("width", width + margin.left + margin.right + 100)
    .attr("height", height + margin.top + margin.bottom)
    .style("border","1px solid #aaa")
    .style("box-shadow","inset 0 0 2px #aaa")
    .style("border-top-left-radius","3px")
    .style("border-top-right-radius","3px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg4.call( growthPp2011Tip );
svg4.call( growthPp2012Tip );
svg4.call( growthPp2013Tip );
svg4.call( growthPop2011Tip );
svg4.call( growthPop2012Tip );
svg4.call( growthPop2013Tip );


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
  d3.json("./output/pop_pp_growth_graph.json",function( data ) {

    // Filtering the parsed data to get the plotting data
    var initialPlottingData = data.filter(function( countryDetails ) {
      if( isCountry(countryDetails.countryName.toUpperCase() ) ) {
        return countryDetails;
      }
    })
    var len = initialPlottingData.length;
    var plottingData = [];
    for (var i = 0; i < len; i++) {
      var countryGrowth = {
        countryName : initialPlottingData[i].countryName,
        popGrowth2011 : parseFloat(( parseFloat( initialPlottingData[i].population2011 ) - parseFloat( initialPlottingData[i].population2010 ) ).toPrecision(3)),
        popGrowth2012 : parseFloat(( parseFloat( initialPlottingData[i].population2012 ) - parseFloat( initialPlottingData[i].population2011 ) ).toPrecision(3)),
        popGrowth2013 : parseFloat(( parseFloat( initialPlottingData[i].population2013 ) - parseFloat( initialPlottingData[i].population2012 ) ).toPrecision(3)),
        ppGrowth2011 : parseFloat(( parseFloat( initialPlottingData[i].pp2011 ) - parseFloat( initialPlottingData[i].pp2010 ) ).toPrecision(3)),
        ppGrowth2012 : parseFloat(( parseFloat( initialPlottingData[i].pp2012 ) - parseFloat( initialPlottingData[i].pp2011 ) ).toPrecision(3)),
        ppGrowth2013 : parseFloat(( parseFloat( initialPlottingData[i].pp2013 ) - parseFloat( initialPlottingData[i].pp2012 ) ).toPrecision(3))
      }
      plottingData.push( countryGrowth );
    }
    console.log( plottingData );
    // // Using Bubble Sort to sort the data in Descending order
    // for (var i = 0; i < len-1; i++) {
    //   for (var j = 0; j < len-i-1; j++) {
    //     if( parseFloat( plottingData[j].pp2013 ) < parseFloat( plottingData[j+1].pp2013 ) ) {
    //         var temp = plottingData[j];
    //         plottingData[j] = plottingData[j+1];
    //         plottingData[j+1] = temp;
    //     }
    //   }
    // }

        // To find the domain[] for y-axis
        var yDomainPopMax = plottingData[0].popGrowth2011 + plottingData[0].popGrowth2012 + plottingData[0].popGrowth2013;
        for (var i = 1; i < plottingData.length; i++) {
          if ( yDomainPopMax < ( plottingData[i].popGrowth2011 + plottingData[i].popGrowth2012 + plottingData[i].popGrowth2013 )) {
            yDomainPopMax = plottingData[i].popGrowth2011 + plottingData[i].popGrowth2012 + plottingData[i].popGrowth2013;
          }
        }
        console.log("yDomainPopMax = " + yDomainPopMax);
        var yDomainPPMax = plottingData[0].ppGrowth2011 + plottingData[0].ppGrowth2012 + plottingData[0].ppGrowth2013;
        for (var i = 1; i < plottingData.length; i++) {
          if ( yDomainPPMax < ( plottingData[i].ppGrowth2011 + plottingData[i].ppGrowth2012 + plottingData[i].ppGrowth2013 ) ) {
            yDomainPPMax = plottingData[i].ppGrowth2011 + plottingData[i].ppGrowth2012 + plottingData[i].ppGrowth2013;
          }
        }
        console.log("yDomainPPMax = " + yDomainPPMax);

        x.domain( plottingData.map( function( country ){ return country.countryName; }) );

        var yPop = d3.scale.linear()
            .range([height, 0])
            .domain( [0, yDomainPopMax + 2] );

        var yPopAxis = d3.svg.axis()
            .scale(yPop)
            .orient("left")
            .ticks(16);

        var yPP = d3.scale.linear()
            .range([height, 0])
            .domain([0,yDomainPPMax + 40]);

        var yPPAxis = d3.svg.axis()
            .scale(yPP)
            .orient("left")
            .ticks(16);

        svg4.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height + 5) + ")")
            .call(xAxis)
          .append("text")
            .attr("x", 420)
            .attr("y", 100)
            .attr("dy", ".71em")
            .style("font-size",20)
            .style("text-anchor", "middle")
            .text( "Countries" );

        d3.selectAll(".x .tick text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end");

        svg4.append("g")
            .attr("class", "y axis")
            .call(yPopAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -220)
            .attr("y", -60)
            .attr("dy", ".71em")
            .style("font-size",20)
            .style("text-anchor", "middle")
            .text( "Population Growth in Millions" );

            // Y-axiss for PP
        svg4.append("g")
            .attr("class", "y axis rt-axis")
            .attr("transform","translate(860,0)")
            .call(yPPAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -200)
            .attr("y", 55)
            .attr("dy", ".71em")
            .style("font-size",20)
            .style("text-anchor", "middle")
            .text( "Purchasing Power Growth in Billions" );

        svg4.selectAll(".rt-axis line")
            .attr("x2",6);

        svg4.selectAll(".rt-axis .tick text")
            .attr("x",9)
            .style("text-anchor","start");

        svg4.select(".rt-axis path")
            .attr("d","M6,0H0V440H6");

        svg4.selectAll(".populationBar2011")
              .data( plottingData )
          .enter().append("rect")
            .attr("class", "bar populationBar2011")
            .attr("x", function(d) { return x(d.countryName) + 4; })
            .attr("width", 16)
            .attr("y", function(d) { return yPop(parseFloat(d.popGrowth2011)); })
            .attr("height", function(d) { return height - yPop(parseFloat(d.popGrowth2011) > 0 ? parseFloat(d.popGrowth2011) : -parseFloat(d.popGrowth2011) ); })
            .on('mouseover', growthPop2011Tip.show)
            .on('mouseout', growthPop2011Tip.hide);

        svg4.selectAll(".populationBar2012")
              .data( plottingData )
          .enter().append("rect")
            .attr("class", "bar populationBar2012")
            .attr("x", function(d) { return x(d.countryName) + 4; })
            .attr("width", 16)
            .attr("y", function(d) { return yPop(parseFloat(d.popGrowth2011) + parseFloat(d.popGrowth2012) );  })
            .attr("height", function(d) {
              return height - ( yPop( parseFloat(d.popGrowth2012) > 0 ? parseFloat(d.popGrowth2012) : -parseFloat(d.popGrowth2012)) );
            })
            .on('mouseover', growthPop2012Tip.show)
            .on('mouseout', growthPop2012Tip.hide);

        svg4.selectAll(".populationBar2013")
              .data( plottingData )
          .enter().append("rect")
            .attr("class", "bar populationBar2013")
            .attr("x", function(d) { return x(d.countryName) + 4; })
            .attr("width", 16)
            .attr("y", function(d) { return yPop(parseFloat(d.popGrowth2011) + parseFloat(d.popGrowth2012) + parseFloat(d.popGrowth2013) );  })
            .attr("height", function(d) { return height - yPop( parseFloat(d.popGrowth2013) > 0 ? parseFloat(d.popGrowth2013) : -parseFloat(d.popGrowth2013) ); })
            .on('mouseover', growthPop2013Tip.show)
            .on('mouseout', growthPop2013Tip.hide);

        svg4.selectAll(".pPBar2011")
              .data( plottingData )
          .enter().append("rect")
            .attr("class", "bar pPBar2011")
            .attr("x", function(d) { return x(d.countryName) + 22; })
            .attr("width", 16)
            .attr("y", function(d) { return yPP(parseFloat(d.ppGrowth2011)); })
            .attr("height", function(d) { return height - yPP(parseFloat(d.ppGrowth2011)); })
            .on('mouseover', growthPp2011Tip.show)
            .on('mouseout', growthPp2011Tip.hide);

        svg4.selectAll(".pPBar2012")
              .data( plottingData )
          .enter().append("rect")
            .attr("class", "bar pPBar2012")
            .attr("x", function(d) { return x(d.countryName) + 22; })
            .attr("width", 16)
            .attr("y", function(d) { return yPP(parseFloat(d.ppGrowth2011) + parseFloat(d.ppGrowth2012) ); })
            .attr("height", function(d) { return height - yPP(parseFloat(d.ppGrowth2012)); })
            .on('mouseover', growthPp2012Tip.show)
            .on('mouseout', growthPp2012Tip.hide);

        svg4.selectAll(".pPBar2013")
              .data( plottingData )
          .enter().append("rect")
            .attr("class", "bar pPBar2013")
            .attr("x", function(d) { return x(d.countryName) + 22; })
            .attr("width", 16)
            .attr("y", function(d) { return yPP(parseFloat(d.ppGrowth2011) + parseFloat(d.ppGrowth2012) + parseFloat(d.ppGrowth2013)); })
            .attr("height", function(d) { return height - yPP(parseFloat(d.ppGrowth2013)); })
            .on('mouseover', growthPp2013Tip.show)
            .on('mouseout', growthPp2013Tip.hide);

    var populationLegend =  svg4.append("g");
        populationLegend.append("text")
            .attr("class","legend-text")
            .text("Population Growth")
            .attr("x", 10)
            .attr("y", -10);

        populationLegend.append("rect")
            .attr("height",15)
            .attr("width",15)
            .attr("fill","#80ccff")
            .attr("x", 10)
            .attr("y", 5);
        populationLegend.append("text")
            .attr("class","legend-text")
            .text("2012-2013")
            .attr("x", 30)
            .attr("y", 18);

        populationLegend.append("rect")
            .attr("height",15)
            .attr("width",15)
            .attr("fill","#4db8ff")
            .attr("x", 10)
            .attr("y", 35);
        populationLegend.append("text")
            .attr("class","legend-text")
            .text("2011-2012")
            .attr("x", 30)
            .attr("y", 48);

        populationLegend.append("rect")
            .attr("height",15)
            .attr("width",15)
            .attr("fill","#0099ff")
            .attr("x", 10)
            .attr("y", 65);
        populationLegend.append("text")
            .attr("class","legend-text")
            .text("2010-2011")
            .attr("x", 30)
            .attr("y", 78);

        var purPowerLegend = svg4.append("g")
                                .attr("transform", "translate(680,0)");

        purPowerLegend.append("text")
            .attr("class","legend-text")
            .text("Purchasing Power Growth")
            .attr("x", 43)
            .attr("y", -10);

        purPowerLegend.append("rect")
            .attr("height",15)
            .attr("width",15)
            .attr("fill","#ffe680")
            .attr("x", 155)
            .attr("y", 5);
        purPowerLegend.append("text")
            .attr("class","legend-text")
            .text("2012-2013")
            .attr("x", 80)
            .attr("y", 18);

        purPowerLegend.append("rect")
            .attr("height",15)
            .attr("width",15)
            .attr("fill","#ffdb4d")
            .attr("x", 155)
            .attr("y", 35);
        purPowerLegend.append("text")
            .attr("class","legend-text")
            .text("2011-2012")
            .attr("x", 80)
            .attr("y", 48);


        purPowerLegend.append("rect")
            .attr("height",15)
            .attr("width",15)
            .attr("fill","#ffcc00")
            .attr("x", 155)
            .attr("y", 65);
        purPowerLegend.append("text")
            .attr("class","legend-text")
            .text("2010-2011")
            .attr("x", 80)
            .attr("y", 78);


  });
});

