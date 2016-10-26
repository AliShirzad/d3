/**
 * Created by alish on 9/3/2016 AD.
 */


//var data = [09,23,84,09,82,048,028,50,23,6,24,62,43,62];


    //JSON data

var data = [
    {key: "هزینه‌های عملیاتی",                                            value: 20698468},
    {key: "بهای تمام ‌شده درآمدهای عملیاتی",                                    value: 19817908},
    {key: "سود (زیان) ناخالص",                                               value: 19880560},
    {key: "هزینه‌های فروش، اداری و عمومی",                                    value: 10966220},
    {key: "سایر درآمدهای عملیاتی",                                           value: 7287920},
    {key: "سود (زیان) عملیاتی",                                              value: 15643132},
    {key: "هزینه‌های مالی",                                                   value: 8796630},
    {key: "سایر درآمدها و هزینه‌های غیرعملیاتی",                              value: 9227980},
    {key: "سود (زیان) قبل از احتساب سهم گروه از سود شرکت‌های وابسته",         value: 15786267},
    {key: "سهم گروه از سود شرکت‌های وابسته",                                  value: 7524440},
    {key: "سود (زیان) عملیات در حال تداوم قبل از مالیات",                     value: 12238711},
    {key: "سود (زیان) خالص عملیات در حال تداوم",                             value: 16238711}

];

//Set the width and height of the svg

var w = 1200;
var h = 750;

    //Set margin inside svg

var margin = {
    top: 120,
    bottom: 290,
    left: 190,
    right: 190
}

    //Adjusting width and height respective to margin inside svg

var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

    //Creating ordinal scale d3 Version 3

var x = d3.scale.ordinal()
    .domain(data.map(function(e){
        return e.key;
    }))
    .rangeBands([0, width]);

    //Creating Linear Scale

var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d){
        return d.value;
    })])
    .range([height, 0])

    //Set Color Range using Linear Scale

var linearColorStyle = d3.scale.linear()
    .domain([0, data.length])
    .range(['#b71c1c','#FFF59D']);


    //Selecting distinct color for each column using d3 internal function category20()

var ordinalColorStyle = d3.scale.category20();


    //Creating X Axis using svg namespace

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

    //Creating Y Axis using svg namespace

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

    //Creating GridLine with the size of
    // tick size with no tick format for Y axis

var yGridLine = d3.svg.axis()
    .scale(y)
    .tickSize(-width, 0, 0)
    .tickFormat('')
    .orient('left');


    //Creating main svg and adding width and height to the chart

var svg = d3.select('body').append('svg')
    .attr('id', 'chart')
    .attr('width', w)
    .attr('height', h);


    //Grouping the whole <plot> for adding margin and positioning
    //Adding classed adds class to existing class names

var chart = svg.append('g')
    .classed('display', true)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    //Creating button used for
    // sorting <bars> and <data>

var controls = d3.select('body')
    .append('div')
    .attr('id', 'controls')

var sort_btn = controls.append('button')
    .html('sort data: ascending')
    .attr('state', 0); // 'state' is a custom attribute for choosing between ascending and descending


// To update plot instead of adding on top of previous plot we make drawAxis function

function drawAxis(params){
    //calling GridLine for Y Axis
    //Draw the gridline
    this.append('g')
        .call(params.gridlines)
        .classed('gridline', true)
        .attr('tranform', 'translate(0, 0)');
}


//Creating plot function to make reusable code

