import get from './ajax'
import * as d3 from 'd3'


export class App {

	constructor() {

		this.database = [{
			path : `assets/season-1.svg`,
			canvas : null,
			context : null,
			image : null
		}]

		this.init()

	}

	domNodeToString(domNode) {
		var element = document.createElement("div");
		element.appendChild(domNode);
		return element.innerHTML;
	}

	loadSVG() {

		var self = this

		get(`assets/season-1.svg`).then((response)=>{
			var svg = Array.from(
		    new DOMParser()
		      .parseFromString(response,'image/svg+xml')
		      .childNodes
		  ).filter(node=>{
		    let tag=node.tagName
		    if(typeof tag=='undefined') return false
		    return tag.toLowerCase()=='svg'
		  })[0]

		  //d3.select('#map-1 svg')

		this.database[0].canvas = document.createElement('canvas');

		this.database[0].canvas.width = 370 //svg.viewBox.baseVal.width;

		this.database[0].canvas.height = 342.83//svg.viewBox.baseVal.height;

		this.database[0].context = this.database[0].canvas.getContext("2d");
		
		this.database[0].image = new Image();

		var svg_xml = new XMLSerializer().serializeToString(document.querySelector('#map-1 svg'));

		//(new XMLSerializer()).serializeToString(svg);

		this.database[0].image.onload = function() {

			self.database[0].context.drawImage(self.database[0].image, 0, 0, 370, 342.83);

		}

		this.database[0].image.src = "data:image/svg+xml;base64," + btoa(svg_xml);

		document.body.appendChild(this.database[0].canvas);

		this.init()


      })

	}

	colourizer(rgb) {

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

  		return [ h, s, v ];

	}

	init() {

		var self = this

		var svg = d3.selectAll("svg");

		var groups = svg.selectAll("g polygon")

	    groups.on("mousemove",function(d){

	    	var p = d3.select(this).style('fill')

	    	var hsl = self.colourizer(p);

    		console.log(hsl)

	        var testing = 'Testing tooltip 1 2 3'

            d3.select(".tooltip").html(`${testing}`)
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

	rgbToHsl(r, g, b) {
	  r /= 255, g /= 255, b /= 255;

	  var max = Math.max(r, g, b), min = Math.min(r, g, b);
	  var h, s, l = (max + min) / 2;

	  if (max == min) {
	    h = s = 0; // achromatic
	  } else {
	    var d = max - min;
	    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

	    switch (max) {
	      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	      case g: h = (b - r) / d + 2; break;
	      case b: h = (r - g) / d + 4; break;
	    }

	    h /= 6;
	  }

	  return [ h, s, l ];
	}

    hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(r, g, b) {
	    if (r > 255 || g > 255 || b > 255)
	        throw "Invalid color component";
	    return ((r << 16) | (g << 8) | b).toString(16);
    }


}