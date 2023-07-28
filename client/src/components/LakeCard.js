import '../style/LakeCard.css'

function LakeCard({ lake }) {

  // let totalRating = 0

  // lake.review.map(review => {
  //   totalRating += review.rating
  // })

  return (
    <>
      <h2>{lake.name}</h2>
      <h3>Located at: {lake.address1}</h3>
      {/* <h3>{(totalRating / lake.reviews.length)}</h3> */}
    </>
  )
}

export default LakeCard