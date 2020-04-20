export class User {
  constructor (
    readonly id: string,
    readonly username: string,
    readonly password: string,
    readonly farmName: string
  ) {}

  public publicRepresentation (): PublicUser {
    return {
      id: this.id,
      username: this.username,
      farmName: this.farmName
    }
  }
}

export type PublicUser = {
  id: string
  username: string
  farmName: string
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
