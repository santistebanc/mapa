import React from 'react';
import { StyleSheet, Text, View, Image, StatusBar } from 'react-native';

import LoginForm from './LoginForm.js';
import Maps from './Maps.js';
import Datastore from 'react-native-local-mongodb';
import MapImage from './maps-icon.png';

const db = new Datastore({ filename: 'users', autoload: true });

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      loggedin: false
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.heading}>
          <Image source={MapImage} style={{width: 40, height: 40, alignSelf: 'center'}}/>
          <Text style={{fontSize: 22, alignSelf: 'center', padding: 10}}>
            Super Mapa
          </Text>
        </View>
        <LoginForm db={db} loggedin={this.state.loggedin} login={()=>this.setState({loggedin: true})} logout={()=>this.setState({loggedin: false})}/>
        {this.state.loggedin && <Maps />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  heading: {
    paddingTop: 10+StatusBar.currentHeight,
    flexDirection: 'row',
  },
});
