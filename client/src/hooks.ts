import { useLocation } from 'react-router-dom'
import qs from 'qs'

export function useQuery () {
  return qs.parse(useLocation().search.substring(1))
}
