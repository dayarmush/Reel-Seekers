import '../style/NewFish.css'
import { useState, useEffect } from "react";
import { Box, List, ListItem } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

function NewFish({ setLake, lake }) {

  const blankForm = {
    'name': '',
    'min_length': 0,
    'max_length': 0,
    'daily_limit': 0,
    'start_season': 0,
    'end_season': 0,
    'wiki': '',
    'image': ''
  }

  const months = [
    { value: 0, label: '-- Choose Month --'},
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const navigate = useNavigate()
  const { lakeId } = useParams()
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(blankForm)
  const [hasForm, setHasForm] = useState(false)
  const [fishError, setFishError] = useState('')
  const [searchResults, setSearchResults] = useState([])

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
  }, [lakeId, setLake, lake.id])

  // Search api for for input fish
  async function apiSearch() {
    setError('')
    setFishError('')
    try {
      const response = await fetch(`/fish_search/${search}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.fish)
      } else {
        const err = await response.json()
        setFishError(err.err)
      }
    } catch (err) {
      setFishError('Network Error. Please try again later.')
    }
  }

  // set the selected fish name as name on form
  function setSelected(result) { 
    setForm(pre => {
      return {...pre, 
       'name': result.name,
       'wiki': result.url, 
       'image': result.img_src_set['1.5x']
      }
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
      return null
    })

    if (hasFish) return setError('Fish already added')

    if (Number(form.min_length) > Number(form.max_length)) {
      setError('Minimum must be less than Maximum');
      return;
    }

    if (Number(form.start_season) >= Number(form.end_season)) {
      return setError('Start of the season must be before the end')
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
        'wiki': form.wiki,
        'image': form.image,
        'start_season': Number(form.start_season),
        'end_season': Number(form.end_season)
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
        <div className="new-fish-search-container">
          {fishError && <h6 className='new-fish-form-error'>{fishError}</h6>}
          <input
            className="new-fish-search-input"
            placeholder="🎣 Search Fish"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="new-fish-search-button" onClick={apiSearch}>Search</button>
          {!fishError && <Box className="new-fish-results-box">
            <List className='new-fish-list'>
              {!error && 
                searchResults.map(result => {
                  return <ListItem 
                    key={result.id} 
                    onClick={() => setSelected(result)} 
                    className="new-fish-list-item">
                      {result.name}
                    </ListItem>
                })
              }
            </List>
          </Box>}
        </div>
      }
      <div className={hasForm ? 'new-fish-form-container' : null}>
        {error && <h6 className='new-fish-form-error'>{error}</h6>}
        {hasForm &&
          <form onSubmit={handleSubmit}>
          <label className='new-fish-form-label'>Name:*</label>
          <input 
            type="text" name="name" 
            value={form.name}  
            readOnly 
            required 
            className='new-fish-form-input'
          />
          <br />
          <label className='new-fish-form-label'>Minimum Length:</label>
          <input 
            min='0'
            type="number" 
            name="min_length" 
            value={form.min_length} 
            onChange={handleChange} 
            className='new-fish-form-input'
          />
          <br />
          <label className='new-fish-form-label'>Maximum Length:</label>
          <input 
            min='0'
            type="number" 
            name="max_length" 
            value={form.max_length} 
            onChange={handleChange} 
            className='new-fish-form-input'
          />
          <br />
          <label className='new-fish-form-label'>Daily Limit:</label>
          <input 
            min='0'
            type="number" 
            name="daily_limit" 
            value={form.daily_limit} 
            onChange={handleChange} 
            className='new-fish-form-input'/>
          <br />
          <label className='new-fish-form-label'>Start of Season:</label>
          <select
            name="start_season"
            value={form.start_season}
            onChange={handleChange}
            className='new-fish-form-input'>
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <br />
          <label className='new-fish-form-label'>End of Season:</label>
          <select
            name="end_season"
            value={form.end_season}
            onChange={handleChange}
            className='new-fish-form-input'>
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <br />
          <button type="submit" className='new-fish-form-button'>Submit</button>
        </form>
        }
      </div>
    </div>
  )
}

export default NewFish