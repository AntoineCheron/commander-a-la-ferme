import Http from './Http'
import { FarmDetailsWithoutId, User } from '../models'
import AuthService from './AuthService'

export default class OnboardingService {
  public async complete (farmDetails: FarmDetailsWithoutId): Promise<void> {
    const response = await Http.instance().post(
      '/onboarding/complete',
      farmDetails
    )

    const user = response.data.user as User
    AuthService.setConnectedUser(user)

    const token = response.data.token as string
    AuthService.updateToken(token)
  }
}
