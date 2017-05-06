import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, KeyboardAvoidingView } from 'react-native';

export default class LoginForm extends React.Component {
  constructor(){
    super();
    this.state = {
      user: "",
      password: "",
      error: "",
      errorcolor: 0
    }
  }
  async onErasePressed(){
    const db = this.props.db;
    db.remove({}, { multi: true }, (err, numRemoved) => {
      console.log(numRemoved, err);
      if(err){
        this.setState({error: 'Error', errorcolor: 0});
      }else{
        this.setState({error: 'Todos los usuarios han sido borrados', errorcolor: 1});
      }
    });
  }
  onLogoutPressed(){
    this.props.logout();
  }
  async onLoginPressed() {
    this.userinput.blur()
    this.passwordinput.blur()
    const db = this.props.db;
    db.find({ user: this.state.user, password: this.state.password }, (err, docs) => {
      console.log(docs, err);
      if(err){
        this.setState({error: 'Error', errorcolor: 0});
      }
      else if(docs.length == 0){
        this.setState({error: 'Datos incorrectos', errorcolor: 0});
      }
      else{
        this.setState({error: 'Login exitoso', errorcolor: 1});
        this.props.login();
      }
    });
  }
  async onRegisterPressed() {
    this.userinput.blur()
    this.passwordinput.blur()
    const db = this.props.db;
    db.find({ user: this.state.user }, (err, docs) => {
      console.log(docs, err);
      if(err){
        this.setState({error: 'Error', errorcolor: 0});
      }
      else if(docs.length !== 0){
        this.setState({error: 'Ya existe ese usuario', errorcolor: 0});
      }
      else{
        db.insert({ user: this.state.user, password: this.state.password }, (err, docs) => {
          console.log(docs, err);
          if(err){
            this.setState({error: 'Error', errorcolor: 0});
          }else{
            this.setState({error: 'Usuario registrado exitosamente', errorcolor: 1});
          }
        });
      }
    });
  }
  render() {
    if (!this.props.loggedin){
      return <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text style={styles.message}>
          Ingresa tus datos de usuario:
        </Text>
        <TextInput
          ref={(input)=>this.userinput = input}
          onSubmitEditing={()=>this.passwordinput.focus()}
          autoCapitalize="none" autoCorrect={false} returnKeyType="next" selectTextOnFocus underlineColorAndroid={"white"}
          onChangeText={ (text)=> this.setState({user: text}) }
          style={styles.input} placeholder="Usuario">
        </TextInput>
        <TextInput
          ref={(input)=>this.passwordinput = input}
          autoCapitalize="none" autoCorrect={false} returnKeyType="done" selectTextOnFocus underlineColorAndroid={"white"}
          onChangeText={ (text)=> this.setState({password: text}) }
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={true}>
        </TextInput>
        <TouchableHighlight onPress={this.onLoginPressed.bind(this)} style={styles.loginbutton}>
          <Text style={styles.buttonText}>
            Login
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.onRegisterPressed.bind(this)} style={styles.registerbutton}>
          <Text style={styles.buttonText}>
            Registrarse
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.onErasePressed.bind(this)}>
          <Text style={styles.eraseText}>
            Borrar todos los usuarios
          </Text>
        </TouchableHighlight>
        <Text style={this.state.errorcolor==0?styles.error:styles.success}>
          {this.state.error}
        </Text>
      </KeyboardAvoidingView>
    }else{
      return <View style={styles.container}>
        <TouchableHighlight onPress={this.onLogoutPressed.bind(this)} style={styles.logoutbutton}>
          <Text style={styles.buttonText}>
            Logout
          </Text>
        </TouchableHighlight>
      </View>
    }
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    alignSelf: 'stretch',
  },
  input: {
    height: 35,
    marginTop: 10,
    padding: 4,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#48bbec'
  },
  loginbutton: {
    height: 35,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'
  },
  logoutbutton: {
    height: 35,
    backgroundColor: '#e03535',
    alignSelf: 'flex-end',
    padding: 5,
    marginTop: 10,
    justifyContent: 'center'
  },
  registerbutton: {
    height: 35,
    backgroundColor: '#339966',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    alignSelf: 'center'
  },
  error: {
    color: 'red',
    paddingTop: 10
  },
  success: {
    color: 'green',
    paddingTop: 10
  },
  message: {
    color: 'gray',
    paddingTop: 10
  },
  eraseText:{
    color: 'gray',
    padding: 10,
    textAlign: 'right'
  }
});