function plot(params){
    x.domain(data.map(function(e){
        return e.key;
    }));

    y.domain([0, d3.max(data, function(d){
        return d.value;
    })]);

    //call function let's us explicitly define what 'this' will be within the draw axis
    drawAxis.call(this, params)




    //There are three phases to the data in svg
    //enter()       data bounds to elements
    //update()      elements that bound updated
    //exit()        unbound elements is removed


        //Creating bar from data
        // using <selectAll().data().enter()> phase


    //enter()
    this.selectAll('.bar')
        .data(params.data)
        .enter()
        .append('rect')
        .classed('bar', true);


        //Creating bar-label from existing data
        // using <selectAll().data().enter()> phase

    this.selectAll('.bar-label')
        .data(params.data)
        .enter()
        .append('text')
        .classed('bar-lable', true);



    //update()
    this.selectAll('.bar')
        .transition()
        //.update() this is implicit
        .attr('x', function(d, i){
            return x(d.key);
        })
        .attr('y', function(d, i){
            return y(d.value);
        })
        .attr('width', function(d, i){
            return x.rangeBand();
        })
        .attr('height', function(d, i){
            return height - y(d.value);
        })
        .style('fill', function(d, i){
            //return ordinalColorStyle(i);
            return linearColorStyle(i) ;
        });



    this.selectAll('.bar-lable')
    //.update() and is implicit .data() already bound
        .attr('x', function (d, i){
            return x(d.key) + (x.rangeBand()/2);
        })
        .attr('dx', -30)
        .attr('y', function(d, i){
            return y(d.value);
        })
        .attr('dy', -6)
        .text(function(d){
            return d.value;
        })

    //exit()
    this.selectAll()
        .data(params.data)
        .exit()
        .remove();


    this.selectAll('.bar-lable')
        .data(params.data)
        .exit()
        .remove();






    //Calling tick content for the X Axis
    //that was created outside plot function

    this.append('g')
        .classed('x axis', true)
        .attr('transform', 'translate('+ 0 +', ' + height +')')
        .call(params.axis.x)
            .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', -8)
                .attr('dy', 8)

                // It is possible to rotate tick contents 45 degrees
                // using <transform translate rotate>

                .attr('transform', 'translate(0, 0) rotate(-45)');


    //Calling tick content for the Y Axis
    //that was created outside plot function

        this.append('g')
            .classed('y axis', true)
            .attr('transform', 'translate(0 , 0)')
            .call(params.axis.y);

    //Adding Unit Label to Y Axis

    this.selectAll('.y.axis')
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .style('text-anchor', 'middle')
        .style('font-size', 28)
        .attr('transform', 'translate(0, -50) rotate(-90)')
        .text('ریال')

    //Adding Unit Label to X Axis

    this.selectAll('.x.axis')
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .style('text-anchor', 'middle')
        .style('font-size', 28)
        .attr('transform', 'translate(' + (width+80) +', 0) ')
        .text('سود و زیان')

}

//Creating button function for sorting
// <data> and <bar>

sort_btn.on('click', function(){
    var self = d3.select(this); //<this> refers to the sort button.
    var ascending = function(a, b){
        return a.value - b.value;
    };
    var descending = function(a, b){
        return b.value - a.value;
    };
    var state = +self.attr('state'); // plus(+) sign makes self.attr() number as default it is string.
    var txt = 'Sort data: ';
    if(state === 0){
        data.sort(ascending);
        state = 1;
        txt += 'descending';
    }else if(state === 1){
        data.sort(descending);
        state = 0;
        txt += 'ascending';
    }
    self.attr('state', state); // Assigns state attribute to state variable.
    self.html(txt); //Changes the button text in every click relative to state variable.





    //Add interactivity to sorting button
    
sort_btn.on('click ', function(){
    var self = d3.select(this);
    var ascending = function (a, b) {
        return a.value - b.value;
    };
    var descending = function(a, b){
        return b.value - a.value;
    };
    var state = +self.attr('state');
    var txt = 'Sort Data: ';
    if (state === 0 ){
        data.sort(ascending);
        state = 1;
        txt += 'descending';
    } else if( state === 1){
        data.sort(descending);
        state = 0;
        txt += 'ascending';
    }
    console.log(data);
    self.attr('state', state);
    self.html(txt);
    });


plot.call(chart,
    {data: data,
        //Creating flexible plot function
        axis:{
            x: xAxis,
            y: yAxis
        },
        gridlines: yGridLine
    })
});




    //Calling the plot function with arguments
    // Grouped function <chart> and <JSON data>

plot.call(chart,
    {data: data,
        //Creating flexible plot function
    axis:{
        x: xAxis,
        y: yAxis
    },
    gridlines: yGridLine
    }
);

