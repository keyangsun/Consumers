import * as d3 from 'd3';
import { sliderHorizontal } from 'd3-simple-slider';
import { filterByYear, addToolTips, makePieChart, addLegend } from './util';

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

keys.sort(); 

d3.json("data/data.json")
    .then( fetchedData => {
        
        const year = 1970; 
        keys.forEach( state => {
            const data = filterByYear(fetchedData[state], year, state);
            makePieChart(data); 
        });
        addToolTips();
        addLegend(); 

        // // slider 
        // var data = [0, 0.005, 0.01, 0.015, 0.02, 0.025];
        // var sliderStep = d3
        //     .sliderHorizontal()
        //     .min(d3.min(data))
        //     .max(d3.max(data))
        //     .width(300)
        //     .tickFormat(d3.format('.2%'))
        //     .ticks(5)
        //     .step(0.005)
        //     .default(0.015)
        //     .on('onchange', val => {
        //         d3.select('p#value-step').text(d3.format('.2%')(val));
        //     });

        // var gStep = d3
        //     .select('div#slider-step')
        //     .append('svg')
        //     .attr('width', 500)
        //     .attr('height', 100)
        //     .append('g')
        //     .attr('transform', 'translate(30,30)');

        // gStep.call(sliderStep);

        // d3.select('p#value-step').text(d3.format('.2%')(sliderStep.value()));
        // //slider end
        
        // testing; 
        
        document.querySelector("#button").addEventListener("click", () => {
            const input = document.querySelector("input");
            const newYear = Math.floor(Number(input.value)); 
            if (newYear >= 1970 && newYear <= 2016 ) {
                d3.selectAll("svg")
                    .remove();
                d3.selectAll(".tooltip")
                    .remove();
                keys.forEach(state => {
                    const data = filterByYear(fetchedData[state], newYear, state);
                    makePieChart(data);
                });
                addToolTips();
                addLegend();
                input.value = ""; 
                const title = document.querySelector(".title"); 
                title.innerHTML = title.innerHTML.slice(0, 40) + " " + newYear; 
            } else {
                return null; 
            }
        }); 

        // const update = d3.selectAll("g"); // grabing all the sectors
        // const tooltips = d3.selectAll(".tooltip");
        // // grab new data for 1970 
        // let newData = []; 
        // keys.forEach( state => {
        //     let temp = filterByYear(fetchedData[state], 1970, state);
        //     newData = newData.concat([undefined]); 
        //     newData = newData.concat(temp); 
        // }); 
        // // end testing; 
        
    });






