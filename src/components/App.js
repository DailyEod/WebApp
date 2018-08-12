import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router';
import firebase from '../firebase';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';
import MenuAppBar from './MenuAppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import CardApp from './CardApp';

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

const styles = theme => ({
    root: {
        textAlign: 'center',
        paddingTop: theme.spacing.unit,
    }
});



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
                    that.unregisterCollectionObserver = firestore.collection(
                        'users'
                    ).where(
                        'team_id', '==', snap.data().team_id
                    ).onSnapshot((snap) => {
                        const someCollection = {};
                        snap.forEach((docSnapshot) => {
                            let data = docSnapshot.data();
                            data['id'] = docSnapshot.id;
                            someCollection[docSnapshot.id] = data;
                        });
                        that.setState({ users: someCollection });
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
        let users = that.state.users || {};
        console.log('users', users);
        let list = [];
        Object.keys(someCollection).forEach((k) => {
            list.push(someCollection[k]);
        });
        let classes = PropTypes.object.isRequired;
        const bull = <span className={classes.bullet}>•</span>;

        return (
            
            <div className="App" >
              <MenuAppBar/>
              
              {list.map(
                  d => 
                  <CardApp>
                        <List component="nav">
                        <ListItem key={d.id}> 
                        { users[d.user_id] && users[d.user_id].profile &&
                            <Avatar alt={users[d.user_id].name} src={users[d.user_id].profile.image_192}/>
                        }

                        <ListItemText><ul> {d.report.map(r => <li key={d.id + r + Math.random()}>{r}</li>)}</ul></ListItemText>
                        
                        </ListItem>
                        </List>
                </CardApp>
             )} 
             
           </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(withRouter(App)));
// export default withRouter(App);
