import { select, geoPath } from 'd3';
import { feature } from 'topojson';  

export const makeMap = function(us) {
    const map = select('.map');
    const pathGenerator = geoPath();
    const states = feature(us, us.objects.states);
    const paths = map.selectAll('path').data(states.features);
    paths.enter().append('path')
        .attr('class', 'state')
        .attr('d', pathGenerator);
};






