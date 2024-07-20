import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { makeStyles } from '@material-ui/styles';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Grid, Typography, Divider, Box } from '@material-ui/core';

// project imports
import MainCard from './../../../ui-component/cards/MainCard';
import TotalIncomeCard from './../../../ui-component/cards/Skeleton/TotalIncomeCard';
import { gridSpacing } from './../../../store/constant';

// assets
import StorefrontTwoToneIcon from '@material-ui/icons/StorefrontTwoTone';
import theme from '../../../themes';

// style constant
const useStyles = makeStyles((theme) => ({
    card: {
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            // background: 'linear-gradient(210.04deg, ' + '#b55151' + ' -50.94%, rgba(144, 202, 249, 0) 83.49%)',
            borderRadius: '50%',
            top: '-30px',
            right: '-180px'
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            // background: 'linear-gradient(140.9deg, ' + '#b55151' + ' -14.02%, rgba(144, 202, 249, 0) 70.50%)',
            borderRadius: '50%',
            top: '-160px',
            right: '-130px'
        },
        '&:hover': {
            // backgroundColor: "black",
            elevation: 10
        }
    },
    content: {
        padding: '16px !important'
    },
    avatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.largeAvatar,
        backgroundColor: theme.palette.warning.light,
        color: theme.palette.warning.dark
    },
    secondary: {
        color: theme.palette.grey[50],
        marginTop: '5px'
    },
    padding: {
        paddingTop: 0,
        paddingBottom: 0
    },
    status: {
        display: 'flex',
        border: 1,
        bgcolor: 'red',
        m: 1,
        borderColor: '#1e88e5',
        borderRadius: '20px',
        width: '6rem',
        height: '2rem'
    },
    button: {
        display: 'flex',
        border: 1,
        background: '#336a89',
        ml: 0,
        borderColor: '#1e88e5',
        borderRadius: '20px',
        width: '9rem',
        height: '2rem'
    }
}));

//-----------------------|| DASHBOARD - PROJECT CARD ||-----------------------//

const ProjectCard = ({ isLoading }) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            {isLoading ? (
                <TotalIncomeCard />
            ) : (
                <MainCard className={classes.card} contentClass={classes.content} elevation={3}>
                    <Box>
                        <Typography>Tacloban City</Typography>
                    </Box>
                    <List className={classes.padding} sx={{ marginTop: '20px' }}>
                        <ListItem alignItems="center" disableGutters className={classes.padding} margin={classes.margin}>
                            {/* <ListItemAvatar>
                                <Avatar variant="rounded" className={classes.avatar}>
                                    <StorefrontTwoToneIcon fontSize="inherit" />
                                </Avatar>
                            </ListItemAvatar> */}
                            <ListItemText
                                sx={{
                                    mt: 0.45,
                                    mb: 0.45
                                }}
                                className={classes.padding}
                                primary={
                                    <Typography variant="h5" style={{ lineHeight: '24px' }}>
                                        Constuction of 2-Storey CSC Field Office Building in Brgy. Abucay, Tacloban City
                                    </Typography>
                                }
                                // secondary={
                                //     <Box justifyContent="center" className={classes.status}>
                                //     <Typography variant="subtitle2" className={classes.secondary}>
                                //         In-Progress
                                //     </Typography>
                                //     </Box>
                                // }
                            />
                        </ListItem>
                        <ListItem sx={{ marginLeft: '0px', marginBottom: '10px', marginTop: '0px', paddingLeft: '0px' }}>
                            <Box
                                component="div"
                                justifyContent="center"
                                className={classes.button}
                                // sx={{
                                //     display: 'flex',
                                //     border: 1,
                                //     bgcolor: 'red',
                                //     ml: 0,
                                //     borderColor: '#1e88e5',
                                //     borderRadius: '20px',
                                //     width: '9rem',
                                //     height: '2rem',
                                // }}
                            >
                                <Typography variant="subtitle2" className={classes.secondary}>
                                    In-Progress
                                </Typography>
                            </Box>
                        </ListItem>

                        <Divider className={classes.divider} />
                        <ListItem>
                            <Grid
                                container
                                direction="row"
                                spacing={gridSpacing}
                                sx={{ justifyContent: 'left', padding: '0px', textAlign: 'left', alignItems: 'left' }}
                            >
                                <Grid item xs={4}>
                                    <Typography variant="h3">25</Typography>
                                </Grid>
                                <Grid item xs={4} paddingLeft={0}>
                                    <Typography variant="h3">45</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="h3">5</Typography>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem sx={{ marginBottom: '10px' }}>
                            <Grid
                                container
                                direction="row"
                                spacing={gridSpacing}
                                sx={{ justifyContent: 'left', padding: '0px', textAlign: 'left', alignItems: 'left' }}
                            >
                                <Grid item xs={4}>
                                    Tasks
                                </Grid>
                                <Grid item xs={4} paddingLeft={0}>
                                    Employees
                                </Grid>
                                <Grid item xs={4}>
                                    Equipment
                                </Grid>
                            </Grid>
                        </ListItem>

                        <Divider className={classes.divider} />
                        <ListItem sx={{ marginTop: '10px' }}>
                            <Grid
                                container
                                direction="row"
                                spacing={gridSpacing}
                                sx={{ justifyContent: 'center', padding: '0px', textAlign: 'left', alignItems: 'center' }}
                            >
                                <Grid item xs={6}>
                                    <Grid container direction="column">
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2">Due Date</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="h5">25 Jan, 2024</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container direction="column">
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2">Owner</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="h5">Em Justo</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>
                    {/* <List className={classes.padding}>
                    <Grid container direction="row" alignItems="flex-start">
                        <Grid item>
                            <Avatar variant="rounded" className={classes.avatar}>
                                <StorefrontTwoToneIcon fontSize="inherit" />
                            </Avatar>
                        </Grid>
                        <Grid item>
                            <Grid container direction="column" marginLeft='20px'>
                                <Grid item>
                                    <Typography variant="h5" className={classes.padding} noWrap={false}>
                                        Repair and R
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle2" className={classes.secondary}>
                                        In-Progress
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    </List> */}
                </MainCard>
            )}
        </React.Fragment>
    );
};

ProjectCard.propTypes = {
    isLoading: PropTypes.bool
};

export default ProjectCard;
