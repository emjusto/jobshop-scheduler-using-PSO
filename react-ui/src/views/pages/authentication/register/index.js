import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@material-ui/core';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@material-ui/core';

// project imports
import AuthWrapper1 from './../AuthWrapper1';
import AuthCardWrapper from './../AuthCardWrapper';
import ProjectCard from '../../../dashboard/Default/ProjectCard';
import Logo from './../../../../ui-component/Logo';
import RestRegister from './RestRegister';
import AuthFooter from './../../../../ui-component/cards/AuthFooter';

// assets

//===============================|| AUTH3 - REGISTER ||===============================//

const Register = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AuthWrapper1>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{
                    minHeight: '100vh',
                    // backgroundColor: '#232c3b',
                    background: 'linear-gradient(135deg, #232c3b 20%, #b55151 100%)', // Gradient background
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '50%', // Adjust as needed
                        height: '100%'
                        //background: 'linear-gradient(135deg, #b55151 0%, #232c3b 100%)',
                        //backgroundColor: '#b55151'
                        //background: 'linear-gradient(135deg, #b55151 80%, #232c3b 20%)',
                        //clipPath: 'polygon(100% 0, 100% 100%, 0% 100%)'
                    }}
                />
                <Grid
                    item
                    container
                    direction="column"
                    xs={6}
                    justifyContent="flex-end"
                    alignItems="flex-start"
                    sx={{ textAlign: 'left', pl: 10, position: 'relative' }}
                >
                    {/* Logo */}
                    <Logo />
                    <Typography
                        variant="h1"
                        color="white"
                        sx={{
                            fontSize: '6rem',
                            fontWeight: 'bold',
                            fontFamily: 'Poppins',
                            textShadow: '5px 2px 1px rgba(181, 81, 81, 0.8)',
                            lineHeight: 1
                        }}
                    >
                        Construction Job Shop Scheduler
                    </Typography>
                    <Typography
                        variant="h4"
                        color="white"
                        sx={{ fontSize: '2rem', mt: 2, fontFamily: 'Poppins', color: '#b55151', fontWeight: 400 }}
                    >
                        using Particle Swarm Optimization
                    </Typography>

                    {/* <Typography variant='h2'>
                        using PSO
                    </Typography> */}
                </Grid>
                <Grid item xs={6}>
                    <Grid
                        container
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{ minHeight: 'calc(100vh - 68px)', position: 'relative' }}
                    >
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper
                                sx={{
                                    //background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 100%, rgba(255, 255, 255, 0.5) 0%)'
                                    //background: 'linear-gradient(135deg, #ffffff 50%, #fffff5 100%)' // Gradient of white
                                    //background: 'linear-gradient(135deg, #232c3b 20%, #b55151 100%)'
                                    backgroundColor: 'rgba(255, 255, 255, 1)' // Change to your desired color
                                    //borderRadius: '8px',
                                    //boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
                                    //padding: theme.spacing(4)
                                }}
                            >
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 1 }}>
                                        <RouterLink to="#">
                                            <Logo />
                                        </RouterLink>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography
                                                        color={theme.palette.secondary.main}
                                                        gutterBottom
                                                        variant={matchDownSM ? 'h3' : 'h2'}
                                                    >
                                                        Sign up
                                                    </Typography>
                                                    <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : ''}>
                                                        Enter your credentials to continue
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RestRegister />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                            <Typography
                                                component={RouterLink}
                                                to="/login"
                                                variant="subtitle1"
                                                sx={{ textDecoration: 'none' }}
                                            >
                                                Have an account?
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Register;
