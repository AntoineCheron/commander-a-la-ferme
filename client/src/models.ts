export type Farm = {
  name: string
  telephone: string
  address: string
  description: string
  paymentMethods: PaymentMethod[]
  inventory: InventoryItem[]
}

export type PaymentMethod = 'Carte Bancaire' | 'Espèces' | 'Chèque'

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

export type Order = {
  id: string
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

export const statusColor = {
  new: '#2db7f5',
  'in-progress': '',
  completed: '#87d068',
  canceled: '#108ee9'
}

export type User = {
  id: string
  username: string
  farmName: string
}
