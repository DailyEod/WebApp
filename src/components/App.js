import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router';
import firebase from '../firebase';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import withRoot from '../withRoot';
import MenuAppBar from './MenuAppBar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import CardApp from './CardApp';

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);

const styles = theme => ({
    root: {
        textAlign: 'center',
        paddingTop: theme.spacing.unit,
    },
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    appBar: {
        position: 'relative',
    },
    toolbarTitle: {
        flex: 1,
    },
    layout: {
        width: 'auto',
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit * 1,
        marginRight: theme.spacing.unit * 1,
        [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
            width: 900,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
    },
    cardHeader: {
        backgroundColor: theme.palette.grey[200],
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing.unit * 2,
    },
    cardActions: {
        [theme.breakpoints.up('sm')]: {
            paddingBottom: theme.spacing.unit * 2,
        },
    },
    footer: {
        marginTop: theme.spacing.unit * 8,
        borderTop: `1px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit * 6}px 0`,
    },
});



class App extends Component {
    // state = {
    //     someData: {},
    //     isSignedIn: false,
    //     userProfile: null
    // };

    constructor(props) {
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
        const queryString = require('qs');
        let location = this.props.location || {};
        let parsed = queryString.parse(location.hash.replace('#', ''));
        console.log('access_token', parsed.access_token); // replace param with your own
        let token = parsed.access_token;

        firebase.auth().signInWithCustomToken(token).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage);
            // ...
        });
        // .then((user) => {
        //
        // });

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                that.setState({ isSignedIn: !!user, userId: user.uid });
                // // Updating the `someDocument` local state attribute when the Cloud Firestore 'someDocument' document changes.
                that.unregisterDocumentObserver = firestore.doc('/users/' + user.uid).onSnapshot((snap) => {
                    that.setState({ user: snap.data() });
                    // Updating the `someCollection` local state attribute when the Cloud Firestore 'someCollection' collection changes.
                    that.unregisterCollectionObserver = firestore.collection(
                        'eods'
                    ).where(
                        'team_id', '==', snap.data().team_id
                    ).orderBy(
                        "timestamp", "desc"
                    ).onSnapshot((snap) => {
                        const someCollection = {};
                        snap.forEach((docSnapshot) => {
                            let data = docSnapshot.data();
                            data['id'] = docSnapshot.id;
                            if (someCollection[data.timestamp]) {
                                someCollection[data.timestamp].push(data)
                            } else {
                                someCollection[data.timestamp] = [data]
                            }
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
        const { classes } = this.props;
        let that = this;
        let someCollection = that.state.someCollection || {};
        let users = that.state.users || {};
        console.log('someCollection', someCollection);
        let list = [];
        Object.keys(someCollection).forEach((k) => {
            let data = { data: someCollection[k], timestamp: k };
            list.push(data);
        });
        list.sort(l => l.timestamp);
        const bull = <span className={classes.bullet}>•</span>;

        return (

            <div className="App" >
                <CssBaseline />
                <MenuAppBar />
                <main className={classes.layout}>
                    <Grid container spacing={24}>
                        {list.map(t => (
                            <Grid item md={12} key={t.timestamp + Math.random()}>
                                <CardApp>
                                    <Typography className={classes.title} color="textSecondary">
                                        {t.timestamp}
                                    </Typography>
                                    <span>
                                        {t.data.map(d => (
                                            <List component="nav" key={d.id}>
                                                <ListItem key={d.id}>
                                                    {users[d.user_id] && users[d.user_id].profile && (
                                                        <Avatar alt={users[d.user_id].name} src={users[d.user_id].profile.image_192} />
                                                    )}
                                                    <ListItemText>
                                                        <ul>
                                                            <div>
                                                                <span>
                                                                    {d.report.map(r => (
                                                                        <li key={d.id + r + Math.random()} > {r} </li>
                                                                    ))}
                                                                </span>
                                                            </div>
                                                        </ul>
                                                    </ListItemText>
                                                </ListItem>
                                            </List>
                                        ))}
                                    </span>
                                </CardApp>
                            </Grid>
                        ))}
                    </Grid>
                </main>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withRoot(withStyles(styles)(App)));
        // export default withRouter(App);
