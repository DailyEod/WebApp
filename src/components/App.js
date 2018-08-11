import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router';
import firebase from '../firebase';
import logo from './logo.svg';
import './App.css';

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

class App extends Component {
    // state = {
    //     someData: {},
    //     isSignedIn: false,
    //     userProfile: null
    // };

    constructor(props){
        super(props);
        this.state = {
            someData: {},
            isSignedIn: false,
            userProfile: null
            //states
        };
    }

    componentDidMount() {
        let that = this;
        // Updating the `isSignedIn` and `userProfile` local state attributes when the Firebase Auth
        // state changes.
        // this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
        //     this.setState({ isSignedIn: !!user, userProfile: user });
        // });
        const queryString = require('query-string');
        let location = this.props.location || {};
        let parsed = queryString.parse(location.hash);
        console.log('access_token', parsed.access_token); // replace param with your own
        let token = parsed.access_token;

        firebase.auth().signInWithCustomToken(token).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // ...
        });
        // .then((user) => {
        //     
        // });

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                that.setState({ isSignedIn: !!user, userId: user.uid });
                // // Updating the `someDocument` local state attribute when the Cloud Firestore 'someDocument' document changes.
                that.unregisterDocumentObserver = firestore.doc('/users/'+user.uid).onSnapshot((snap) => {
                    that.setState({ user: snap.data() });
                    // Updating the `someCollection` local state attribute when the Cloud Firestore 'someCollection' collection changes.
                    that.unregisterCollectionObserver = firestore.collection(
                        'eods'
                    ).where(
                        'team_id', '==', snap.data().team_id
                    ).onSnapshot((snap) => {
                        const someCollection = {};
                        snap.forEach((docSnapshot) => {
                            let data = docSnapshot.data();
                            data['id'] = docSnapshot.id;
                            someCollection[docSnapshot.id] = data;
                        });
                        that.setState({ someCollection: someCollection });
                    });
                });

            } else {
                console.log(user);
                // No user is signed in.
            }
        });


    }

    componentWillUnmount() {
        // Un-registers the auth state observer.
        // this.unregisterAuthObserver();
        // Un-register the listeners.
        // this.unregisterCollectionObserver();
        // this.unregisterDocumentObserver();
    }

    render() {
        let that = this;
        let someCollection = that.state.someCollection || {};
        let list = [];
        Object.keys(someCollection).forEach((k) => {
            list.push(someCollection[k]);
        });
        return (
              <div className="App">
                <header className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                  <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                  To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <ul>
                  {list.map(d => <li key={d.id}>{d.report}</li>)}
                </ul>
              </div>
        );
    }
}

export default withRouter(App);
