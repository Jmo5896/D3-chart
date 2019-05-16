'use strict';

//section 1 set up data and get ready for chart creation
let width = parseInt(d3.select('#scatter').style('width')); //selecting html element and giving it some css with style
let height = width - width / 3.9; //this calculates the height based off the width to keep a specific ratio

//all of these are just storing values for fairly specific parts of the chart, the names say it all
let margin = 20;
let labelArea = 120;
let textPaddingBot = 40;
let textPaddingLeft = 40;

//now we get into setting up our d3 workspace.
//This actually creates an <svg></svg> element in the DOM with all of the specifications we just gave it.
let svg = d3
  .select('#scatter')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('class', 'chart');

//  set up for our scatter plot dots radius, we will do this with a function (may come back to make it cleaner)
// since the width is dynamic this function allows our dots to also be dynamic, on desktop the width is set at 825 so circRadius should be 10.
let circRadius;
function getCircle() {
  if (width <= 530) {
    circRadius = 5;
  } else {
    circRadius = 10;
  }
}
getCircle();

//axes labeling
//BOTTOM AXIS================================================

//These should help clean-up our transform later
let botTextX = (width - labelArea) / 2 + labelArea;
let botTextY = height - margin - textPaddingBot;

//create a group element for our bottom axis (we'll be using the 'g')
svg.append('g').attr('class', 'xText'); // creates a child in the svg element that is <g></g>
//lets access our tag by targeting its class
let xText = d3.select('.xText');

//again, based off of the fact that we have a dynamic width we want our labels to move with the width this allows that to happen
function xTextRefresh() {
  xText.attr('transform', `translate(${botTextX}, ${botTextY})`);
}
xTextRefresh();

//Now, lets add our actual labels, we will be adding 3 just to cover the bonus of this project
//POVERTY LABEL
xText
  .append('text')
  .attr('y', -26)
  .attr('data-name', 'poverty')
  .attr('data-axis', 'x')
  .attr('class', 'aText active x') //this active class will switch to inactive later on click
  .text('In Poverty (%)');

//AGE LABEL
xText
  .append('text')
  .attr('y', 0)
  .attr('data-name', 'age')
  .attr('data-axis', 'x')
  .attr('class', 'aText inactive x')
  .text('Age (Median)');

//INCOME LABEL
xText
  .append('text')
  .attr('y', 26)
  .attr('data-name', 'income')
  .attr('data-axis', 'x')
  .attr('class', 'aText inactive x')
  .text('Household Income (Median)');

//BOTTOM AXIS================================================

//LEFT AXIS==================================================

//These should help clean-up our transform later
let leftTextX = margin + textPaddingLeft;
let leftTextY = (height + labelArea) / 2 - labelArea;

//now lets create our label space with another g tag (<g></g>)
svg.append('g').attr('class', 'yText');

let yText = d3.select('.yText');

//same as before dynamic function for y axis
function yTextRefresh() {
  yText.attr(
    'transform',
    'translate(' + leftTextX + ', ' + leftTextY + ')rotate(-90)' //the rotate is thrown in so the labels are parrallel to the y-axis
  );
}
yTextRefresh();

//OBESITY
yText
  .append('text')
  .attr('y', 26)
  .attr('data-name', 'obesity')
  .attr('data-axis', 'y')
  .attr('class', 'aText active y')
  .text('Obese (%)');

//SMOKES
yText
  .append('text')
  .attr('y', 0)
  .attr('data-name', 'smokes')
  .attr('data-axis', 'y')
  .attr('class', 'aText inactive y')
  .text('Smokes (%)');

//LACKS HEALTHCARE
yText
  .append('text')
  .attr('y', -26)
  .attr('data-name', 'healthcare')
  .attr('data-axis', 'y')
  .attr('class', 'aText inactive y')
  .text('Lacks Healthcare (%)');

//LEFT AXIS==================================================

//IMPORT .CSV DATA===========================================

d3.csv('assets/data/data.csv').then(data => visualize(data));

//IMPORT .CSV DATA===========================================

//SETTING UP THE VISUALIZE FUNCTION(everything else goes here)

