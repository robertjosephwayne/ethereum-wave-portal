import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Button,
    Container,
    CssBaseline,
    Paper,
    Typography,
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#BB86FC',
        },
        secondary: {
            main: '#03DAC6',
        },
    },
});

export default function App() {
    const navigate = useNavigate();
    const [currentAccount, setCurrentAccount] = useState('');

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log('Make sure you have MetaMask!');
                return;
            } else {
                console.log('We have the Ethereum object', ethereum);
            }

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log('Found an authorized account: ', account);
                setCurrentAccount(account);
                navigate('/wave');
            } else {
                console.log('No authorized account found.');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert('Get MetaMask!');
                return;
            }

            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });

            console.log('Connected: ', accounts[0]);
            setCurrentAccount(accounts[0]);
            navigate('/wave');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <ThemeProvider theme={theme}>
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
                    <Typography component="h1" variant="h4">
                        Welcome to Robert's wave portal.
                    </Typography>
                    <Paper sx={{ paddingX: 6, paddingY: 4, margin: 5 }}>
                        {!currentAccount && (
                            <Typography component="h1" variant="h6">
                                Connect your wallet to enter.
                            </Typography>
                        )}
                        <Box noValidate sx={{ my: 2 }}>
                            {!currentAccount && (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={connectWallet}
                                    size="large"
                                    color="secondary">
                                    Connect
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
