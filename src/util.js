export const filterByYear = function (state, year) {
    let sectors = ["residential", "transportation", "industrial", "commercial"]
    let filtered = [], datum, datumVal; 

    sectors.forEach( sector => {
        datum = {}; 
        datumVal = state[sector].data.filter( val => val[0] === year+"")[0][1];
        datum.sector = sector;
        datum.value = datumVal;
        filtered.push(datum); 
    });

    return  filtered;
}

export const eConsumed = function (data) {
    let totalE = data
        .map( datum => datum.value )
        .reduce( (sum, datum) => sum + datum);
    totalE = totalE / 1000000; 
    return totalE.toFixed(2); 
}