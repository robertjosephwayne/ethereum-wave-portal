import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import * as MetaMaskActions from '../../redux/MetaMask/MetaMask.actions';

import {
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Paper,
    Typography,
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {},
});

function ConnectBox({
    connectAccountInit,
    connectAccountSuccess,
    connectAccountFailure,
    currentAccount,
    loadingAccount,
}) {
    const navigate = useNavigate();

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

            if (accounts.length) {
                const account = accounts[0];
                console.log('Found an authorized account: ', account);
                connectAccountSuccess(account);
                navigate('/wave');
            } else {
                connectAccountFailure();
                console.log('No authorized account found.');
            }
        } catch (error) {
            connectAccountFailure();
            console.log(error);
        }
    };

    const connectWallet = async () => {
        connectAccountInit();
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert('MetaMask is required. Please download MetaMask');
                return;
            }

            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (accounts.length) {
                const account = accounts[0];
                console.log('Connected: ', account);
                connectAccountSuccess(account);
                navigate('/wave');
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <>
            {!loadingAccount && !currentAccount && (
                <Paper sx={{ paddingX: 6, paddingY: 4, margin: 5 }}>
                    <Typography component="h1" variant="h6">
                        Connect your wallet to enter.
                    </Typography>

                    <Box noValidate sx={{ my: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={connectWallet}
                            size="large"
                            color="secondary">
                            Connect
                        </Button>
                    </Box>
                </Paper>
            )}

            {loadingAccount && !currentAccount && (
                <Container component="main">
                    <CssBaseline />
                    <Box display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                </Container>
            )}
        </>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        connectAccountInit: () =>
            dispatch(MetaMaskActions.connectAccountInit()),
        connectAccountSuccess: (account) =>
            dispatch(MetaMaskActions.connectAccountSuccess({ account })),
        connectAccountFailure: () =>
            dispatch(MetaMaskActions.connectAccountFailure()),
    };
};

const mapStateToProps = (state) => {
    return {
        currentAccount: state.metaMask.currentAccount,
        loadingAccount: state.metaMask.loadingAccount,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectBox);
