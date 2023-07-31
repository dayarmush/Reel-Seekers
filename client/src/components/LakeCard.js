import { Link } from 'react-router-dom'
import '../style/LakeCard.css'

function LakeCard({ lake }) {

  return (
    <Link to={`/lake/${lake.id}`}>
      <div >
        <h2>{lake.name}</h2>
        <h3>{lake.state}</h3>
      </div>
    </Link>
  )
}

export default LakeCard