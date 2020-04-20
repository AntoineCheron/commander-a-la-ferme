import { useLocation } from 'react-router-dom'
import qs from 'qs'
import { useEffect } from 'react'

export function useQuery () {
  return qs.parse(useLocation().search.substring(1))
}

export function useEffectWrapper (
  f: (isMounted: boolean) => void,
  deps: any[]
) {
  useEffect(() => {
    var isMounted = true
    f(isMounted)
    return () => {
      isMounted = false
    }
  }, deps)
}
