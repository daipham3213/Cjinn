import React from 'react'

type AuthContextProps = 'login' | 'register' | 'verify' | 'forgot'

export const useAuthContext = () => {
  const [stack, setStack] = React.useState<AuthContextProps[]>([])
  const [state, setState] = React.useState<AuthContextProps>('login')
  const [tokenId, setTokenId] = React.useState('')

  const switchToLogin = () => {
    setTimeout(() => {
      setStack([...stack, 'login'])
      setState('login')
    }, 600)
  }

  const switchToRegister = () => {
    setTimeout(() => {
      setStack([...stack, 'register'])
      setState('register')
    }, 600)
  }

  const switchToVerify = (value: string) => {
    setTimeout(() => {
      setTokenId(value)
      setStack([...stack, 'verify'])
      setState('verify')
    }, 600)
  }

  const switchToForgot = () => {
    setTimeout(() => {
      setStack([...stack, 'forgot'])
      setState('forgot')
    }, 600)
  }
  const goBack = () => {
    setTimeout(() => {
      if (stack.length > 1) {
        setStack(stack.slice(0, stack.length - 1))
        setState(stack.pop() ?? 'login')
      } else {
        setStack([])
        setState('login')
      }
    })
  }
  return {
    state,
    tokenId,
    goBack,
    switchToLogin,
    switchToRegister,
    switchToVerify,
    switchToForgot,
  }
}

export const AuthContext = React.createContext(
  {} as ReturnType<typeof useAuthContext>,
)
