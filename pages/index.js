import Image from 'next/image';
import Head from 'next/head';

const TEMPERATURES = [
  {
    min: 278.15,
    max: 283.14,
    phrases: [
      'The weather outside is chilly and crisp, it\'s a perfect day to wear your favorite cozy sweater, enjoy a hot cup of cocoa, and take a long walk in the cool air.',
      'Today\'s climate is refreshingly brisk. It\'s a great day to take a scenic drive, visit a museum, or cozy up with a good book and a warm blanket.',
      'Today\'s weather is perfect for those who love cooler temperatures, it\'s a great day to explore the local shops, take a hike in the woods, or enjoy a cup of tea in a quaint café.',
      'The weather outside is invigorating, it\'s a great day to take a brisk walk or jog, go ice skating, or enjoy some winter sports like skiing or snowboarding.',
    ]
  },
  {
    min: 283.15,
    max: 288.14,
    phrases: [
      'The weather outside is cool and brisk. While it might not be warm enough for shorts and t-shirts, it\'s perfect for a light jacket or sweater.',
      'If you\'re looking for a mild and pleasant day, today\'s weather is just for you.',
      'Today\'s climate is a bit chilly but refreshing. A light breeze adds to the refreshing effect, making it a perfect day for a long walk or outdoor exercise.',
      'The bracing and invigorating atmosphere outside is perfect for those who enjoy cooler weather.',
      'The crisp and comfortable outdoor conditions make it a great day to enjoy the outdoors.'
    ]
  },
  {
    min: 288.15,
    max: 293.14,
    phrases: [
      'It\'s the perfect weather for outdoor activities, such as hiking, biking, or having a picnic in the park.',
      'Today\'s climate is neither too hot nor too cold, it\'s an ideal day to take a stroll, do some gardening, or simply relax outside.',
      'The weather is comfortably warm and inviting. A light breeze keeps things fresh, making it a great day for outdoor dining or spending time with friends and family.',
      'The weather outside is pleasant and mild, it\'s a great time to enjoy the natural beauty of the outdoors, such as taking a hike through the mountains or visiting a local beach.',
      'Today\'s weather is delightful, it\'s a great day to get some fresh air and exercise outside, whether that be jogging, practicing yoga, or playing sports.'
    ]
  },
  {
    min: 293.15,
    max: 298.14,
    phrases: [
      'The weather is warm and sunny, it\'s the perfect day to hit the beach, have a barbecue with friends, or simply soak up the sun.',
      'Today\'s climate is comfortably warm and inviting. A light breeze adds to the pleasant atmosphere, making it a great day for outdoor activities.',
      'Today\'s weather is ideal for those who enjoy moderate temperatures, it\'s a great day to explore the city, visit a local park, or have a picnic with loved ones.',
      'The weather outside is delightful, it\'s a great day to indulge in some outdoor sports or activities, such as swimming, cycling, or playing a game of tennis.',
      'The sunny weather makes it a perfect day to enjoy the outdoors. You can go for a hike, walk your dog, or simply spend time with friends and family in the garden.'
    ]
  },
  {
    min: 298.15,
    max: 303.14,
    phrases: [
      'The weather outside is hot and sunny, it\'s a great day to hit the beach, take a dip in the pool, or simply relax in the shade with a cold drink.',
      'Today\'s climate is hot and humid. it\'s an ideal day to visit a water park, have a picnic in a shady spot, or spend time indoors in air conditioning.',
      'Today\'s weather is perfect for those who love the heat, it\'s a great day to play outdoor sports, take a walk in the park, or simply enjoy the sunshine.',
      'It\'s a great day to visit a local outdoor market, go for a bike ride, or take a refreshing swim in the lake.',
      'The warm and sunny weather makes it for a great day to spend time at a park, have a picnic with friends, or enjoy a family barbecue in the garden.'
    ]
  },
  {
    min: 303.15,
    max: 308.15,
    phrases: [
      'The weather outside is hot and steamy, it\'s a great day to enjoy a cold drink, relax by the pool, or take a refreshing swim.',
      'Today\'s climate is sizzling hot. It\'s an ideal day to stay indoors in air conditioning, visit a water park, or have a picnic in a shady spot.',
      'Today\'s weather is perfect for those who love the heat. It\'s a great day to hit the beach, go for a run in the morning, or indulge in some outdoor activities.',
      'The weather outside is ideal for a summer day. It\'s a great day to visit an amusement park, go for a bike ride, or take a refreshing dip in a nearby lake.',
      'The hot and sunny weather makes it a perfect day to enjoy the outdoors. You can go for a hike in the morning, have a picnic with friends, or spend the day by the water.'
    ]
  }
]

const getSentence = (temperature) => {
  for (const tempObj of TEMPERATURES) {
    if (temperature <= tempObj.max && temperature >= tempObj.min) {
      return tempObj.phrases[Math.floor(Math.random()*tempObj.phrases.length)];
    }
  }

  return null;
}

export const getServerSideProps = async ({ req }) => {
  const forwarded = req.headers["x-forwarded-for"]
  let ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
  if (process.env.NODE_ENV === 'development') {
    ip = '28.239.69.71'
  }
  const currentWeather = {
    city: null,
    temperature: null,
    phrase: null,
  };

  const res = await fetch(`http://ip-api.com/json/${ip}`);
  const location = await res.json();

  if (location && location.city) {    
    currentWeather['city'] = location.city;
  }

  if (location.lat && location.lon) {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`)
    const weather = await res.json();

    if (weather && weather.current_weather && weather.current_weather.temperature) {
      currentWeather['temperature'] = (weather.current_weather.temperature + 273.15).toFixed(2);
    }
  }

  currentWeather['phrase'] = getSentence(currentWeather.temperature);

  return {
    props: currentWeather,
  }
};

export default function Home({ city, temperature, phrase }) {
  return (
    <div className="flex w-full h-full justify-start items-center flex-col bg-[rgb(13,13,13)] p-8 pt-[10%]">
      <Head>
        <title>Make kelvin great again</title>
        <meta property="og:title" content="Make kelvin great again" key="title" />
      </Head>
      <div className='w-fit flex justify-center items-center flex-col'>
        <Image src="/images/william-thomson.png" alt="William Thomson" width={180} height={264}/>
        <p className="text-white text-xl mt-8 mb-2 self-center">Make Kelvin great again!</p>
        <p className="text-white text-lg ml-8 italic self-end">- William Thomson, 1st Baron Kelvin</p>
      </div>
      <p className='text-white text-xl mt-12 max-w-3xl'>
        {(city && temperature && phrase) ? (
          <>
            The temperature in {city} is <b>{temperature}</b> kelvin. {phrase}
          </>
        ) : (
          <>Sorry, could not determine your location.</>
        )}
      </p>
    </div>
  )
}