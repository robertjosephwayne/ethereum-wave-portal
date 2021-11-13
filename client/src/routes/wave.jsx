import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Box,
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

import { ethers } from 'ethers';
import abi from '../utils/WavePortal.json';

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

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
}));

export default function App() {
    const navigate = useNavigate();
    const [allWaves, setAllWaves] = useState([]);
    const [currentWaveCount, setCurrentWaveCount] = useState(0);
    const [currentAccount, setCurrentAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [pendingTransaction, setPendingTransaction] = useState('');
    const contractAddress = '0x9b75006d9B06ccaaaFc706AD3490f45d2b99e594';
    const contractABI = abi.abi;

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
                refreshCurrentWaveCount();
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
                setCurrentWaveCount(count.toNumber());

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
                waves.forEach((wave) => {
                    wavesCleaned.push({
                        address: wave.waver,
                        timestamp: new Date(wave.timestamp * 1000),
                        message: wave.message,
                    });
                });
                wavesCleaned.sort((waveA, waveB) => waveB.timestamp - waveA.timestamp);

                setAllWaves(wavesCleaned);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        let wavePortalContract;

        const onNewWave = (from, timestamp, message) => {
            console.log('NewWave', from, timestamp, message);
            setAllWaves((prevState) => [
                {
                    address: from,
                    timestamp: new Date(timestamp * 1000),
                    message: message,
                },
                ...prevState,
            ]);
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
        refreshCurrentWaveCount();
    }, []);

    useEffect(() => {
        refreshCurrentWaveCount();
        getAllWaves();
    }, [currentAccount]);

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
                    {!!currentWaveCount && !pendingTransaction && (
                        <Typography component="h1" variant="h6" sx={{ mt: 5 }}>
                            I have received {currentWaveCount}{' '}
                            {currentWaveCount === 1 ? 'wave' : 'waves'}. I'm
                            really popular.
                        </Typography>
                    )}
                    {pendingTransaction && (
                        <Typography component="h1" variant="h6" sx={{ mt: 5 }}>
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

                {!!allWaves.length && (
                    <Box justifyContent="center" textAlign="center">
                        <Typography component="h1" variant="h6">
                            All Completed Waves
                        </Typography>
                    </Box>
                )}

                <Box
                    margin="auto"
                    sx={{ pt: 2, pb: 2 }}
                    maxWidth="600px">
                    <Grid container rowSpacing={2}>
                        {allWaves.map((wave, index) => {
                            return (
                                <Grid item key={index} xs={12} textAlign="left">
                                    <Item>
                                        <Typography sx={{ pb: 1 }}>
                                            <b>
                                                {wave.timestamp.toLocaleString()}
                                            </b>
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
        </ThemeProvider>
    );
}
