using Microsoft.Data.Sqlite;
using Newtonsoft.Json;

namespace WeatherApp.Infrastructure
{
    public class Database
    {
        private static string _databasePath = Environment.CurrentDirectory + "\\App_Data\\weatherapp.db";

        public static void Write(List<WeatherForecast> request)
        {
            using (var connection = new SqliteConnection($"Data Source={_databasePath};Cache=Shared"))
            {
                connection.Open();
                var command = connection.CreateCommand();

                command.CommandText = @"INSERT INTO Weather ([City], [Day], [FerHeigh], [FerLow], [CelsiusHeigh], [CelsiusLow])
											VALUES ($City, $Day, $FerHeigh, $FerLow, $CelsiusHeigh, $CelsiusLow)";

                foreach(var item in request)
                {
                    command.Parameters.AddWithValue("$City", item.City);
                    command.Parameters.AddWithValue("$Day", item.Day);
                    command.Parameters.AddWithValue("$FerHeigh", item.FerHeigh);
                    command.Parameters.AddWithValue("$FerLow", item.FerLow);
                    command.Parameters.AddWithValue("$CelsiusHeigh", item.CelsiusHeigh);
                    command.Parameters.AddWithValue("$CelsiusLow", item.CelsiusLow);

                    command.ExecuteNonQuery();
                    command.Parameters.Clear();
                }
                
            }
        }

        public static void Clean()
        {
            using (var connection = new SqliteConnection($"Data Source={_databasePath};Cache=Shared"))
            {
                connection.Open();
                var command = connection.CreateCommand();

                command.CommandText = @"DELETE FROM Weather";


                command.ExecuteNonQuery();
            }
        }

        public static List<WeatherForecast> ReadForCity(string city)
        {
            var result = new List<WeatherForecast>();
            using (var connection = new SqliteConnection($"Data Source={_databasePath};Cache=Shared"))
            {
                connection.Open();

                var command = connection.CreateCommand();

                command.CommandText = @"SELECT * FROM Weather WHERE City LIKE $City";

                command.Parameters.AddWithValue("$City", city);

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {

                        result.Add(new WeatherForecast()
                        {
                            City = reader.GetString(0),
                            Day = reader.GetString(1),
                            FerHeigh = int.Parse(reader.GetString(2)),
                            FerLow = int.Parse(reader.GetString(3)),
                            CelsiusHeigh = int.Parse(reader.GetString(4)),
                            CelsiusLow = int.Parse(reader.GetString(5))
                        });

                    }
                }
            }

            return result;
        }
    }
}
