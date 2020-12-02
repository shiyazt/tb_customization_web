const rows2String = (rows) => {
    return rows.map(e => e.join(",")).join("\n");
}

const exportToCsv = (fname, rows) => {
    let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fname + '.csv');
    document.body.appendChild(link); // Required for FF
    link.click(); // This will download the data file named "my_data.csv".
}


const exportAllData = (fname, multiRows) => {
    // let csvContent = "data:text/csv;charset=utf-8," + super_rows.map(rows => rows.join(","));
    let csvContent = "data:text/csv;charset=utf-8,";
    multiRows.forEach(rows=> {
        csvContent += rows2String(rows);
        csvContent += "\n\n";
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fname + '.csv');
    document.body.appendChild(link); // Required for FF
    link.click(); // This will download the data file named "my_data.csv".
}

var $data = widgetContext.defaultSubscription.data;
var $dataSource = widgetContext.defaultSubscription.datasources;
const title = widgetContext.widget.config.title || 'sample';

console.log($data);
// console.log($dataSource);



var TimeseriesRow = [];

$data.forEach(item => {
    // result.length = 0;
    var result= [];
    result.push(['Time', item.dataKey.name]);
    item.data.forEach(x => result.push([ 
        moment(x[0]).format('DD-MM-YYYY HH:mm:ss'),
        x[1]
    ]));
    // console.log(result);
    TimeseriesRow.push(result);
    exportToCsv(item.dataKey.name, result);
});

// console.log(TimeseriesRow);

exportAllData(title, TimeseriesRow);

