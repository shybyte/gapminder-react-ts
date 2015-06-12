module gapminder {
  'use strict';

  var div = React.createFactory('div');


  interface MainComponentProps {

  }

  class MainComponent extends React.Component<MainComponentProps,any> {
    render() {
      return div({}, "Hello World")
    }
  }

  React.render(React.createElement(MainComponent), document.getElementById('app'));
  console.log(R.filter(x => x > 5, [1]));

}



