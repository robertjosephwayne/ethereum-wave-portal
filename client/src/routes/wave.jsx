import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    CircularProgress,
    Container,
    CssBaseline,
    Grid,
    Link,
    Paper,
    Typography,
    styled,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import * as MetaMaskActions from '../redux/MetaMask/MetaMask.actions';
import * as WavesActions from '../redux/Waves/Waves.actions';

import { ethers } from 'ethers';
import abi from '../utils/WavePortal.json';

const theme = createTheme({
    palette: {},
});

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
}));

function Wave({
    allWaves,
    connectAccountInit,
    connectAccountSuccess,
    currentAccount,
    getUsernameInit,
    getUsernameSuccess,
    loadingAccount,
    loadingUsername,
    newUser,
    newWaveReceived,
    username,
    users,
    waveCount,
    waveCountUpdated,
    wavesUpdated,
}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pendingTransaction, setPendingTransaction] = useState('');
    const contractAddress = '0xA6DeAFDD2D70260402cDb502cA899478c14F7129';
    const contractABI = abi.abi;

    const checkIfWalletIsConnected = async () => {
        connectAccountInit();
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log('Make sure you have MetaMask!');
                return;
            } else {
                console.log('We have the Ethereum object', ethereum);
            }

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts?.length) {
                const account = accounts[0];
                console.log('Found an authorized account: ', account);
                connectAccountSuccess(account);
                getAllWaves();
            } else {
                navigate('/');
                console.log('No authorized account found.');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const wave = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer,
                );

                const message = prompt(
                    'Please enter a message to include with your wave: ',
                );

                const waveTxn = await wavePortalContract.wave(message || '', {
                    gasLimit: 300000,
                });
                setLoading(true);
                setPendingTransaction(waveTxn.hash);

                await waveTxn.wait();
                setPendingTransaction('');
                await refreshCurrentWaveCount();
                setLoading(false);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const refreshCurrentWaveCount = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer,
                );

                const count = await wavePortalContract.getTotalWaves();
                waveCountUpdated(count.toNumber());

                console.log('Retrieved total wave count: ', count.toNumber());
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getEtherscanURL = (transaction) => {
        return `https://rinkeby.etherscan.io/tx/${transaction}`;
    };

    const getAllWaves = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer,
                );

                const waves = await wavePortalContract.getAllWaves();

                let wavesCleaned = [];
                for (const wave of waves) {
                    wavesCleaned.push({
                        address: wave.waver,
                        message: wave.message,
                        timestamp: new Date(wave.timestamp * 1000),
                        username: await getWaverUsername(wave.waver),
                    });
                }
                wavesCleaned.sort(
                    (waveA, waveB) => waveB.timestamp - waveA.timestamp,
                );

                wavesUpdated(wavesCleaned);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateUsername = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer,
                );

                let username;
                while (!isValidUsername(username)) {
                    username = prompt(
                        'Enter a new username with 20 characters or less. Only letters and numbers are allowed.',
                    );
                    if (!username) return;
                }

                if (!username) return;

                await wavePortalContract.setUsername(username);
                alert(
                    'Your request has been submitted. Your username will be updated once the transaction has been processed.',
                );
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const isValidUsername = (username) => {
        if (!username) return false;
        if (username.length > 20) return false;

        const invalidRegex = /[^A-Za-z0-9]/;
        if (username.match(invalidRegex)) return false;

        return true;
    };

    const getUsername = async () => {
        getUsernameInit();
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer,
                );

                const username = await wavePortalContract.username(
                    signer.getAddress(),
                );
                if (username) {
                    getUsernameSuccess(username);
                }
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getWaverUsername = async (address) => {
        let username = users[address];
        if (username) return username;

        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer,
                );

                return wavePortalContract.username(address);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        let wavePortalContract;

        const onNewWave = async (from, timestamp, message) => {
            console.log('NewWave', from, timestamp, message);

            const username = await getWaverUsername(from);

            const newWave = {
                address: from,
                message: message,
                timestamp: new Date(timestamp * 1000),
                username,
            };
            newWaveReceived(newWave);
            refreshCurrentWaveCount();
        };

        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            wavePortalContract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer,
            );
            wavePortalContract.on('NewWave', onNewWave);
        }

        return () => {
            if (wavePortalContract) {
                wavePortalContract.off('NewWave', onNewWave);
            }
        };
    }, []);

    useEffect(() => {
        checkIfWalletIsConnected();
        getUsername();
        refreshCurrentWaveCount();
    }, []);

    useEffect(() => {
        getUsername();
        refreshCurrentWaveCount();
        getAllWaves();
    }, [currentAccount]);

    return (
        <ThemeProvider theme={theme}>
            {!loadingAccount && !loadingUsername && waveCount && (
                <Container component="main">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 10,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                        textAlign="center">
                        {!username && (
                            <Typography component="h1" variant="h4">
                                Welcome to Robert's wave portal.
                            </Typography>
                        )}
                        {username && (
                            <Typography component="h1" variant="h4">
                                Hi {username}! Welcome back.
                            </Typography>
                        )}
                        <Typography>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={updateUsername}>
                                Update username
                            </Link>
                        </Typography>
                        {!!waveCount && !pendingTransaction && (
                            <Typography
                                component="h1"
                                variant="h6"
                                sx={{ mt: 5 }}>
                                I have received {waveCount}{' '}
                                {waveCount === 1 ? 'wave' : 'waves'}. I'm really
                                popular.
                            </Typography>
                        )}
                        {pendingTransaction && (
                            <Typography
                                component="h1"
                                variant="h6"
                                sx={{ mt: 5 }}>
                                Your wave is processing:{' '}
                                <Link
                                    href={getEtherscanURL(pendingTransaction)}
                                    target="_blank">
                                    View on Etherscan
                                </Link>
                            </Typography>
                        )}
                        <Box noValidate sx={{ my: 5 }}>
                            {currentAccount && (
                                <LoadingButton
                                    loading={loading}
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    onClick={wave}
                                    size="large"
                                    color="secondary">
                                    Wave
                                </LoadingButton>
                            )}
                        </Box>
                    </Box>

                    {!!allWaves?.length && (
                        <Box justifyContent="center" textAlign="center">
                            <Typography component="h1" variant="h6">
                                All Completed Waves
                            </Typography>
                        </Box>
                    )}

                    <Box margin="auto" sx={{ pt: 2, pb: 2 }} maxWidth="600px">
                        <Grid container rowSpacing={2}>
                            {allWaves?.map((wave, index) => {
                                return (
                                    <Grid
                                        item
                                        key={index}
                                        xs={12}
                                        textAlign="left">
                                        <Item>
                                            <Typography sx={{ pb: 1 }}>
                                                <b>
                                                    {wave.timestamp.toLocaleString()}
                                                </b>
                                            </Typography>
                                            <Typography sx={{ pb: 1 }}>
                                                <b>Username:</b> {wave.username}
                                            </Typography>
                                            <Typography sx={{ pb: 1 }}>
                                                <b>Message:</b> {wave.message}
                                            </Typography>
                                            <Typography>
                                                <b>Address:</b> {wave.address}
                                            </Typography>
                                        </Item>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </Container>
            )}

            {(loadingAccount || loadingUsername || !waveCount) && (
                <Container component="main">
                    <CssBaseline />
                    <Box display="flex" justifyContent="center" sx={{ mt: 10 }}>
                        <CircularProgress />
                    </Box>
                </Container>
            )}
        </ThemeProvider>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        connectAccountInit: () =>
            dispatch(MetaMaskActions.connectAccountInit()),
        connectAccountSuccess: (account) =>
            dispatch(MetaMaskActions.connectAccountSuccess({ account })),
        getUsernameInit: () => dispatch(MetaMaskActions.getUsernameInit()),
        getUsernameSuccess: (username) =>
            dispatch(MetaMaskActions.getUsernameSuccess({ username })),
        newUser: (user) => dispatch(MetaMaskActions.newUser({ user })),
        newWaveReceived: (newWave) =>
            dispatch(WavesActions.newWaveReceived({ newWave })),
        waveCountUpdated: (updatedWaveCount) =>
            dispatch(WavesActions.waveCountUpdated({ updatedWaveCount })),
        wavesUpdated: (allWaves) =>
            dispatch(WavesActions.wavesUpdated({ allWaves })),
    };
};

const mapStateToProps = (state) => {
    return {
        allWaves: state.waves.allWaves,
        currentAccount: state.metaMask.currentAccount,
        loadingAccount: state.metaMask.loadingAccount,
        loadingUsername: state.metaMask.loadingUsername,
        username: state.metaMask.username,
        users: state.metaMask.users,
        waveCount: state.waves.waveCount,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wave);
