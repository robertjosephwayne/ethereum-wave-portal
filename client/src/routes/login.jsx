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

import ConnectBox from '../components/ConnectBox/ConnectBox';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {},
});

export default function App() {
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
                    <ConnectBox />
                </Box>
            </Container>
        </ThemeProvider>
    );
}