function visualize(theData) {
  //these will determine which data goes where
  let dataX = 'poverty';
  let dataY = 'obesity';

  //empty variables to store our min and max values
  let xMin;
  let xMax;
  let yMin;
  let yMax;

  //now to set up our tool-tip (d3-tip.js)
  let toolTip = d3
    .tip()
    .attr('class', 'd3-tip')
    .offset([40, -60])
    .html(d => {
      let xKey = `<div>${dataX}: ${d[dataX]}%</div>`;//sets our default //we will set the value in a conditional below
      let theState = `<div>${d.state}</div>`; //??? no idea what state is
      let yKey = `<div>${dataY}: ${d[dataY]}%</div>`; //d magic(can't figure out how to look at the d object)
      
      return theState + xKey + yKey;
    });
  //lets use the toolTip
  svg.call(toolTip);

  //FUNCTIONS==================================================

  //x min and max func
  function xMinMax() {
    xMin = d3.min(theData, d => parseFloat(d[dataX]) * 0.9); //somehow grabs smallest one
    xMax = d3.max(theData, d => parseFloat(d[dataX]) * 1.1); //somhow grabs the biggest (mystery)
  }

  //y min and max func
  function yMinMax() {
    yMin = d3.min(theData, d => parseFloat(d[dataY]) * 0.9); //somehow grabs smallest one
    yMax = d3.max(theData, d => parseFloat(d[dataY]) * 1.1); //somhow grabs the biggest (mystery)
  }

  //this function will be used to switch our label classes between active and inactive
  function labelChange(axis, clickedText) {
    //switches active to inactive
    d3.selectAll('.aText')
      .filter('.' + axis)
      .filter('.active')
      .classed('active', false)
      .classed('inactive', true);

    //switches clicked label from inactive to active
    clickedText.classed('inactive', false).classed('active', true);
  }
  //FUNCTIONS==================================================

  //POPULATE SCATTER PLOT======================================

  xMinMax();
  yMinMax();

  //this seems like an awful way to set up min and max, may look into a different way but will keep for now
  //lets create some scales using our min and max's
  let xScale = d3.scaleLinear()
    .domain([xMin, xMax])//no idea what this does
    .range([margin + labelArea, width - margin]);//pure magic
  
  let yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);
  
  //now we'll pass these scales into the axes
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);

  //now for the tick count
  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    } else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  //now to create more group tags (<g></g>) to store our axes
  svg.append('g') //xaxis
    .call(xAxis)
    .attr('class', 'xAxis')
    .attr('transform', `translate(0, ${height - margin - labelArea})`);
  svg.append('g') //yaxis
    .call(yAxis)
    .attr('class', 'yAxis')
    .attr('transform', `translate(${margin + labelArea}, 0)`);
  
  //Lets create our actual dots
  let theCircles = svg.selectAll('g theCircle').data(theData).enter();


  //lets populate our graph with theCircles
  theCircles.append('circle')
    .attr('cx', d => xScale(d[dataX]))
    .attr('cy', d => yScale(d[dataY]))
    .attr('r', circRadius)
    .attr('class', d => `stateCircle ${d.abbr}`) //this pulls the US state abbreviation from the d object
    .on('mouseover', function(d){
      toolTip.show(d, this);
      d3.select(this).style('stroke', "#323232");
    })
    .on('mouseout', function(d){
      toolTip.hide(d);
      d3.select(this).style('stroke', "#e3e3e3");
    });
  //POPULATE SCATTER PLOT======================================

  //LABEL SCATTER POINTS W/ STATE ABREVIATIONS=================

  theCircles.append('text')
    .text(d => d.abbr)
    .attr('dx', d => xScale(d[dataX]))
    //this should center the state abbr into the middle of the circle
    .attr('dy', d => yScale(d[dataY]) + circRadius / 2.5)
    .attr('font-size', circRadius)
    .attr('class', 'stateText')
    .on('mouseover', d => {
      toolTip.show(d);
      //highlight the circles border
      d3.select('.' + d.abbr).style('stroke', "#323232");
    })
    .on('mouseout', d => {
      toolTip.hide(d);
      d3.select('.' + d.abbr).style("stroke", "#e3e3e3");
    })

  //LABEL SCATTER POINTS W/ STATE ABREVIATIONS=================
}
//SETTING UP THE VISUALIZE FUNCTION(everything else goes here)
