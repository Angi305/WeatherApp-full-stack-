using Microsoft.AspNetCore.Mvc;
using WeatherApp.Infrastructure;

namespace WeatherApp.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {

        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            var request = new WeatherForecast()
            {

            };


            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
            })
            .ToArray();
        }

    
    }
}