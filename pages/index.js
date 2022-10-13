import Image from 'next/image';

export const getServerSideProps = async ({ req }) => {
  const forwarded = req.headers["x-forwarded-for"]
  const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
  const currentWeather = {
    city: null,
    temperature: null,
  };

  const res = await fetch(`http://ip-api.com/json/${ip}`);
  const location = await res.json();

  if (location && location.city) {    
    currentWeather['city'] = location.city;
  }

  if (location.lat && location.lon) {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`)
    const weather = await res.json();

    if (weather && weather.current_weather) {
      currentWeather['temperature'] = weather.current_weather.temperature + 273.15;
    }
  }
  
  return {
    props: currentWeather,
  }
};

export default function Home({ city, temperature }) {
  const text = (city, temperature) => {
    if (city && temperature) {
      return `The temperature in ${city} is pleasant ${temperature} kelvin`;
    } else return 'Sorry, could not determine your location'
  }
  return (
    <div className="flex w-full h-full justify-start items-center flex-col bg-[rgb(13,13,13)] p-8 pt-[10%]">
      <Image src="/images/william-thomson.png" alt="William Thomson" width={180} height={264}/>
      <h2 className='text-white text-2xl mt-12'>
        {text(city, temperature)}
      </h2>
    </div>
  )
}