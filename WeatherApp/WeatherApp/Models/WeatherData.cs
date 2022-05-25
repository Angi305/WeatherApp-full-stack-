using Newtonsoft.Json;
using System.Runtime.Serialization;

namespace WeatherApp.Models
{
    [DataContract]
    public class WeatherData
    {

        [DataMember]
        [JsonProperty("city")]
        public string? City { get; set; }

        [DataMember]
        [JsonProperty("forecast")]
        public List<Forecast> Forecast { get; set; }
        public WeatherData()
        {
            Forecast = new List<Forecast>();
        }
        public WeatherData(string city)
        {
            City = city;
            Forecast = new List<Forecast>();
        }
    }

    [DataContract]
    public class Forecast
    {
        [DataMember]
        [JsonProperty("date")]
        public string Date { get; set; }

        [DataMember]
        [JsonProperty("fahrenheit")]
        public Temperature Fahrenheit { get; set; }

        [DataMember]
        [JsonProperty("celsius")]
        public Temperature Celsius { get; set; }
    }

    [DataContract]
    public class Temperature
    {
        [DataMember]
        [JsonProperty("high")]
        public int High { get; set; }

        [DataMember]
        [JsonProperty("low")]
        public int Low { get; set; }
    }
}
