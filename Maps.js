import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Platform } from 'react-native';

import { MapView, Constants, Location, Permissions } from 'expo';

const zoom = 0.1;
let ltd = zoom;
let lnd = zoom;

export default class Maps extends React.Component {
  constructor(){
    super();
    this.state = {
      ypos: 22.1566,
      xpos: -100.9855,
      region: {latitude: 22.1566, longitude: -100.9855, latitudeDelta: ltd, longitudeDelta: lnd},
      location: null
    }
  }
  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      console.warn('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
    } else {
      this._getLocationAsync();
    }
  }

  async _getLocationAsync() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({});
    this.changeLocation(location.coords);
  }
  onSubmitPos() {
    this.latinput.blur();
    this.loninput.blur();
    this.changeLocation({latitude: this.state.ypos, longitude: this.state.xpos});
  }
  onPresMap(event){
    this.latinput.blur();
    this.loninput.blur();
    this.changeLocation(event.nativeEvent.coordinate);
  }
  async changeLocation(co){
    const lat = Math.round(co.latitude * 1000000000) / 1000000000;
    const lon = Math.round(co.longitude * 1000000000) / 1000000000;
    this.setState({ypos: lat, xpos: lon, region: {latitude: lat, longitude: lon, latitudeDelta: ltd, longitudeDelta: lnd}});
    this.map.animateToRegion({latitude: lat, longitude: lon, latitudeDelta: ltd, longitudeDelta: lnd}, 500);
  }
  render() {

    return (
      <View style={styles.container}>
        <Text style={{padding: 5}}>
          Selecciona las coordenadas:
        </Text>
        <View style={styles.inputcontainer}>
          <TextInput
            ref={(input)=>this.latinput = input}
            autoCapitalize="none" autoCorrect={false} underlineColorAndroid={"white"}
            value={this.state.ypos.toString()}
            keyboardType="numeric"
            onChangeText={ (text)=> this.setState({ypos: text}) }
            style={styles.input} placeholder="Latitud">
          </TextInput>
          <TextInput
            ref={(input)=>this.loninput = input}
            autoCapitalize="none" autoCorrect={false} underlineColorAndroid={"white"}
            value={this.state.xpos.toString()}
            keyboardType="numeric"
            onChangeText={ (text)=> this.setState({xpos: text}) }
            style={styles.input}
            placeholder="Longitud"
            >
          </TextInput>
          <TouchableHighlight onPress={this.onSubmitPos.bind(this)} style={styles.submitButton}>
            <Text style={styles.buttonText}>
              Localizar
            </Text>
          </TouchableHighlight>
        </View>
        <MapView ref={component => this.map = component}
        showsUserLocation
        onRegionChangeComplete={(region)=>{ltd = region.latitudeDelta; lnd = region.longitudeDelta;}}
        loadingEnabled
        rotateEnabled={false}
        onPress={this.onPresMap.bind(this)}
        style={{flex: 1}}>
        {this.state.region && <MapView.Marker coordinate={this.state.region}/>}
      </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  inputcontainer: {
    padding: 5,
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  input: {
    height: 35,
    padding: 4,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#48bbec',
    flex: 1,
  },
  submitButton: {
    height: 35,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    alignSelf: 'center'
  },
});
