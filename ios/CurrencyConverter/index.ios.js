/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native'),
    MainView = require('./App/Views/MainView');

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS
} = React;

var CurrencyConverter = React.createClass({

  render: function() {
    var prevRoute = this.props.route;

    return (
      <NavigatorIOS
        ref="nav"
        style={styles.navigatorContainer}
        initialRoute={{
          title: 'Currency Converter',
          component: MainView
        }}/>
    );
  }
});

var styles = StyleSheet.create({
  navigatorContainer: {
    flex: 1
  }
});

AppRegistry.registerComponent('CurrencyConverter', () => CurrencyConverter);
