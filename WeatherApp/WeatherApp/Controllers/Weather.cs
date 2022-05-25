using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using WeatherApp.Infrastructure;
using WeatherApp.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WeatherApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Weather : ControllerBase
    {

        // GET api/<Weather>/5
        [HttpGet("{city}")]
        public WeatherData Get(string city)
        {
            var fullResult = Database.ReadForCity(city);

            var response = new WeatherData(city);

            foreach (var item in fullResult)
            {
                if(item.CelsiusHeigh > 25)
                {
                    response.Forecast.Add(new Forecast()
                    {
                        Date = item.Day,
                        Fahrenheit = new Temperature() { High = item.FerHeigh, Low = item.FerHeigh },
                        Celsius = new Temperature() { High = item.CelsiusHeigh, Low = item.CelsiusLow }

                    });
                }
            }

            return response;
        }

        // POST api/<Weather>
        [HttpPost]
        public void Post([FromBody] WeatherData value)
        {
            var data = new List<WeatherForecast>();


            foreach (var forecast in value.Forecast)
            {
                data.Add(new WeatherForecast()
                {
                    City = value.City,
                    Day = forecast.Date,
                    FerHeigh = forecast.Fahrenheit.High,
                    FerLow = forecast.Fahrenheit.Low,
                    CelsiusHeigh = forecast.Celsius.High,
                    CelsiusLow = forecast.Celsius.Low,
                });
            }

            Database.Write(data);

        }

        // PUT api/<Weather>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<Weather>/5
        [HttpDelete()]
        public void Clean()
        {
            Database.Clean();
        }
    }
}
