# Consumers
[Live Link](https://keyangsun.github.io/Consumers/)

Consumers is a simple data visualization of the net US energy consumption. Users 
can interact with the dataset to display piechart breakdowns of energy consumed 
by sector by state by year. 

![](/public/images/screen_capture.png)

## Technologies 
* HTML5
* CSS3
* JavaScript/ES6
* D3.js

## Code Snippets 
* Utilized quick sort to sort pie chart: 
    ```
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
    ```
* Utilized D3 transitions to animate pie chart rendering: 
    ```
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
    ```
