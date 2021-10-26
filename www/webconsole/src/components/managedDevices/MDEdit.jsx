import React from 'react';

import { useParams } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles';
import { Typography, Paper, Grid, CircularProgress, TextField, Button } from '@material-ui/core';


import SaveIcon from '@material-ui/icons/Save';
import { DeviceGetByDev, DeviceSetByDev } from '../../services/devices';
import Alert from '@material-ui/lab/Alert';
import BackButton from '../../widgets/BackButton';
const useStyles = makeStyles((theme) => ({
    root: {

    },
    loading: {
        marginLeft: theme.spacing(2)
    },
    backButton: {
        marginRight: theme.spacing(2),
    },
    h1: {
        fontSize: '20px',
        fontWeight: '700',
        textAlign: 'left',
        paddingRight: '10px',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    dtHolder: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    title: {
        display: 'flex',
        alignItems: 'center',
    },
    btnGrid: {
        textAlign: 'right',
    },
    btns: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    formPaper: {
        padding: theme.spacing(2),
    },
    formRoot: {
        '& .MuiTextField-root': {
            padding: theme.spacing(1),
        },
    },
    formButton: {
        margin: theme.spacing(1),
    },
}))


const fields = {
    Name: '',
    Info: '',
}


const MDEditComponent = (props) => {

    const { device } = useParams()


    const classes = useStyles();

    const [busy, setBusy] = React.useState(true);

    const [db, setDB] = React.useState({ ...fields })


    // eslint-disable-next-line
    const [fetchError, setFetchError] = React.useState(false)
    const [fetchErrorMSG, setFetchErrorMSG] = React.useState('')
    const [success, setSuccess] = React.useState(false)


    const handleSave = () => {
        setBusy(true)

        DeviceSetByDev({ device: device, name: db.Name, info: db.Info }).then(async (json) => {
            if (json.error) {
                console.log(json);
                setFetchError(true)
                setFetchErrorMSG('Error: Could not save data to server!')
            } else {
                setFetchError(false)
                setFetchErrorMSG('Data has successfully saved to database!')
                setSuccess(true)
            }
            setBusy(false)
        })



    }




    React.useEffect(() => {
        if (device !== '') {
            DeviceGetByDev({ device: device }).then(async (json) => {
                if (json.error) {
                    setFetchError(true)
                    setFetchErrorMSG('Error: Could not get data from server!')
                } else {
                    setFetchError(false)
                    const resp = await json.response.then((result) => result);
                    setDB({ ...resp })
                }
                setBusy(false)
            })
        }
    }, [device])


    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={1}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                >
                    <Grid item xs={6} sm={6} md={10} className={classes.title}>
                        <BackButton
                            forObj="Managed Devices"
                            backURL="/devices"
                            className={classes.backButton}
                        />
                        <Typography
                            variant="h1"
                            color="primary"
                            className={classes.h1}
                        >
                            Edit Managed Devices: {device}
                            {
                                busy ? <CircularProgress className={classes.loading} color="primary" size={15} /> : ''
                            }
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={2} className={classes.dtHolder}>
                <Grid item xs={12} md={12} >
                    <Paper className={classes.formPaper}>

                        {
                            fetchError
                                ?
                                <Alert variant="filled" severity="error" >{fetchErrorMSG}</Alert>
                                : ''
                        }
                        {
                            success
                                ?
                                <Alert variant="filled" severity="success" >{fetchErrorMSG}</Alert>
                                :
                                ''
                        }
                        <form className={classes.formRoot} noValidate autoComplete="off">
                            <TextField
                                id="deviceID"
                                fullWidth
                                disabled
                                label="Device"
                                variant="filled"
                                defaultValue={device}
                            />
                            <TextField
                                id="deviceName"
                                fullWidth
                                label="Device Name"
                                variant="filled"
                                disabled={busy}
                                value={busy ? '...' : db.Name}
                                onChange={
                                    (e) => {
                                        setDB({ ...db, Name: e.target.value })
                                    }
                                }
                            />
                            <TextField
                                id="deviceInfo"
                                fullWidth
                                label="Device Info"
                                variant="filled"
                                disabled={busy}
                                value={busy ? '...' : db.Info}
                                onChange={
                                    (e) => {
                                        setDB({ ...db, Info: e.target.value })
                                    }
                                }
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={busy}
                                className={classes.formButton}
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                            >
                                Save {busy ? <CircularProgress className={classes.loading} color="primary" size={15} /> : ''}
                            </Button>

                        </form>
                    </Paper>
                </Grid>
            </Grid>

        </div>
    )
}

export default MDEditComponent;