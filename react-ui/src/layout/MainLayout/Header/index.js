import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';

// material-ui
import { makeStyles } from '@material-ui/styles';
import { Avatar, Box, ButtonBase, Button, Link, Typography } from '@material-ui/core';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
// import AddProjectSection from './AddProjectSection';

// assets
import { IconMenu2, IconPlus } from '@tabler/icons';
// import AddProject from './AddProjectSection';

// style constant
const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1
    },
    headerAvatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        transition: 'all .2s ease-in-out',
        background: theme.palette.secondary.light,
        color: theme.palette.secondary.dark,
        '&:hover': {
            background: theme.palette.secondary.dark,
            color: theme.palette.secondary.light
        }
    },
    boxContainer: {
        width: '228px',
        display: 'flex',
        [theme.breakpoints.down('md')]: {
            width: 'auto'
        }
    },
    button: {
        borderRadius: '12px',
        padding: theme.spacing(1),
        textTransform: 'none', // To maintain the case of the text
        marginRight: theme.spacing(2),
    },
    icon: {
        marginRight: theme.spacing(1),
    },
}));


//-----------------------|| MAIN NAVBAR / HEADER ||-----------------------//

const Header = ({ handleLeftDrawerToggle }) => {
    const classes = useStyles();
    const history = useHistory();
    const handleButtonClick = () => {

        history.push('/pso-pages/new-project');
    };
    

    return (
        <React.Fragment>
            {/* logo & toggler button */}
            <div className={classes.boxContainer}>
                <Box component="span" sx={{ display: { xs: 'flex', md: 'flex' }, flexGrow: 1, justifyContent:'center', alignItems:'center' }}>
                    <LogoSection />
                </Box>
                <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar variant="rounded" className={classes.headerAvatar} onClick={handleLeftDrawerToggle} color="inherit">
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </div>
            {/* <div className={classes.boxContainer}>
            <Typography variant="h2"color="secondary" align="right">
                Job Shop Using PSO
            </Typography>
            </div> */}

            {/* header search */}
            {/* <SearchSection theme="light" /> */}
            <div className={classes.grow} />
            <div className={classes.grow} />

        {/* Add New Project Button */}
            <Button
            component={Link}
            onClick={handleButtonClick}
            className={classes.button}
            variant="contained"
            color="secondary"
            startIcon={<IconPlus stroke={1.5} size="1.3rem" className={classes.icon} />}
        >
            Start a project
        </Button>

            {/* notification & profile */}
            {/* <NotificationSection /> */}
            <ProfileSection />
        </React.Fragment>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
