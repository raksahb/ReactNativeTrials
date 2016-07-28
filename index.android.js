/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Camera from 'react-native-camera';

var Contacts = require('react-native-contacts');

class TestApp extends Component {
    constructor(props) {
        super(props);
        this.state = {mycontacts: null};
    }

    componentDidMount() {
        Contacts.checkPermission((err, permission) => {
            // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
            if (permission === 'undefined') {
                Contacts.requestPermission((err, permission) => {
                    console.log("Got contacts permission? " + permission);
                })
            }
            if (permission === 'authorized') {
                console.log("Got contacts permission? " + permission);
                Contacts.getAll((err, contacts) => {
                    if (err && err.type === 'permissionDenied') {
                        console.log("Could not get contacts " + err);
                        Contacts.requestPermission((err, status) => {
                            console.log("Got contacts permission? " + status);
                        });
                    } else {
                        console.log(JSON.stringify(contacts));
                        this.setState({
                            mycontacts: contacts
                        });
                    }
                });
            }
            if (permission === 'denied') {
                console.log("Got contacts permission? " + permission);
            }
        });
    }

    render() {
        var contact = this.state.mycontacts !== null ? JSON.stringify(this.state.mycontacts[0]) : "";
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                <Text style={styles.instructions}>
                    To get started, edit index.android.js
                </Text>
                <Text style={styles.instructions}>
                    Shake or press menu button for dev menu
                </Text>
                <Text style={styles.instructions}>
                    Single Contact : {contact}
                </Text>
                <View style={styles.container}>
                    <Camera
                        ref={(cam) => {
            this.camera = cam;
          }}
                        style={styles.preview}
                        aspect={Camera.constants.Aspect.fill}>
                        <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
                    </Camera>
                </View>
            </View>
        );
    }

    takePicture() {
        this.camera.capture()
            .then((data) => console.log(data))
            .catch(err => console.error(err));
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    },
});

AppRegistry.registerComponent('TestApp', () => TestApp);
