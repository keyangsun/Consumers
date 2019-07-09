import * as d3 from 'd3'; 

export const filterByYear = function (state, year, name) {
    let sectors = ["residential", "transportation", "industrial", "commercial"];
    let filtered = [], datum, datumVal; 
    sectors.forEach( sector => {
        datum = {}; 
        datumVal = state[sector].data.filter( val => val[0] === year+"")[0][1];
        datum.sector = sector;
        datum.value = datumVal;
        datum.name = name; 
        filtered.push(datum); 
    });

    return  filtered;
};

export const eConsumed = function (data) {
    let totalE = data
        .map( datum => datum.value )
        .reduce( (sum, datum) => sum + datum);
    totalE = totalE / 1000000; 
    return totalE.toFixed(2); 
};

export const addToolTips = function () {
    const div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    d3.select('.main').selectAll("path")
        .on("mouseover", d => {
            div.transition()		
                .duration(120)		
                .style("opacity", .9)
                .style("background-color", "#efefef")
                .style("border-radius", "3px")	
                .style("padding", "4px")
                .style("position", "absolute");

            let innertext = d.data.name + "<br/>" +d.data.sector + "<br/>" 
                + (d.value/1000000).toFixed(2) + " quad";

            div	.html(innertext)
                .style("font-size", "12px")	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", () => {
            div.transition()		
                .duration(500)		
                .style("opacity", 0);
        }); 
};

export const makePieChart = function(data) {
    const radiusScale = d3.scaleSqrt()
    .domain([0, 11])
    .range([20, 157]); 

    const color = d3.scaleOrdinal()
        .range(["#d7d9b1","#84acce","#827191","#7d1d3f"]);

    const pie = d3.pie()
        .value( d => d === undefined ? undefined : d.value );

    const totalEnergy = eConsumed(data); 
    const radius = radiusScale(totalEnergy);  
    // const side = 295;
    const side = 2 * radius + 85;     

    const parent = d3.select(".main");

    const svg = parent.append("svg")
        .attr("width", side)
        .attr("height", side)
        .attr("class", "pie-chart");

    //Create group element to hold pie chart    
    const g = svg.append("g")
        .attr("transform", "translate(" + (side/2) + "," + (side/2) + ")");

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
        .attr("class", "pie-slice-path")
        .attr("fill", d => color( d.data.value ) )
        .transition() 
        .ease(d3.easeLinear)
        .duration(1000)
        .attrTween("d", function(b) {
            b.innerRadius = 0;
            const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, b); 
            return function(t) {return path(i(t));}; 
        });
        

    let innerText = data[0].name.toUpperCase() + " " + totalEnergy + " quad"; 
    if (innerText.includes("COLUMBIA")) {
        innerText = "D.C. " + innerText.slice(20); 
    }

    g.append("text")
        .text(innerText)
        .attr("text-anchor", "middle")
        .attr("y", `${radius + 20}`);
};

export const addLegend = function()  {

    const color = d3.scaleOrdinal()
        .range(["#d7d9b1", "#84acce", "#827191", "#7d1d3f"]);

    const sectors = ["residential", "transportation", "industrial", "commercial"]; 
    
    const legend = d3.select(".legend")
        .append("svg")
        .attr("width", 150)
        .attr("height", 80)
        .selectAll("g")
        .data(sectors)
        .enter().append("g")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function (d) { return d; });
};

export const pluckdata = function (sector, state, fetchedData, year) {
    let datum = fetchedData[state][sector]["data"]
        .filter(val => val[0] === year);
    return datum[0][1];
}; 

export const sortData = function(fetchedData, year, params = "ASC") {
    let final = []; 
    let arr, e, eCom, eRes, eInd, eTrans;
   
    for (let state in fetchedData) {
        if (state !== "United States") {
            eCom = pluckdata("commercial",state, fetchedData, year); 
            eRes = pluckdata("residential", state, fetchedData, year); 
            eInd = pluckdata("industrial", state, fetchedData, year); 
            eTrans = pluckdata("transportation", state, fetchedData, year); 
            e = eCom + eRes + eInd + eTrans; 
            arr = [state, e]; 
            final.push(arr); 
        }
    }

    final = myQuickSort(final, params); 
    let newKeys = []; 

    for (let j = 0; j < final.length; j++) {
        newKeys.push(final[j][0]); 
    }
    return newKeys; 
};

const myQuickSort = function(arr, params = "ASC") {
    if (arr.length <= 1) return arr; 

    let pivot = arr.pop();
    let left = [];
    let right = [];

    for(let i = 0; i < arr.length; i++) {
        if (arr[i][1] >= pivot[1]) {
            right.push(arr[i]);
        } else {
            left.push(arr[i]); 
        }
    }

    left = myQuickSort(left, params);
    right = myQuickSort(right, params); 

    if (params === "ASC") {
        return left.concat([pivot]).concat(right); 
    } else {
        return right.concat([pivot]).concat(left);
    }
};