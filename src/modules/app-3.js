import * as d3 from 'd3'

export class App {

	constructor() {

		this.quatro = document.getElementsByClassName("quartet");

		this.database = [{
			id : 0,
			path : './assets/season-1.svg',
			svg : null
		},{
			id : 1,
			path : './assets/season-2.svg',
			svg : null
		},{
			id : 2,
			path : './assets/season-3.svg',
			svg : null
		},{
			id : 3,
			path : './assets/season-4.svg',
			svg : null
		}]

		this.setup()

	}

	setup() {

		var self = this

		var array =[]

		for (const map of self.database) {

			d3.xml(map.path)
		    .then(data => {
		        document.getElementsByClassName("quartet")[map.id].append(data.documentElement);
		        array.push(map.id)
		        if (array.length===4) {
		        	self.init()
		        }

		    })

		}

	}

	colourizer(rgb) {

		var self = this

	  	let sep = rgb.indexOf(",") > -1 ? "," : " ";

	  	var rgbArr = rgb.substr(4).split(")")[0].split(sep);

		var r = rgbArr[0] / 255;
		var g = rgbArr[1] / 255;
		var b = rgbArr[2] / 255;

		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, v = max;
		var d = max - min;
		s = max == 0 ? 0 : d / max;

		if (max == min) {
			h = 0;
		} else {
			switch (max) {
			  case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			  case g: h = (b - r) / d + 2; break;
			  case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}

  		return (h>0)? self.blue(s) : self.red(s) ;

	}

	red(sat) {
		return (sat>=0.66) ? 'More than 10 days' :
		(sat>=0.53) ? '8 to 10 days' :
		(sat>=0.44) ? '6 to 8 days' :
		(sat>=0.53) ? '4 to 6 days' :
		(sat>=0.53) ? '2 to 4 days' : '0 to 2 days'
	}

	blue(sat) {
		return (sat>= 0.67) ? ' Less than -10 days' :
		(sat>= 0.58) ? ' -8 to -10 days' :
		(sat>= 0.45) ? '-6 to -8 days' :
		(sat>= 0.38) ? '-4 to -6 days' :
		(sat>= 0.25) ? '-2 to -4 days' : '0 to -2 days'
	}

	init() {

		var self = this

		var svg = d3.selectAll("svg");

		console.log(svg)

		var groups = svg.selectAll("g polygon")

	    groups.on("mousemove",function(d){

	    	var p = d3.select(this).style('fill')

	    	var label = self.colourizer(p);

            d3.select(".tooltip").html(`${label}`)
				.style("visibility", "visible")
				.style("left", (d3.event.pageX) + "px")     
				.style("top", (d3.event.pageY) + "px");   

	    })
	    .on("mouseout",function(){

	    	d3.select(".tooltip").style("visibility", "hidden");

	    });

	    var scale = [,{
	    	colour : '#ff5656',
	    	value : ' > 10'
	    },{
	    	colour : '#ff7676',
	    	value : '8 to 10'
	    },{
	    	colour : '#ff8c8c',
	    	value : '6 to 8'
	    },{
	    	colour : '#ffa0a0',
	    	value : '4 to 6'
	    },{
	    	colour : '#ffc0c0',
	    	value : '2 to 4'
	    },{
	    	colour : '#ffe0e0',
	    	value : '0 to 2'
	    },{
	    	colour : '#dedeff',
	    	value : '-2 to 0'
	    },{
	    	colour : '#bebeff',
	    	value : '-4 to -2'
	    },{
	    	colour : '#9e9eff',
	    	value : '-6 to -4'
	    },{
	    	colour : '#8a8aff',
	    	value : '-8 to -6'
	    },{
	    	colour : '#6a6aff',
	    	value : '-10 to -8'
	    },{
	    	colour : '#5454ff',
	    	value : ' < -10'
	    }]

	    scale.reverse()

        var keySvg = d3.select("#keyContainer").append("svg")
                .attr("width", scale.length * 50)
                .attr("height", "60px")
                .attr("id", "keySvg")

        var keySquare = 42

        scale.forEach(function(d, i) {

            keySvg.append("rect")
                .attr("x", keySquare * i)
                .attr("y", 0)
                .attr("width", keySquare)
                .attr("height", 30)
                .attr("fill", d.colour)
                .attr("stroke", "#dcdcdc")
        })

        scale.forEach(function(d, i) {

            keySvg.append("text")
	            .attr("x", keySquare * i)
	            .attr("text-anchor", "start")
	            .attr("y", 40)
	            .attr("class", "keyLabel").text(d.value)
         
        })

	}

}