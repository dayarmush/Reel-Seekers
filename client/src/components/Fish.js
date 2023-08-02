import { useNavigate } from "react-router-dom";

function Fish({ fishes, lakeId, user }) {

  const navigate = useNavigate()
  

  return (
    <div>
      <h2>Fish:</h2>
      {fishes.map(fish => {
        if (fish.fish) {
          return <div key={fish.fish.id}>
            <h2>{fish.fish.name}</h2>
            <h4>Min Length: {fish.fish.min_length}</h4>
            <h4>Max Length: {fish.fish.max_length}</h4>
            <h4>Limit: {fish.fish.daily_limit}</h4>
          </div>
        }
        return null
      })}
      {user.id && <button onClick={() => navigate(`/new/fish/${lakeId}`)}>Add Fish</button>}
    </div>
  )

}

export default Fish