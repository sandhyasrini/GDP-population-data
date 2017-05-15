let fs = require("fs");

// Create the base directory to hold all the jsons
let jSONDirExists = true;


// Save the continent names in a JSON
createContinentsJSON();

// Save the Country and continent mapping
createCountriesAndContinentJSON();

// function call to create the JSON String representation of the data
createJSONFromFile( './data/population.csv' );  // accepts the raw content's file path

// Function to create JSON for Graph 1,2,3
function createJSONForGraph123( processedData ) {
  let graphDataArray = [];
  let noOfRows = processedData.length;

  for (let i = 0; i < noOfRows; i++) {
    graphDataArray[i] = {
      countryName : processedData[i][0],
      population2013 : processedData[i][5],
      gdp2013 : processedData[i][9],
      pp2013 : processedData[i][17]
    };
  }

  let fileName = "graph123";
  writeJSONToDisk( fileName, JSON.stringify( graphDataArray ) );// Write to disk

} // End createJSONForGraph123()


function createJSONForGraph1( processedData ) {
  let graphDataArray = [];
  let noOfRows = processedData.length;

  for (let i = 0; i < noOfRows; i++) {
    graphDataArray[i] = {
      countryName : processedData[i][0],
      population2013 : processedData[i][5],

    };
  }

  let fileName = "graph1";
  writeJSONToDisk( fileName, JSON.stringify( graphDataArray ) );// Write to disk

} // End createJSONForGraph123()


// Function to create JSON for Graph 2, Growth in Population and Purchasing Power from 2010 to 2013
function createJSONForGraph2( processedData ) {
  let graphDataArray = [];
  let noOfRows = processedData.length;

  for (let i = 0; i < noOfRows; i++) {
    graphDataArray[i] = {
      countryName : processedData[i][0],
      population2010 : processedData[i][2],
      population2011 : processedData[i][3],
      population2012 : processedData[i][4],
      population2013 : processedData[i][5],
      pp2010 : processedData[i][14],
      pp2011 : processedData[i][15],
      pp2012 : processedData[i][16],
      pp2013 : processedData[i][17]
    };
  }

  let fileName = "pop_pp_growth_graph";
  writeJSONToDisk( fileName, JSON.stringify( graphDataArray ) );// Write to disk

} // End createJSONForGraph2()

// Function to create JSON for Graph 3, Population and GDP by continents
function createJSONForGraph3( processedData ) {
  let graphDataArray = [];
  let noOfRows = processedData.length;

  for (let i = 0; i < noOfRows; i++) {
    graphDataArray[i] = {
      countryName : processedData[i][0],
      population2010 : processedData[i][2],
      population2011 : processedData[i][3],
      population2012 : processedData[i][4],
      population2013 : processedData[i][5],
      gdp2010 : processedData[i][6],
      gdp2011 : processedData[i][7],
      gdp2012 : processedData[i][8],
      gdp2013 : processedData[i][9]
    };
  }

  let fileName = "continent_wise_graph";
  writeJSONToDisk( fileName, JSON.stringify( graphDataArray ) );// Write to disk

} // End createJSONForGraph3()

// function to create a JSON String
function createJSONFromFile( file ) {
  let fileName = file.substr( file.lastIndexOf("/") + 1, file.length );
  console.log("Started reading file " + file );
  let rawData = fs.readFileSync( file );
  console.log("Completed reading file " + file );

  rawData = rawData.toString();

  // letious parameters for createJSONFromFile() function
  let newLineCharacter = /\r\n|\n/;
  let delim = ",";
  let isDataQuoted = false;
  let lines = rawData.split( newLineCharacter );
  let noOfLines = lines.length;
  let noOfCols = ( lines[0].split( delim) ).length;
  let noOfRows = 0;
  let processedData = [];
  for( let i = 0; i < noOfLines; i++ ) {
    let line = lines[i];
    if( line != null && line != '' && line.length != 0 ) {
      noOfRows ++;
      let tokens = line.split( delim );
      processedData.push( tokens ); // pushes a line of tokens, which is an array, into the processedData[] array
    }
  }




  // Create the graph specific JSONs
  createJSONForGraph123( processedData );
  createJSONForGraph2( processedData );
  createJSONForGraph3( processedData );
    createJSONForGraph1( processedData );


} // End createJSONFromFile





// Function to create continents JSON
function createContinentsJSON() {
  // let continents = ["\"AFRICA\"","\"ANTARCTICA\"","\"ASIA\"","\"AUSTRALIA\"","\"EUROPE\"","\"NORTH AMERICA\"","\"SOUTH AMERICA\""];
  let continents = ["AFRICA","ANTARCTICA","ASIA","AUSTRALIA","EUROPE","NORTH AMERICA","SOUTH AMERICA"];
  writeJSONToDisk("continents", JSON.stringify( continents ) );
} // End createContinentsJSON()

// Function to create a JSON representing the mapping between Country and its continent
function createCountriesAndContinentJSON() {
  //let continents = ["AFRICA","ANTARCTICA","ASIA","AUSTRALIA","EUROPE","NORTH AMERICA","SOUTH AMERICA"];
  let content = fs.readFileSync('output/continents.json');
  let continents = JSON.parse( content.toString() );
  let countriesAndContinents = [
     { country:"ARGENTINA", continent:continents[6] },
     { country:"AUSTRALIA", continent:continents[3] },
     { country:"BRAZIL", continent:continents[6] },
     { country:"CANADA", continent:continents[5] },
     { country:"CHINA", continent:continents[2] },
     { country:"FRANCE", continent:continents[4] },
     { country:"GERMANY", continent:continents[4] },
     { country:"INDIA", continent:continents[2] },
     { country:"INDONESIA", continent:continents[2] },
     { country:"ITALY", continent:continents[4] },
     { country:"JAPAN", continent:continents[2] },
     { country:"MEXICO", continent:continents[5] },
     { country:"RUSSIA", continent:continents[2] },
     { country:"SAUDI ARABIA", continent:continents[2] },
     { country:"SOUTH AFRICA", continent:continents[0] },
     { country:"REPUBLIC OF KOREA", continent:continents[2] },
     { country:"TURKEY", continent:continents[2] },
     { country:"UNITED KINGDOM", continent:continents[4] },
     { country:"USA", continent:continents[5] },
     { union:"EUROPEAN UNION", continent:continents[4] }
     ];

    writeJSONToDisk('countriesAndContinents', JSON.stringify( countriesAndContinents ) );
} // End createCountriesAndContinentJSON()

// Function to write the contents to disk
function writeJSONToDisk( fileName, content ) {
  let jSONFileName = fileName + '.json';

  if( jSONDirExists ) {
    fs.writeFileSync('output/' + jSONFileName, content );
    console.log("Completed writing \"" + fileName + "\" to output/" + jSONFileName);
    // console.log(content);
  } else {
    console.log("Could not write " + fileName + " to disk. json directory does not exist.");
  }
} // End writeJSONToDisk()

