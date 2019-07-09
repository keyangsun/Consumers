import { select, geoPath, scaleQuantize, schemeBlues } from 'd3';
import { feature } from 'topojson'; 
import { pluckdata } from './util';  

export const makeMap = function(us, data) {

    let stateObjects = us.objects.states;
    const [mapData, min, max] = processMapData(data); 

    // eslint-disable-next-line guard-for-in
    for (let id in stateObjects.geometries) {
        let name = stateObjects.geometries[id].properties.name; 
        stateObjects.geometries[id].properties['eConsumed'] = mapData[name]; 
    }

    const colorScale = scaleQuantize([min - 80000, max], schemeBlues[9]); 
    const map = select('.map');
    const pathGenerator = geoPath();
    const states = feature(us, stateObjects);
    const paths = map.selectAll('path').data(states.features);

    paths.enter()
        .append('path')
            .attr('class', 'state')
            .attr('fill', d => colorScale(d.properties.eConsumed))
            .attr('d', pathGenerator)
        .append('title')
            .text(d => {
                let state = d.properties.name;
                let e = (d.properties.eConsumed / 1000000).toFixed(2); 
                return state + " " + e + " " + "quad"; 
            });
};

const processMapData = function(data) {
    let currYear = document.querySelector(".title").innerHTML.slice(41);
    let newdata = {}; 
    let e, eCom, eRes, eInd, eTrans;
    let min = Infinity;
    let max = -Infinity; 

    for (let state in data) {
        if (state !== "United States") {
            eCom = pluckdata("commercial", state, data, currYear);
            eRes = pluckdata("residential", state, data, currYear);
            eInd = pluckdata("industrial", state, data, currYear);
            eTrans = pluckdata("transportation", state, data, currYear);
            e = eCom + eRes + eInd + eTrans;
            newdata[state] = e; 
            if (e > max) max = e; 
            if (e < min) min = e; 
        }
    }

    return [newdata, min, max]; 
}; 
