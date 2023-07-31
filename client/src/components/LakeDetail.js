import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function LakeDetail() {

  const { id } = useParams()
  
  const [error, setError] = useState('')
  const [lake, setLake] = useState([])
  console.log(lake)
  useEffect(() => {
    fetch(`/lakes/${id}`)
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => setLake(data))
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
    .catch(err => setError('Network Error. Please try again later.'))
  }, [])


  return (
    <div>
      {error && <h1>{error}</h1>}

      <h2>{lake.name}</h2>
      <h3>{lake.city}</h3>
      <h4>{lake.state}</h4>
      {lake.address && <h3>{lake.address}</h3>}
    </div>
  )
}

export default LakeDetail