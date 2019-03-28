//I coded this can delete if necesarry

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

//create a group element for our bottom axis (we'll be using the 'g')
svg.append('g').attr('class', 'xText'); // creates a child in the svg element that is <g></g>
//lets access our tag by targeting its class
let xText = d3.select('.xText');


//again, based off of the fact that we have a dynamic width we want our labels to move with the width this allows that to happen
function xTextRefresh() {
  xText.attr(
    'transform',
    `translate(${(width - labelArea) / 2 + labelArea}, ${height - margin - textPaddingBot})`
  );
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
