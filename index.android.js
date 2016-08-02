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
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import Camera from 'react-native-camera';
import Video from 'react-native-video';

//var VideoPlayer = require('./videoplayer.android');

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
    setDuration(data) {
        this.setState({duration: data.duration});
    }
    onProgress(data) {
        this.setState({currentTime: data.currentTime});
    }
    onEnd() {
        console.log('Video play Done!');
    }

    videoError() {
        console.log('Video play Done!');
    }
    render() {
        var contact = this.state.mycontacts !== null ? JSON.stringify(this.state.mycontacts[0]) : "";
        if (this.state.myvideo) {
            return (
                <View style={styles.container}>
                    <Video source={{uri: this.state.myvideo}} // Can be a URL or a local file.
                           rate={1.0}                   // 0 is paused, 1 is normal.
                           volume={1.0}                 // 0 is muted, 1 is normal.
                           muted={false}                // Mutes the audio entirely.
                           paused={false}               // Pauses playback entirely.
                           resizeMode="contain"           // Fill the whole screen at aspect ratio.
                           repeat={true}                // Repeat forever.
                           onEnd={this.onEnd}           // Callback when playback finishes
                           onError={this.videoError}    // Callback when video cannot be loaded
                           style={styles.fullScreen} />
                </View>
            );
        } else {

            return (
                <View style={styles.container}>
                    <ScrollView>
                    <Text style={styles.instructions}>
                        Single Contact : {contact}
                    </Text>
                    <Camera
                        ref={(cam) => {
                this.camera = cam;
              }}
                        style={styles.preview}
                        captureMode={1}
                        aspect={Camera.constants.Aspect.fit}>
                        <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
                    </Camera>
                    </ScrollView>
                </View>
            );
        }
    }

    takePicture() {
        this.camera.capture()
            .then((data) => {
                console.log("received data " + data);
                console.log("takePicture - received data - who called me - " + new Error("who called me").stack);
                this.setState({myvideo: data});
            })
            .catch(err => {
                console.log("error  " + err);
                console.log("takePicture - who called me - " + new Error("who called me").stack);
            });
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
        flex: 0.5,
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
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});

AppRegistry.registerComponent('TestApp', () => TestApp);
