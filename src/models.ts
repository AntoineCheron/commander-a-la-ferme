type AnyMap = { [key: string]: any | undefined }

export class UserNotOnboarded {
  constructor (readonly id: string, readonly username: string) {}

  static from (input: AnyMap): UserNotOnboarded | undefined {
    if (input?.username && input?.id) {
      return new UserNotOnboarded(input.id, input.username)
    } else {
      return undefined
    }
  }
}

export class UserNotOnboardedWithPassword extends UserNotOnboarded {
  constructor (
    readonly id: string,
    readonly username: string,
    readonly password: string
  ) {
    super(id, username)
  }

  public toUserNotOnboarded (): UserNotOnboarded {
    return new UserNotOnboarded(this.id, this.username)
  }

  static from (input: AnyMap): UserNotOnboarded | undefined {
    if (input?.username && input?.id && input?.password) {
      return new UserNotOnboarded(input.id, input.username)
    } else {
      return undefined
    }
  }
}

export class User extends UserNotOnboarded {
  constructor (
    readonly id: string,
    readonly username: string,
    readonly farmName: string
  ) {
    super(id, username)
  }

  static from (input: AnyMap): UserNotOnboarded | undefined {
    if (input?.username && input?.id && input?.farmName) {
      return new User(input.id, input.username, input.farmName)
    } else {
      return undefined
    }
  }
}

export class UserWithPassword extends User {
  constructor (
    readonly id: string,
    readonly username: string,
    readonly password: string,
    readonly farmName: string
  ) {
    super(id, username, farmName)
  }

  public toUser (): User {
    return new User(this.id, this.username, this.farmName)
  }
}

export type PublicUser = {
  id: string
  username: string
  farmName?: string
}

export type InventoryItem = BaseInventoryItem & {
  remaining: number
}

export type InventoryItemWithoutId = BaseInventoryItem & {
  remaining: number
}

export type OrderableItem = OrderedItem & { remaining: number }
export type OrderedItem = BaseInventoryItem & { amount: number }
export type BaseInventoryItem = BaseInventoryItemWithoutId & { id: string }
export type BaseInventoryItemWithoutId = {
  title: string
  category: string
  price: number
}

export type Order = OrderWithoutId & {
  id: string
}

export type OrderWithoutId = {
  fullname: string
  telephone: string
  email?: string
  address: string
  paymentMethod: string
  status: OrderStatus
  passedOn: Date
  completedOn?: Date
  items: OrderedItem[]
}

export type OrderStatus = 'new' | 'in-progress' | 'completed' | 'canceled'

export type FarmDetailsWithoutId = {
  name: string
  telephone: string
  address: string
  description: string
  paymentMethods: PaymentMethod[]
}

export type FarmDetails = FarmDetailsWithoutId & {
  id: string
}

export type PaymentMethod = 'Carte Bancaire' | 'Espèces' | 'Chèque'
