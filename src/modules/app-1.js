import * as d3 from 'd3'

export class App {

	constructor() {

		this.setup()

	}

	async setup() {

		var self = this

		d3.xml('./assets/map-1.svg')
	    .then(data => {

	    	document.getElementById("svg_container").append(data.documentElement);

	        self.init()

	    })


	}

	init() {
		
		var timespan = [{
			name : 'area-1',
			days : '20 to 30 days'
		},{
			name : 'area-2',
			days : '30 to 50 days'
		},{
			name : 'area-3',
			days : '20 to 30 days'
		},{
			name : 'area-4',
			days : '10 to 20 days'
		},{
			name : 'area-5',
			days : '10 to 20 days'
		},{
			name : 'area-6',
			days : '0 to 10 days'
		},{
			name : 'area-7',
			days : '0 to 10 days'
		},{
			name : 'area-8',
			days : '0 to 10 days'
		},{
			name : 'area-9',
			days : '0 to 10 days'
		}]

		var svg = d3.selectAll("svg");

		var groups = svg.selectAll("g")

	    groups.on("mousemove",function(d){

	    	var info = d3.select(this).attr("id")

	        var ndays = timespan.find( (item) => item.name === info)

            d3.select(".tooltip").html(`${ndays.days}`)
				.style("visibility", "visible")
				.style("left", (d3.event.pageX) + "px")     
				.style("top", (d3.event.pageY) + "px");   

	    })
	    .on("mouseout",function(){

	    	d3.select(".tooltip").style("visibility", "hidden");

	    });

	    var scale = [{
	    	colour : '#ffcaca',
	    	value : '0'
	    },{
	    	colour : '#ffa4a4',
	    	value : '10'
	    },{
	    	colour : '#ff9292',
	    	value : '20'
	    },{
	    	colour : '#ff8080',
	    	value : '30 to 50'
	    }]

        var keySvg = d3.select("#keyContainer").append("svg")
                .attr("width", scale.length * 50)
                .attr("height", "60px")
                .attr("id", "keySvg")

        var keySquare = 30

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