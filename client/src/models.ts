type AnyMap = { [key: string]: any | undefined }

export type Farm = {
  name: string
  telephone: string
  address: string
  description: string
  paymentMethods: PaymentMethod[]
  inventory: InventoryItem[]
}

export type PaymentMethod = 'Carte Bancaire' | 'Espèces' | 'Chèque'
export const PAYMENT_METHODS = ['Carte Bancaire', 'Espèces', 'Chèque']

export type InventoryItem = BaseInventoryItem & {
  remaining: number
  ordered: number
}

export type OrderableItem = OrderedItem & { remaining: number }
export type OrderedItem = BaseInventoryItem & { amount: number }

export type BaseInventoryItem = {
  id: string
  title: string
  category: string
  price: number
}

export type OrderRequest = {
  fullname: string
  telephone: string
  email?: string
  address: string
  paymentMethod: PaymentMethod
  customerComment?: string
  items: OrderedItem[]
}

export type Order = OrderWithoutId & { id: string }
export type OrderWithoutId = OrderRequest & {
  status: OrderStatus
  passedOn: Date
  completedOn?: Date
}

export type OrderStatus = 'new' | 'in-progress' | 'completed' | 'canceled'

export const statusColor = {
  new: '#2db7f5',
  'in-progress': '',
  completed: '#87d068',
  canceled: '#108ee9'
}

export type User = UserNotOnboarded & {
  farmName: string
}

export function isUser (input: AnyMap): input is User {
  return input?.farmName && isUserNotOnboarded(input)
}

export type UserNotOnboarded = {
  id: string
  username: string
}

export function isUserNotOnboarded (input: AnyMap): input is UserNotOnboarded {
  return input?.id && input?.username
}

export type FarmDetailsWithoutId = {
  name: string
  telephone: string
  address: string
  description: string
  paymentMethods: PaymentMethod[]
}
