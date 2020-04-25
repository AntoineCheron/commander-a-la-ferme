import { User } from '../models'
import { createContext } from '../utils/createContext'

const [useUserContext, ContextProvider] = createContext<User>()

export { useUserContext, ContextProvider }
