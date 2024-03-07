import React, { useState, useEffect } from "react";
import "../WeatherApp/Weather.css";
import axios from "axios";
import moment from "moment";
import { GoogleMap, Autocomplete, useJsApiLoader } from '@react-google-maps/api';

const Weather = () => {
  const [data, setData] = useState();
  const [input, setInput] = useState("London");
  const [forecastData, setForecastData] = useState([]);
  const [todayForecast, setTodayForecast] = useState([]);
  const [autocomplete, setAutocomplete] = useState(null);
  const [place, setPlace] = useState(null);

  const API_key = "4ce5a83b7c878a182d38a0ec3675438c";

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${API_key}`,
    libraries: ["drawing","places"],
    
  });

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      setPlace(autocomplete.getPlace());
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=${API_key}`
      );
      console.log(response.data);
      setData(response.data);
      setPlace(response.data)
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTodayForecast = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${input}&units=metric&appid=${API_key}`
      );
      console.log("today>>>>>", response);
      setTodayForecast(response.data.list.slice(0, 6));
      console.log(response.data.list.slice(0, 6), ">>>>>>>>>>>>>>>>>");
    } catch (error) {
      console.log(error);
    }
  };

  const fetch5DayForecast = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${input}&units=metric&appid=${API_key}`
      );
      const result = response.data.list?.reduce((acc, item) => {
        const itemDate = new Date(item.dt * 1000);
        if (
          !acc.find(
            (element) =>
              new Date(element.dt * 1000).toLocaleDateString("en-US", {
                weekday: "short",
              }) === itemDate.toLocaleDateString("en-US", { weekday: "short" })
            // new Date(element.dt * 1000).toDateString() ===
            // itemDate.toDateString()
          )
        ) {
          acc.push(item);
        }
        return acc;
      }, []);
      console.log(">>>11", result.slice(1));

      setForecastData(result.slice(1));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTodayForecast();
    fetch5DayForecast();
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handlerResult = (e) => {
    fetchData();
    fetchTodayForecast();
    fetch5DayForecast();
  };

  return isLoaded ? (
     
        <div className="container border border-light vh-100">
            <GoogleMap
            
        id="autocomplete-map"
        mapContainerStyle={{
          height: '400px',
          width: '100%',
        }}
        zoom={1}
        center={{
          lat: 0,
          lng: 0,
        }}
      />
        
      
      <div className="row h-100">
        <div
          className="col align-self-start border border-light d-flex flex-column"
        >
          <div className="d-flex align-items-center flex-column justify-content-between custom-div">
            <div className="py-5">Weather</div>
            <div className="py-5">Cities</div>
            <div className="py-5">Maps</div>
            <div className="py-5">Settings</div>
          </div>
        </div>

        <div className="col  align-self-start ">
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          {/* <input type="text" placeholder="Search for a place" /> */}
        
      
          <input
            className="form-control my-2"
            type="search"
            role="search"
            placeholder="Search for cities"
            aria-label="Search"
            onChange={handleInputChange}
            value={input}
            onClick={handlerResult}
          /></Autocomplete>

{place && (
  <>
          <div className="col  align-self-center  ">
            <h1 className="d-flex justify-content-start">
              {data && data.name}
            </h1>
            <p>{data?.weather[0].description}</p>
            <div className="d-flex justify-content-end">
              <img
                src={
                  data &&
                  `https://openweathermap.org/img/wn/${data?.weather[0].icon}@2x.png`
                }
                alt=""
                className="mainimg"
              />
            </div>
            <h1>{data?.main.temp}°C</h1>{" "}
          </div>

          <div
            className="col align-self-center my-1 py-3 border border-light"
            style={{ backgroundColor: "#EAECEF", borderRadius: "8px" }}
          >
            <p className="mx-4">TODAY'S FORECAST</p>

            <div className="d-flex justify-content-start">
              {todayForecast.map((forecast, index) => (
                <div className="mx-2 border border-light " id={index}>
                  <p className="d-flex col justify-content-center">
                    {moment(new Date(forecast?.dt_txt)).format("LT")}
                    {/* {new Date(forecast.dt * 1000).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} */}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                    alt=""
                    className="img"
                  />
                  <h5 className="d-flex justify-content-center">
                    {forecast.main.temp}°C
                  </h5>
                </div>
              ))}
            </div>

            <div
              className="col  align-self-center my-5 py-2 border border-light"
              style={{ backgroundColor: "#EAECEF", borderRadius: "8px" }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <p className="mx-4 align-items-center">AIR CONDITIONS</p>
                <button
                  className="px-1 mx-4 d-flex justify-content-between ml-auto"
                  style={{
                    backgroundColor: "#1F91FF",
                    color: "white",
                    border: "none",
                    borderRadius: "18px",
                  }}
                >
                  See more
                </button>
              </div>
              <div className="d-flex justify-content-evenly">
                <div>
                  <p>Real Feel</p>
                  <h5 className="fw-bold">{data?.main.feels_like}°C</h5>
                </div>

                <div>
                  <p>Wind</p>
                  <h5 className="fw-bold">{data?.wind.speed}km/h</h5>
                </div>
              </div>

              <div className="d-flex justify-content-evenly">
                <div>
                  <p>Chance of rain</p>
                  <h5 className="fw-bold">{data?.wind.deg}%</h5>
                </div>

                <div>
                  <p>UV Index</p>
                  <h5 className="fw-bold">{data?.main.temp_max}</h5>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col align-self-start my-5 mx-1 border border-light"
            style={{ backgroundColor: "#EAECEF", borderRadius: "8px" }}
          >
            <div className="h-100 p-3">
              <p className="fw-bold">5 Days forecast</p>
            </div>

            {forecastData.map((forecast, index) => (
              <div key={index}>
                <hr />
                <div className="d-flex justify-content-evenly">
                  <p>
                    {new Date(forecast.dt_txt).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>

                  {/* <p>{new Date(forecast.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}</p> */}
                  <img
                    src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                    alt=""
                    className="images"
                  />
                  <p className="fw-bold">{forecast.weather[0].main}</p>
                  <p>
                    {Math.round(forecast.main.temp_min)} /{" "}
                    {Math.round(forecast.main.temp_max)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          </>)}
        </div>
      </div>
    </div>
    
  ) : null
};
export default Weather;

