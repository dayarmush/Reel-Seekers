import '../style/LakeCard.css'
import { Link } from 'react-router-dom'

function LakeCard({ lake, handleApprove }) {

  return (
    <div >
      <Link to={`/lake/${lake.id}`}>
        <h2>{lake.name}</h2>
        <h3>{lake.state}</h3>
      </Link>
      {lake.status === 'pending' && 
        <button onClick={() => handleApprove(lake.id)}>Approve</button>
      }
    </div>
  )
}

export default LakeCard