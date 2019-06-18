import * as d3 from 'd3';
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
        
        debugger; 

        const year = 1970; 
        keys.forEach( state => {
            const data = filterByYear(fetchedData[state], year, state);
            makePieChart(data); 
        });
        addToolTips();
        addLegend(); 
        
        document.querySelector("form").addEventListener("submit", (e) => {
            e.preventDefault(); 
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
        
    });






