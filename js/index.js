function getData(url, cb) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        }
    };

    xhr.open("GET", url);
    xhr.send();
}

function getTableHeaders(obj) {
    var tableHeaders = [];
    
    // The Object.keys() method returns an array of a given object's own property names, in the same order as we get with a normal loop.
    // ["name", "height", "mass", "hair_color", "skin_color", "eye_color", "birth_year", "gender", "homeworld", "films", "species", "vehicles", "starships", "created", "edited", "url"]
    //console.log(Object.keys(obj));
    
    Object.keys(obj).forEach(function(key) {
        tableHeaders.push(`<td>${key}</td>`)
    });
    
    // ["<td>name</td>", "<td>height</td>", "<td>mass</td>", "<td>hair_color</td>", "<td>skin_color</td>", ...]
    //console.log(tableHeaders);
    
    // <tr><td>name</td>,<td>height</td>,<td>mass</td>,<td>hair_color</td>,<td>skin_color</td>,...</tr>
    //console.log(`<tr>${tableHeaders}</tr>`);
    
    return `<tr>${tableHeaders}</tr>`;
}

function generatePaginationButtons(next, previous) {
    if (next && previous) {
        return `<button onclick="writeToDocument('${previous}')">Previous</button>
                <button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (next && !previous) {
        return `<button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (!next && previous) {
        return `<button onclick="writeToDocument('${previous}')">Previous</button>`;
    }
}

function writeToDocument(url) {
    var tableRows = [];
    var el = document.getElementById("data");
    el.innerHTML = "";

    getData(url, function(data) {
        // {count: 87, next: "https://swapi.co/api/people/?page=2", previous: null, results: Array(10)}
        //console.log(data);
        
        // [object Object]
        //el.innerHTML = data;
        
        var pagination;
        // The Boolean value of null is false:
        if (data.next || data.previous) {
            pagination = generatePaginationButtons(data.next,data.previous);
            //console.log(pagination);
        }
        
        // [object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]
        //el.innerHTML = data.results;
        
        // 0: {name: "Luke Skywalker", height: "172", mass: "77", hair_color: "blond", skin_color: "fair", …}
        // 1: {name: "C-3PO", height: "167", mass: "75", hair_color: "n/a", skin_color: "gold", …}
        // 2: {name: "R2-D2", height: "96", mass: "32", hair_color: "n/a", skin_color: "white, blue", …}
        // 3: {name: "Darth Vader", height: "202", mass: "136", hair_color: "none", skin_color: "white", …}
        // 4: {name: "Leia Organa", height: "150", mass: "49", hair_color: "brown", skin_color: "light", …}
        // 5: {name: "Owen Lars", height: "178", mass: "120", hair_color: "brown, grey", skin_color: "light", …}
        // 6: {name: "Beru Whitesun lars", height: "165", mass: "75", hair_color: "brown", skin_color: "light", …}
        // 7: {name: "R5-D4", height: "97", mass: "32", hair_color: "n/a", skin_color: "white, red", …}
        // 8: {name: "Biggs Darklighter", height: "183", mass: "84", hair_color: "black", skin_color: "light", …}
        // 9: {name: "Obi-Wan Kenobi", height: "182", mass: "77", hair_color: "auburn, white", skin_color: "fair", …}
        //console.log(data.results);
        
        // Luke Skywalker
        //console.log(data.results[0].name);
        
        data = data.results;
        var tableHeaders = getTableHeaders(data[0]);
        
        //console.log(data);
        data.forEach(function(item) {
            var dataRow = [];

            Object.keys(item).forEach(function(key) {
                //console.log(item[key]);
                var rowData = (item[key] || "").toString();
                var truncatedData = rowData.substring(0, 15);
                dataRow.push(`<td>${truncatedData}</td>`);
            });
            tableRows.push(`<tr>${dataRow}</tr>`)
        });

        el.innerHTML = `<table>${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g,"");
    });
}