import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';


const styles = {
  card: {
    minWidth: 275,
    maxWidth: 345,
    width: '350px',
    color: 'red'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  cardHeader: {
    paddingBottom: '40px'
  },
};

class CardApp extends React.Component {
    state = {
      auth: true,
      anchorEl: null,
    };
  
    handleChange = (event, checked) => {
      this.setState({ auth: checked });
    };
  
    handleMenu = event => {
      this.setState({ anchorEl: event.currentTarget });
    };
  
    handleClose = () => {
      this.setState({ anchorEl: null });
    };


    render() {
        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;
        let that = this;
      
        return (
            <div>
            <Card>
                <CardContent>
                    {that.props.children}
                </CardContent>
            </Card>
            </div>
        );
    }
}

CardApp.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CardApp);
