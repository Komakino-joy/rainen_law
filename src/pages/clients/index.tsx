import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Clients = () => {

  const [clients, setClients] = useState([])

  useEffect(() => {
    const fetchClients = async() => {
      const response = await axios.get('/api/clients/getClients')
      console.log(response.data[0])
      setClients(response.data)
    }

    fetchClients()
  },[])

  return (
    <>
      <h1>Clients</h1>
      <button 
        type='button' 
        onClick={() => console.log(clients[0])}
      >
        Clients
      </button>
      { clients && 
        clients.map( (prop:any) => (
          <div key={prop.PROPID}>
            <h4>Record Start</h4>
            { Object.keys(prop).map((key:any) => (
                <div key={key}>
                  <span>{key}&nbsp;=====&nbsp;{prop[key]}</span>
                  <br></br>
                </div>
              ))
            }
            
          </div>
        ))
      }
    </>
  )
}

export default Clients