// https://codesandbox.io/s/p301oj3o37
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
}); 

class PaperSheet extends React.Component {

    render() {
        const { classes } = this.props;
        let that = this;
        
        return (
            <div>
              <Paper className={classes.root} elevation={1}>
                {that.props.children}
              </Paper>
            </div>
        );
    }
}

PaperSheet.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaperSheet);
