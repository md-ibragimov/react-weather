import React from 'react';
import styles from './Weather.module.scss'
import { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalSvgSelector from './GlobalSvgSelector';

function Weather(props) {
  const apiKey = '373d1bf05ee84c3cbf6140259221306';
  const yandexApiKey = '786e5105-838d-4f9b-a187-d40ebac0de95';
  const geoSucces = (position) => {
    const request = `https://geocode-maps.yandex.ru/1.x/?apikey=${yandexApiKey}&format=json&geocode=${position.coords.longitude},${position.coords.latitude}`
    axios.get(request).then(response => {
      citySeatch(response.data.response.GeoObjectCollection.featureMember[1].GeoObject.name)
    }).catch((err) => console.error(err))
  }

  const geoError = (err) => {console.error(err)}
  const geopositionFunc = () => {
    return navigator.geolocation.getCurrentPosition(geoSucces, geoError);
  }
  const resetApp = () => {
    setCity('none'); 
    setStyle({}); 
    setValue('');
    setStyleWindow({});
    setStyleResult({})
}
  const [value, setValue] = useState('');
  const [loadingValue, setLoadingValue] = useState('');
  const [weatherIco, setWeatherIco] = useState(0);
  const [style, setStyle] = useState({});
  const [city, setCity] = useState('none');
  const [temp, setTemp] = useState({
    location: {
      name: '',
      country: ''
    },
    current: {
      temp_c: 0,
      condition: {
        text: '',
        code: ''
      }
    }
  });
  const [styleWindow, setStyleWindow] = useState({});
  const [styleResult, setStyleResult] = useState({});
  const [styleIco, setStyleIco] = useState('');
  useEffect(() => {
    const clear = [1000];
    const cloud = [1003, 1006, 1009];
    const haze = [1030, 1135];
    const rain  = [1063, 1072, 1150, 1153, 1180, 1183, 1186, 
      1189, 1192, 1195, 1198, 1240, 1243, 1246];
    const snow = [1066, 1069, 1114, 1117, 1147, 1168, 
    1171, 1201, 1204, 1207, 1210, 1213, 1216, 1219, 
    1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264];
    const storm = [1087, 1273, 1276, 1279, 1282];
    if (clear.includes(weatherIco)) {setStyleIco('clear')}
    if (cloud.includes(weatherIco)) {setStyleIco('cloud')}
    if (haze.includes(weatherIco)) {setStyleIco('haze')}
    if (rain.includes(weatherIco)) {setStyleIco('rain')}
    if (snow.includes(weatherIco)) {setStyleIco('snow')}
    if (storm.includes(weatherIco)) {setStyleIco('storm')}
    
  }, [weatherIco])
  const citySeatch = (city) => {
    setValue('');
      setCity('isSend');
      axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`).then(response => {
        setTemp(response.data)
        setWeatherIco(response.data.current.condition.code)
        setCity('ready');
      }).catch(() => setCity('error'))
  }
  const updateCity = (key) => {
    if (key.key === 'Enter') {
      citySeatch(value)
    }
  }

  useEffect(() => {
    if (city === 'isSend') {
      const newStyle = {
        display: 'flex',
        width: '90%',
        height: '51px',
        margin: '0 auto',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '7px',
        backgroundColor: '#D1ECF1',
        color: '#0C5460',
        textAlign: 'center',
      }
      setStyle(newStyle);
      setLoadingValue('Loading...');
    }
    if (city === 'error') {
      const newStyle = {
        display: 'flex',
        width: '90%',
        height: '51px',
        margin: '0 auto',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '7px',
        backgroundColor: '#F8D7DA',
        color: '#7A272E',
        textAlign: 'center',
      }
      setStyle(newStyle);
      setLoadingValue('Please send a valid value')
    }
    if (city === 'ready') {
      setStyleWindow({display: 'none'});
      setStyleResult({display:'flex'});
    }
  }, [city])
  return (
    <>
    <div style={styleWindow} className={styles.window}>
      <h2>Weather App</h2>
      <span style={style} className={styles.transient}>{loadingValue}</span>
      <input onKeyDown={updateCity} value={value} onChange={(e) => setValue(e.target.value)} className={styles.city} type="text" placeholder='Enter City name' />
      <div className={styles.separation}>
        <span></span>
        <p>or</p>
        <span></span>
      </div>
      <button onClick={geopositionFunc} className={styles['users-location']}>Get Device Location</button>
    </div>
    <div style={styleResult} className={styles['results-window']}>
      <header className={styles['window-header']}>
        <button onClick={resetApp} className={styles.back}></button>
        <h2>Weather App</h2>
      </header>
      <div className={styles.content}>
        <div className={styles['weather-value']}>
          <div className={styles.ico}>
            <GlobalSvgSelector id={styleIco}/>
          </div>
          <span className={styles.value}>
            {`${Math.round(temp.current.temp_c)}° С`}
          </span>
        </div>
        <span className={styles['text-forecast']}>{temp.current.condition.text}</span>
        <span className={styles.geoposition}>
          {`${temp.location.name}, ${temp.location.country}`}
        </span>
      </div>
      <div className={styles['feelstemp-humidity']}>
        <div className={styles.feelstemp}>
          <div className={styles.ico}></div>
          <div className={styles['feels-container']}>
            <span>{`${Math.round(temp.current.feelslike_c)}° С`}</span>
            <span>Feels like</span>
          </div>
        </div>
        <div className={styles.humidity}>
          <div className={styles.ico}></div>
          <div className={styles['humidity-container']}>
            <span>{`${temp.current.humidity}%`}</span>
            <span>Humidity</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Weather;