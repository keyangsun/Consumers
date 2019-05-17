import * as d3 from 'd3';
import { filterByYear, eConsumed } from './util';

const makePie = function (year) {
    d3.json("/data/data.json")
    .then( fetchedData => {

        const keys = ["West Virginia", "Pennsylvania", "Wyoming", "Iowa", 
            "Idaho", "Illinois", "Indiana", "Kansas", "Kentucky", "Louisiana", 
            "Massachusetts", "Maryland", "Maine", "Michigan", "Minnesota", 
            "Missouri", "Mississippi", "Rhode Island", "Montana", "New York", 
            "Alaska", "Alabama", "Arkansas", "North Carolina", "North Dakota", 
            "Nebraska", "New Hampshire", "New Jersey", "New Mexico", "Nevada", 
            "Ohio", "Oklahoma", "Oregon", "South Carolina", "Tennessee", 
            "South Dakota", "Texas", "Utah", "Virginia", "Vermont", "Washington", 
            "Wisconsin", "Arizona", "California", "Colorado", "Connecticut", 
            "Georgia", "Florida", "Hawaii", "Delaware"]; 

        keys.forEach( state => {

            const data = filterByYear(fetchedData[state], year);
            const totalEnergy = eConsumed(data); 

            const radiusScale = d3.scaleSqrt()
                .domain([0, 10])
                .range([50, 300]); 

            const radius = radiusScale(totalEnergy),  
                side = radius * 2;   

            const parent = d3.select(".main");

            const svg = parent.append("svg")
                .attr("width", side)
                .attr("height", side)
                .attr("class", "pie-chart");

            //Create group element to hold pie chart    
            const g = svg.append("g")
                .attr("transform", "translate(" + radius + "," + radius + ")");

            const color = d3.scaleOrdinal()
                .range(["#d7d9b1","#84acce","#827191","#7d1d3f"]);

            const pie = d3.pie()
                .value( d => d.value );

            const path = d3.arc()
                .outerRadius(radius)
                .innerRadius(radius/1.6)
                .padAngle(0.02)
                .padRadius(200)
                .cornerRadius(2);

            const arc = g.selectAll("arc")
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", "pie-slice");

            arc.append("path")
                .attr("d", path)
                .attr("fill", d => color(d.data.value) );
            
            const div = d3.select("body").append("div")	
                .attr("class", "tooltip")				
                .style("opacity", 0);

            const innerText = state.toUpperCase() + " " + totalEnergy + " quad"; 

            g.append("text")
                .text(innerText)
                .attr("font", "arial")
                .attr("text-anchor", "middle");

            d3.selectAll("path")
                .on("mouseover", (d,i) => {
                    div.transition()		
                        .duration(200)		
                        .style("opacity", .9)	
                        .style("position", "absolute");

                    div	.html( (d.value/1000000).toFixed(2) + " quad" )	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY) + "px");
                })
                .on("mouseout", (d,i) => {
                    div.transition()		
                        .duration(500)		
                        .style("opacity", 0);
                }); 
        })
    });
}

export default makePie; 