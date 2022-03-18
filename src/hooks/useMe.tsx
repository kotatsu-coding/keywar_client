import { createContext, useContext, useEffect, useState } from 'react'
import { IMe } from '../types'

interface IMeProvider {
  children: React.ReactNode
}

interface IMeContext {
  me: IMe | null,
  enter: (username?: string) => void
}

const MeContext = createContext<IMeContext>({
  me: null,
  enter: () => {}
})

const MeProvider = ({ children }: IMeProvider) => {
  const [me, setMe] = useState(null)

  useEffect(() => {
    const token = sessionStorage.getItem('keywar-token')
    if (token) {
      fetch('/api/users/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        return response.json()
      }).then(response => {
        const { user } = response
        sessionStorage.setItem('keywar-token', user.token)
        setMe(user)
      })
    } else {
      setMe(null)
    }
  }, [])

  const enter = (username?: string) => {
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      return response.json()
    }).then(response => {
      const { user } = response
      sessionStorage.setItem('keywar-token', user.token)
      setMe(user)
    })
  }

  return (
    <MeContext.Provider value={{
      me,
      enter
    }}>
      { children }
    </MeContext.Provider>
  )  
}

const useMe = () => {
  const me = useContext(MeContext)
  return me
}

export { MeProvider, useMe }