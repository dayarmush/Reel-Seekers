import { useLoadScript } from "@react-google-maps/api"
import SimpleMap from "./map";

function Home() {
  let key = process.env.REACT_APP_API_KEY

  const { isLoaded } = useLoadScript({ 
    googleMapsApiKey: key,
    libraries: ['places'],
  });

  if (!isLoaded) return <h1>Loading...</h1>

  return (
    <div>
      <SimpleMap/>
    </div>
  )
  
}

export default Home