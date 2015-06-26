module gapminder.utils {
  var [map, split, findIndex, eq] = [R.map, R.split, R.findIndex, R.eq];

  export interface DataTable {
    header: string[],
    body: any[][]
  }

  export function fetchUrl(url:string):Promise<string> {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          resolve(request.responseText);
        } else {
          reject({
            status: request.status
          });
        }
      };

      request.onerror = function (error) {
        reject(error);
      };

      request.send();

    });
  }

  export function parseCSV(csv:string):DataTable {
    var cols = map(split(','), csv.split('\n'));
    return {
      header: cols[0],
      body: cols.slice(1)
    };
  }

  function cellPickerInternal(dataTable:DataTable, columnId:string) {
    var columnIndex = findIndex(eq(columnId), dataTable.header);
    return (row:string[]) => {
      return row[columnIndex];
    }
  }

  function toInt(s:string) {
    return parseInt(s);
  }

  function numberCellPickerInternal(dataTable:DataTable, columnId:string) {
    return R.compose(toInt, cellPickerInternal(dataTable, columnId));
  }

  export var cellPicker = R.curry(cellPickerInternal);
  export var numberCellPicker = R.curry(numberCellPickerInternal);

  export function filter(dataTable:DataTable, columnId:string, columnValue:string) {
    var pickCellWithColumnId = cellPicker(dataTable, columnId);
    return set(dataTable, dt => {
      dt.body = dt.body.filter(row => pickCellWithColumnId(row) === columnValue);
    })
  }

  export function getRange(numbers:number[]) {
    return [R.min(numbers), R.max(numbers)];
  }


  export function set<T>(object:T, f:(clonedObject:T) => void):T {
    var clone = R.evolve({}, object);
    f(clone);
    Object.freeze(clone);
    return clone;
  }
}