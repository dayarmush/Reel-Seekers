import { useState, useEffect } from "react";
import { Box, List, ListItem } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
// on reload lake state disappears
function NewFish({ setLake, lake }) {

  const blankForm = {
    'name': '',
    'min_length': 0,
    'max_length': 0,
    'daily_limit': 0,
    'wiki': ''
  }

  const navigate = useNavigate()
  const { lakeId } = useParams()
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(blankForm)
  const [hasForm, setHasForm] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  const fishKey = process.env.REACT_APP_FISH_API_KEY

  useEffect(() => {
    if (!lake.id) {
      fetch(`/lakes/${lakeId}`)
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
    } 
  }, [lakeId, setLake])

  // Search api for for input fish
  function apiSearch() {
    setError('')
    fetch(`https://fish-species.p.rapidapi.com/fish_api/fish/${search}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': fishKey,
		    'X-RapidAPI-Host': 'fish-species.p.rapidapi.com'
      }
    })
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => setSearchResults(data))
      } else {
        r.json()
        .then(err => setError(err.error.message))
      }
    })
    .catch(err => setError('Network Error. Please try again later.'))
  }

  // set the selected fish name as name on form
  function setSelected(result) { 
    setForm(pre => {
      return {...pre, 'name': result.name, 'wiki': result.url}
    })
    setHasForm(pre => !pre)
  }

  // control form input
  function handleChange(e) {
    let key = e.target.name
    let value = e.target.value
    setForm(pre => {
      return {...pre, [key]: value}
    })
  }

  // on submit check if name in db 
  // if yes create connection else make new fish and then create connection
  function handleSubmit(e) {
    e.preventDefault()

    const fishArray = Object.values(lake.lake_fish)
    const hasFish = fishArray.some(fish => {
      if (fish.fish) {
        return fish.fish.name.toLowerCase() === form.name.toLowerCase()
      }
    })

    if (hasFish) return setError('Fish already added')

    const min_length = Number(form.min_length);
    const max_length = Number(form.max_length);

    // Check if both fields are blank
    if ((!form.min_length && !form.max_length)) {
      setError(null);
    } else if (min_length >= max_length) {
      setError('Minimum must be less than Maximum');
      return;
    }

    fetch(`/fish_by_name/${form.name}`)
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => {
          makeConnection(data.id)
        })
      } else {
        createFish()
      }
    })
  }

  // function to create new fish if not in db
  function createFish() {
    fetch('/fish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': form.name,
        'min_length': Number(form.min_length),
        'max_length': Number(form.max_length),
        'daily_limit': Number(form.daily_limit),
        'wiki': form.wiki

      })
    })
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => {
          makeConnection(data.id)
        })
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
    .catch(err => setError('Network Error. Please try again later.'))
  }

  // function to make a connection between given fish and lake
  function makeConnection(fishId) {
    fetch('/lake_fish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lake_id: lakeId,
        fish_id: fishId
      })
    })
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => {
          setLake(pre => {
            const newFish = {...pre.lake_fish, data}
            return {...pre, lake_fish: newFish}
          })
          setError('Thanks for Contributing')
        })
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
    .catch(err => setError('Network Error. Please try again later.'))

    return setTimeout(() => {
      navigate(`/lake/${lakeId}`)
    }, 1000)
  }

  return (
    <div>
      {!hasForm &&
        <div>
          <input
            placeholder="Search Fish"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={apiSearch}>Search</button>
          <Box>
            <List>
              {!error && 
                searchResults.map(result => {
                  return <ListItem key={result.id} onClick={() => setSelected(result)}>{result.name}</ListItem>
                })
              }
            </List>
          </Box>
        </div>
      }
      <div>
        {hasForm &&
          <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={form.name}  readOnly required />
          </label>
          <br />
          <label>
            Minimum Length:
            <input type="number" name="min_length" value={form.min_length} onChange={handleChange} />
          </label>
          <br />
          <label>
            Maximum Length:
            <input type="number" name="max_length" value={form.max_length} onChange={handleChange} />
          </label>
          <br />
          <label>
            Daily Limit:
            <input type="number" name="daily_limit" value={form.daily_limit} onChange={handleChange} />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
        }
      </div>
      {error && <h2>{error}</h2>}
    </div>
  )
}

export default NewFish