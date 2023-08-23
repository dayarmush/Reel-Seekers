import '../style/Messages.css'
import { useState } from 'react'

function Messages({ messages, setLake, user, lakeId }) {

  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function textHandler(e) {
    setText(e.target.value)
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!user.id) return setError('Please sign in.')

    try {
      const response = await fetch('/messages', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          text: text,
          user_id: user.id,
          lake_id: lakeId
        })
      })

      if (response.ok) {
        const data = await response.json()
        setText('')
        setLake(pre => {
          const newMessages = [...pre.messages, data]
          return {...pre, messages: newMessages}
        })
      } else {
        const err = await response.json()
        setError(err.error)
      }
    } catch (err) {
      setError('Network error. Please try again later.')
    }
  }

  return (
    <div className='message-board'>
      <h2>Messages</h2>
      {messages.map(message => {
        return <div key={message.id} className={`message ${message.user.id === user.id ? 'sent' : 'received'}`}>
          <h3>{message.user.username}</h3>
          <p>{message.text}</p>
        </div>
      })}
      {user.id &&
        <div className='message-form'>
          <form onSubmit={sendMessage}>
            <input
              placeholder="Write a Message"
              type="text"
              name='message'
              value={text}
              onChange={textHandler}
              required
            />
            <button type='submit'>Send</button>
          </form>
        </div>
      }
      {error && <p>{error}</p>}
    </div>
  )
}

export default Messages