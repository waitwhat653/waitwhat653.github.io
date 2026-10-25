function getWeather() {
    const currentFields = [
        "temperature_2m",
        "relative_humidity_2m",
        "dew_point_2m",
        "apparent_temperature",
        "is_day",
        "precipitation",
        "rain",
        "showers",
        "snowfall",
        "weather_code",
        "cloud_cover",
        "pressure_msl",
        "surface_pressure",
        "wind_speed_10m",
        "wind_direction_10m",
        "wind_gusts_10m",
        "uv_index",
        "uv_index_clear_sky",
        "cape",
        "freezing_level_height",
        "sunshine_duration",
        "snow_depth"
    ].join(",");

    const dailyFields = [
        "sunrise",
        "sunset",
        "moonrise",
        "moonset",
        "moon_phase",
        "daylight_duration",
        "sunshine_duration"
    ].join(",");

    const hourlyFields = [
        "shortwave_radiation",
        "direct_radiation",
        "diffuse_radiation",
        "direct_normal_irradiance",
        "terrestrial_radiation",
        "precipitation_probability"
    ].join(",");

    const url = `https://api.open-meteo.com/v1/forecast?latitude=31.4638&longitude=-100.4373&current=${currentFields}&hourly=${hourlyFields}&daily=${dailyFields}&timezone=auto&temperature_unit=fahrenheit`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const curr = data.current;
            const daily = data.daily;
            const hourly = data.hourly;
            const currUnits = data.current_units;
            const dailyUnits = data.daily_units;
            const hourlyUnits = data.hourly_units;
            console.log(hourlyUnits.shortwave_radiation);
            const windDirection = (curr.wind_direction_10m + 180) % 360;
            const shortwave = hourly.shortwave_radiation ? hourly.shortwave_radiation[0] : "N/A";

            const formatTimeOnly = (isoString) => {
                if (!isoString) return "N/A";
                const parts = isoString.split("T");
                if (parts.length < 2) return isoString;

                const timePart = parts[1].substring(0, 5);
                let [hours, minutes] = timePart.split(":");
                hours = parseInt(hours, 10);

                const ampm = hours >= 12 ? "PM" : "AM";
                hours = hours % 12;
                hours = hours ? hours : 12;

                return `${hours}:${minutes} ${ampm}`;
            };

            const getMoonPhaseName = (phaseVal) => {
                if (phaseVal === 0 || phaseVal === 1) return "New Moon";
                if (phaseVal < 0.25) return "Waxing Crescent";
                if (phaseVal === 0.25) return "First Quarter";
                if (phaseVal < 0.5) return "Waxing Gibbous";
                if (phaseVal === 0.5) return "Full Moon";
                if (phaseVal < 0.75) return "Waning Gibbous";
                if (phaseVal === 0.75) return "Last Quarter";
                return "Waning Crescent";
            };

            const rawMoonPhase = daily.moon_phase ? daily.moon_phase[0] : 0;
            const moonPhaseLabel = getMoonPhaseName(rawMoonPhase);

            document.getElementById("output").innerHTML =
                "🌡️ Temperature: " + curr.temperature_2m + " " + currUnits.temperature_2m + "<br>" +

                "🌡️ Feels Like: " + curr.apparent_temperature + " " + currUnits.apparent_temperature + "<br>" +

                "🌧️ Precipitation: " + curr.precipitation + " " + currUnits.precipitation + "<br>" +

                "🌧️ Chance of Precipitation: " + (hourly.precipitation_probability ? hourly.precipitation_probability[0] : "N/A") + "%<br>" +

                "💨 Wind Speed: " + curr.wind_speed_10m + " " + currUnits.wind_speed_10m + "<br>" +

                "💨 Wind Direction: " + windDirection + "° (measured as 0° for north, going clockwise, and shows where the wind is going)<br>" +

                "🌅 Sunrise: " + formatTimeOnly(daily.sunrise ? daily.sunrise[0] : null) + "<br>" +

                "🌇 Sunset: " + formatTimeOnly(daily.sunset ? daily.sunset[0] : null) + "<br>" +

                "🌕 Moonrise: " + formatTimeOnly(daily.moonrise ? daily.moonrise[0] : null) + "<br>" +

                "🌙 Moonset: " + formatTimeOnly(daily.moonset ? daily.moonset[0] : null) + "<br>" +

                 "✨ Moon Phase: " + moonPhaseLabel + " (" + rawMoonPhase + ")<br>" +

                "⏳ Daylight Duration: " + (daily.daylight_duration ? (daily.daylight_duration[0] / 3600).toFixed(1) : "N/A") + " hrs<br>" +

                "😎 UV Index: " + curr.uv_index + "<br>" +

                "☀️ Daytime: " + (curr.is_day ? "Yes" : "No") + "<br>";
        })
        .catch(error => {
            console.error("Error fetching weather:", error);
            document.getElementById("output").innerHTML = "Error fetching weather data.";
        });
}
