import { useParams } from "react-router-dom"

function LakeDetail() {

  const { id } = useParams()
  return <h1>Lake detail {id}</h1>
}

export default LakeDetail