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
    "Georgia", "Florida", "Hawaii", "Delaware","District of Columbia"]; 

keys.sort(); 

// eslint-disable-next-line no-undef
Promise.all([
    d3.json("data/data.json"), 
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@2.1.0/us/states-10m.json")
]).then( ([fetchedData, usMapData]) => {
        const year = 1970; 
        keys.forEach( state => {
            const data = filterByYear(fetchedData[state], year, state);
            makePieChart(data); 
        });
        makeMap(usMapData, fetchedData); 
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
                d3.select(".map").selectAll("path").remove();
                makeMap(usMapData, fetchedData); 
                document.querySelector(".selected").click(); 
            } else {
                return null; 
            }
        }); 

        document.querySelector('.map-button').addEventListener("click", e => {

            if (e.currentTarget.classList.value.includes('show')) {
                document.querySelector('.map').classList.add('show-map'); 
                e.currentTarget.classList.remove('show'); 
                e.currentTarget.children[0].innerText = "HIDE CHLOROPLETH MAP"; 
            } else {
                document.querySelector('.map').classList.remove('show-map');
                e.currentTarget.classList.add('show');
                e.currentTarget.children[0].innerText = "SHOW CHLOROPLETH MAP";
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
