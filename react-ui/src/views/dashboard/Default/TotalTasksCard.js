import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { makeStyles } from '@material-ui/styles';
import { Avatar, Button, Grid, Typography } from '@material-ui/core';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from './../../../ui-component/cards/MainCard';
import SkeletonTotalOrderCard from './../../../ui-component/cards/Skeleton/EarningCard';

import ContentPasteIcon from '@material-ui/icons/ContentPaste';
import ConstructionIcon from '@material-ui/icons/Construction';

// style constant
const useStyles = makeStyles((theme) => ({
    card: {
        backgroundColor: '#e8c2a0',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
        '&>div': {
            position: 'relative',
            zIndex: 5
        },
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            background: theme.palette.grey[50],
            borderRadius: '50%',
            opacity: '20%',
            zIndex: 1,
            top: '-85px',
            right: '-95px',
            [theme.breakpoints.down('xs')]: {
                top: '-105px',
                right: '-140px'
            }
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            zIndex: 1,
            width: '210px',
            height: '210px',
            background: theme.palette.grey[50],
            borderRadius: '50%',
            opacity: '20%',
            top: '-125px',
            right: '-15px',
            opacity: 0.5,
            [theme.breakpoints.down('xs')]: {
                top: '-155px',
                right: '-70px'
            }
        }
    },
    content: {
        padding: '20px !important'
    },
    cardHeading: {
        fontSize: '4.125rem',
        fontWeight: 900,
        marginRight: '8px',
        marginTop: '14px',
        marginBottom: '6px'
    },
    subHeading: {
        fontSize: '1.50rem',
        fontWeight: 500,
        color: theme.palette.primary.light
    }
}));

//-----------------------|| DASHBOARD - TOTAL TASKS CARD ||-----------------------//

const TotalTasksCard = ({ isLoading, totalEquip }) => {
    const classes = useStyles();

    const [timeValue, setTimeValue] = React.useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };

    return (
        <React.Fragment>
            {isLoading ? (
                <SkeletonTotalOrderCard />
            ) : (
                <MainCard border={false} className={classes.card} contentClass={classes.content} elevation={4}>
                    <Grid container direction="row">
                        <Grid item xs={7}>
                            <Grid container direction="column">
                                <Grid item>
                                    <Typography className={classes.cardHeading}>{totalEquip}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography className={classes.subHeading}>Equipment</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={5}>
                            <Grid container alignItems="center" justifyContent="center" sx={{ textAlign: 'center', height: '100%' }}>
                                <ConstructionIcon style={{ width: '100%', height: '100%' }} />
                            </Grid>
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </React.Fragment>
    );
};

TotalTasksCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalTasksCard;
