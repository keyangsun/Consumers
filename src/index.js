import * as d3 from 'd3';
import { makeMap } from './map'; 
import { filterByYear,
    sortData,  
    addToolTips, 
    makePieChart, 
    addLegend } from './util';

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

// eslint-disable-next-line no-undef
Promise.all([
    d3.json("data/data.json"), 
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@2.1.0/us/states-10m.json")
])
    .then( ([fetchedData, usMapData]) => {

        const year = 1970; 
        keys.forEach( state => {
            const data = filterByYear(fetchedData[state], year, state);
            makePieChart(data); 
        });
        makeMap(usMapData); 
        addToolTips();
        addLegend(); 
        
        document.querySelector("form").addEventListener("submit", (e) => {
            e.preventDefault(); 
            const input = document.querySelector("input");
            const newYear = Math.floor(Number(input.value)); 
            if (newYear >= 1970 && newYear <= 2016 ) {
                const title = document.querySelector(".title"); 
                title.innerHTML = title.innerHTML.slice(0, 40) + " " + newYear;
                input.value = "";  
                document.querySelector(".selected").click(); 
            } else {
                return null; 
            }
        }); 

        document.querySelector(".alph").addEventListener("click", (e) => {
            const currYear = document.querySelector(".title").innerHTML.slice(41);
            d3.select(".main").selectAll("svg")
                .remove();
            d3.selectAll(".tooltip")
                .remove();
            keys.forEach(state => {
                const data = filterByYear(fetchedData[state], currYear, state);
                makePieChart(data);
            });
            addToolTips();
            document.querySelector(".selected").classList.remove("selected");
            e.currentTarget.classList.add("selected"); 
        });
        
        document.querySelector(".asc").addEventListener("click", (e) => {
            const currYear = document.querySelector(".title").innerHTML.slice(41);
            d3.select(".main").selectAll("svg")
                .remove();
            d3.selectAll(".tooltip")
                .remove();
            const newKeys = sortData(fetchedData, currYear, "ASC"); 
            newKeys.forEach(state => {
                const data = filterByYear(fetchedData[state], currYear, state);
                makePieChart(data);
            });
            addToolTips();
            document.querySelector(".selected").classList.remove("selected");
            e.currentTarget.classList.add("selected"); 
        });

        document.querySelector(".desc").addEventListener("click", (e) => {
            const currYear = document.querySelector(".title").innerHTML.slice(41);
            d3.select(".main").selectAll("svg")
                .remove();
            d3.selectAll(".tooltip")
                .remove();
            const newKeys = sortData(fetchedData, currYear, "DESC");
            newKeys.forEach(state => {
                const data = filterByYear(fetchedData[state], currYear, state);
                makePieChart(data);
            });
            addToolTips();
            document.querySelector(".selected").classList.remove("selected");
            e.currentTarget.classList.add("selected"); 
        });
        
    });
