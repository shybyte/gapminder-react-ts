/// <reference path="utils" />

module gapminder {
  'use strict';

  var [getRange] = [utils.getRange];

  var svg = React.DOM.svg;
  var circle = React.DOM.circle;

  interface MainComponentProps {
    dataTable: utils.DataTable
  }

  class MainComponent extends React.Component<MainComponentProps,any> {
    render() {
      var dt = this.props.dataTable;
      var time = Date.now();
      var countriesTable = utils.filter(dt, 'geo.cat', 'country');
      var cellPicker = utils.cellPicker(countriesTable);
      var numberCellPicker = utils.numberCellPicker(countriesTable);
      var getNumberValues = (pick:(array:string[]) => number) =>  R.map(R.compose(pick), countriesTable.body);

      var years = getNumberValues(cellPicker('time'));
      var yearRange = getRange(years);
      var currentYear = yearRange[0];

      var getX = numberCellPicker('gdp_per_cap');
      var xRange = getRange(getNumberValues(getX));

      var getY = numberCellPicker('lex');
      var yValues = getNumberValues(getY);
      var yRange = getRange(yValues);

      var getRadius = numberCellPicker('pop');
      var radiusRange = getRange(getNumberValues(getRadius));

      var mapToRange = (v:number, sr:number[], tr:number[]) => {
        var result = ((v-sr[0]) / (sr[1] - sr[0])) * (tr[1] - tr[0]) + tr[0];
        return result;
      };

      var dataInCurrentYear = utils.filter(countriesTable, 'time', currentYear + '');
      console.log(xRange, yRange, radiusRange);
      return svg({}, dataInCurrentYear.body.map(row => {
          var x = getX(row) || 0;
          var y = getY(row) || 0;
          var r = getRadius(row) || 0;
          var cx = mapToRange(x, xRange, [0, 1000]);
          var cy = 590 - mapToRange(y, yRange, [0, 580]);

          function onClick() {
            console.log(row);
          }

          return circle({
            cx,
            cy,
            r: Math.sqrt(Math.max(10, mapToRange(r, radiusRange, [0, 1000]))),
            onClick: onClick
          })
        }
      ));
    }
  }

  utils.fetchUrl('data/basic-indicators.csv').then(csvData => {
    var dataTable = utils.parseCSV(csvData);
    //console.log(csvData, dataTable);
    React.render(React.createElement(MainComponent, {dataTable}), document.getElementById('app'));
  });

}



