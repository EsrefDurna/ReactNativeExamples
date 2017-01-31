'use strict'

var React = require('react-native'),
	CurrencyView = require('./CurrencyView'),
	Utils = require('../Utils/utils'),
	api = require('../API/api'),
	HUDActivityIndicator = require('../Components/HUDActivityIndicator.ios');


var ActionSheetIOS = require('ActionSheetIOS');


var {
	TextInput,
	StyleSheet,
	View,
	Text,
	Image,
	TouchableHighlight,
	ActivityIndicatorIOS
} = React;


var MainView = React.createClass({
	getInitialState: function() {

	    return {
	    	isLoading: false,
	    	inputValue : '1',
	    	fromKey : 'USD',
	    	toKey : 'INR',
	    	outputValue : '',
	    	unitRate : '63',
	    	symbol : '$'
	    };
	},
	componentDidMount : function(){
		var self = this;

		this.convertCurrency();
	},
	convertCurrency : function(){
		this.prepareToMakeApiCall();
	},
	prepareToMakeApiCall : function(){
		var baseUrl = 'http://api.fixer.io/latest';

		var queryStringData = {
			base : this.state.fromKey,
			symbols : this.state.toKey
		};

		var querystring = Object.keys(queryStringData)
		  .map(key => key + '=' + encodeURIComponent(queryStringData[key]))
		  .join('&');

		var url = baseUrl + "?" + querystring;
		this.makeApiCall(url);
	},
	makeApiCall : function(query){
		console.log(query);
		this.setState({
	      		isLoading: true
	     });

		fetch(query)
	  		.then(response => response.json())
	  		.then(responseData => this.handleCurrencyResponse(responseData))
	  		.catch(error =>
	     		this.setState({
	      		isLoading: false,
	      		message: 'errorr'
   		})).done();
	},
	handleCurrencyResponse : function(response){
				this.setState({
	      		isLoading: false
	     });
		var rates = response.rates;

		var result = this.state.inputValue * rates[this.state.toKey];

		this.setState({ outputValue : result });
		this.setState({ unitRate : rates[this.state.toKey] });
		this.setState({ symbol : Utils.symbol[this.state.toKey] });
	},
	navigateToCurrencyView : function(callback){
		var currency = Utils.currency;
		var self = this;
		self.props.navigator.push({
			title: "Currency",
			component: CurrencyView,
			passProps: {currency: currency, onSelect : callback},
		});
	},
	handleFromButtonPressed : function(){
		var self = this;
		this.navigateToCurrencyView(function(key){
			self.state.fromKey = key;
		});
	},
	handleToButtonPressed : function(){
		var self = this;
		this.navigateToCurrencyView(function(key){
			self.state.toKey = key;
		});
	},
	handleConvertButtonPressed : function(){
		this.convertCurrency();

	},
	handleSwitchButtonPressed : function(){
		var from = this.state.fromKey,
			to = this.state.toKey;

		this.setState({fromKey: to});
		this.setState({toKey: from});
		this.convertCurrency();
	},
	onSearchTextChanged : function(event){
		this.setState({inputValue: event.nativeEvent.text});
	},
	getSuccessView : function(){

		return (
			<View>
				<View style={styles.resultLabelWrap}>
						<Text style={styles.resultLabel}>{this.state.outputValue}</Text>
				</View>
				<View style={styles.resultLabelWrap}>
						<Text style={styles.altLabel}>1 {this.state.fromKey} equals {this.state.unitRate} {this.state.toKey}</Text>
				</View>
			</View>
		);
	},
	render: function() {
		//var spinner = this.state.isLoading ? (<HUDActivityIndicator />) : (<View />);
		var spinner = this.state.isLoading ? (<HUDActivityIndicator />) : this.getSuccessView();

		return (
		<View style={styles.container}>
			<View style={styles.innerContainer}>
				<Text style={styles.textInputLabel}>Enter Amount To Convert</Text>
			  <TextInput keyboardType="decimal-pad"
			  	value={this.state.inputValue}
			  	onChange={this.onSearchTextChanged.bind(this)} 
			    style={styles.textInput} />

			    <View style={styles.horContainer1}>
					<View style={styles.fromContainer}>
						<Text style={styles.labelText}>From</Text>
					  	<TouchableHighlight style={[styles.button, styles.row]} underlayColor='#99d9f4' onPress={this.handleFromButtonPressed}>
					    	<View style={{flexDirection: "row", alignSelf: 'center' }}>
					    		<Text style={styles.buttonText}>{this.state.fromKey}</Text>
					    		<Image style={{width: 32, height : 32 }} source={require('image!down2x')} />
					    	</View>

					  	</TouchableHighlight>
					</View>

					<View style={styles.switchContainer}>
						<TouchableHighlight style={styles.test} underlayColor='#99d9f4' onPress={this.handleSwitchButtonPressed}>
					    	<Image style={styles.icon} source={require('image!switch')} />
					  	</TouchableHighlight>
					</View>

					<View style={styles.toContainer}>
						<Text style={styles.labelText}>To</Text>
					  	<TouchableHighlight style={[styles.button, styles.row]} underlayColor='#99d9f4' onPress={this.handleToButtonPressed}>
					    	<View style={{flexDirection: "row", alignSelf: 'center' }}>
					    		<Text style={styles.buttonText}>{this.state.toKey}</Text>
					    		<Image style={{width: 32, height : 32 }} source={require('image!down2x')} />
					    	</View>

					  	</TouchableHighlight>
					</View>

				</View>

				<View style={styles.convertContainer}>
				   	<TouchableHighlight style={[styles.button, styles.convertButton]}
				      	underlayColor='#99d9f4' onPress={this.handleConvertButtonPressed}>
				      
				    	<Text style={styles.buttonText}>Convert</Text>
				  	</TouchableHighlight>
				</View>

	    	</View>
			<View style={styles.resultContainer}>

				{spinner}
			    	
			</View>
		</View>
		); 
	}
});


var styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		marginTop: 50,
		backgroundColor: '#1073ae'
	},
	textInputLabel : {
		fontSize: 16,
		color: 'white',
		justifyContent: 'flex-start',
		marginTop: 10,
		fontWeight: '500'
	},
	resultLabelWrap : {
		flex:1,
		flexDirection : 'row',
		justifyContent: 'flex-end'
	},
	resultLabel : {
		fontSize: 40,
		color: 'white',
		marginTop: 6,
	},
	altLabel : {
		fontSize: 24,
		color: 'white',
		marginTop: 6,
	},
	textInput: {
		height: 40,
		marginBottom: 10,
		marginTop: 10,
		padding: 4,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#0ea378',
		backgroundColor: 'white',
		borderRadius: 3,
		justifyContent: 'flex-end'
	},
	horContainer1: {
		flexDirection: 'row',
		marginBottom: 20,
		justifyContent : 'space-around'
	},
	fromContainer: {
		flex : 2,
		paddingRight : 10
	},
	switchContainer: {
		flex : 1,
		paddingLeft : 10,
		paddingRight : 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	toContainer: {
		flex : 2,
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingLeft : 10
	},
	icon : {
		marginTop : 15,
		width : 36,
		height : 36
	},
	convertContainer : {
		flex :1,
		flexDirection: 'row',
		marginBottom: 20,
		justifyContent: 'center'
	},
	labelText : {
		fontSize: 16,
		fontWeight: '500',
		color: 'white',
		alignSelf: 'center',
		marginBottom : 5
	},
	text: {
		fontSize: 15,
		textAlign: 'center',
		color: 'black',
		backgroundColor: 'transparent'
	},
	button: {
		height: 36,
		paddingRight: 10,
		paddingLeft: 10,
		backgroundColor: '#6BBD6D',
		borderColor: '#0ea378',
		borderWidth: 1,
		borderRadius: 3,
		alignSelf: 'stretch',
		justifyContent: 'center',
	},
	convertButton: {
		flex: 1,
		marginRight: 20,
		marginLeft: 20
	},
	buttonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
		alignSelf: 'center'
	},
	resultContainer: {
		marginBottom: 20
	}
});

module.exports = MainView;