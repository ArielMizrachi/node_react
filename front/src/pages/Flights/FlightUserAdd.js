import React, { useState, useEffect } from 'react'

// mui import
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

// redux import
import {AddFlightAsync, ErrorFlight, FlightErrorCalibration, SelectCompany , MyFlightsAsync} from '../../redux/Flights/FlightSlice'
import {CountriesNames, GetCountriesNamesAsync} from '../../redux/Countries/CountriesSlice'
import {useDispatch, useSelector} from "react-redux";
import {LogOut} from '../../redux/Login/LoginSlice'


// router import
import { useNavigate } from "react-router-dom";

import ReverseTime from '../../components/ReverseTime';

const FlightCompanyAdd = () => {

    const [origin_country, SetOriginCountryId] = useState('')
    const [destenation_country, SetDestenationCountryId] = useState('')
    const [tickets, SetTickets] = useState('')
    const [departure_date, SetDepartureDate] = useState('')
    const [departure_time, SetDepartureTime] = useState('')
    const [landing_date, SetLandingDate] = useState('')
    const [landing_time, SetLandingTime] = useState('')

    const dispatch = useDispatch();
    let navigate = useNavigate();

    const error_chk =useSelector(ErrorFlight)
    const countries_names =useSelector(CountriesNames)
    const my_company =useSelector(SelectCompany)

    // remove error if page refreshed 
    useEffect(() => {
        dispatch(FlightErrorCalibration())
        // get countries and airlines names
        dispatch(MyFlightsAsync())
        dispatch(GetCountriesNamesAsync())
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);


    //   check if the flight was implemnted correctly
    useEffect(() => {
        if (error_chk === 'good'){
            dispatch(FlightErrorCalibration())
            navigate("/Flights" ,{state:{msg: `The Flight from ${origin_country} to ${destenation_country} was added to the database` }})
        } 
        // in case of 401 
        if (error_chk === 'Please login again'){
            dispatch(FlightErrorCalibration())
            dispatch(LogOut())
            navigate("/Login/401")
        } 
        // eslint-disable-next-line react-hooks/exhaustive-deps     
      }, [error_chk]);
    

    return (
        <div>
            <Paper sx={{ p: 2, margin: '30px', maxWidth: 500, flexGrow: 1 }}>

                <Grid container spacing={3} direction="column" alignItems="flex-start">
                    <Grid item xs={12}>
                        <Typography variant="h5" component="div" gutterBottom>Please inset the following details</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography  component="div" gutterBottom color={'red'}>{error_chk}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                    <TextField
                                label="company name"
                                defaultValue={my_company}
                                InputProps={{
                                    readOnly: true,
                                }}
                                />
                    </Grid>
                    {/* set countries and direct to add countries if needed */}
                { countries_names.length > 0 ? 
                <Grid item xs={12} container spacing={2}>
                    <Grid item xs={12} >
                        <Autocomplete
                                disablePortal
                                id="combo-box-countries"
                                options={countries_names}
                                sx={{ width: 225 }}
                                onChange={(event, newValue) => {
                                    SetOriginCountryId(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} label="take off country" />}
                                />
                                
                    </Grid>
                    <Grid item xs={12}>
                    <Autocomplete
                            disablePortal
                            id="combo-box-countries"
                            options={countries_names}
                            sx={{ width: 225 }}
                            onChange={(event, newValue) => {
                                SetDestenationCountryId(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} label="landing country" />}
                            />
                            
                </Grid>
                </Grid>
                       :
                    <Grid item xs={12}>
                             <TextField id="date" variant="outlined" type="time" InputLabelProps={{ shrink: true }} label="landing time"
                                onChange={(evt) => SetLandingTime(evt.target.value)} />
                    </Grid>
                    }
                    <Grid item xs={12}>
                        <TextField id="outlined-basic" variant="outlined" label="tickets" inputProps={{ maxLength: 3 }}
                            onChange={(evt) => SetTickets(evt.target.value)} />
                    </Grid>
                    <Grid item xs={12} container>
                        <Grid item xs={6}>
                            <TextField id="date" variant="outlined" type="date" InputLabelProps={{ shrink: true }} label="departure day"
                                onChange={(evt) => SetDepartureDate(ReverseTime(evt.target.value))} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField id="date" variant="outlined" type="time" InputLabelProps={{ shrink: true }} label="departure time"
                                onChange={(evt) => SetDepartureTime(evt.target.value)} />
                        </Grid>
                    </Grid>

                    <Grid item xs={12} container>
                        <Grid item xs={6}>
                            <TextField id="date" variant="outlined" type="date" InputLabelProps={{ shrink: true }} label="landing day"
                                onChange={(evt) => SetLandingDate(ReverseTime(evt.target.value))} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField id="date" variant="outlined" type="time" InputLabelProps={{ shrink: true }} label="landing time"
                                onChange={(evt) => SetLandingTime(evt.target.value)} />
                        </Grid>
                    </Grid>

                    <Grid item xs={12} container>
                        <Grid item xs={10}></Grid>
                        <Grid item xs={2} >
                            <Button variant="contained"
                                    disabled={countries_names.length === 0 }
                                    onClick={() =>{dispatch(AddFlightAsync({
                                    "airline_company": my_company,
                                    "origin_country": origin_country,
                                    "destenation_country": destenation_country,
                                    "remaining_ticets": tickets,
                                    "departure_time": `${departure_date} ${departure_time}`,
                                    "landing_time": `${landing_date} ${landing_time}`}));}}>

                                submit</Button>
                        </Grid>
                    </Grid>

                </Grid>
            </Paper>
        </div>
    )
}

export default FlightCompanyAdd




