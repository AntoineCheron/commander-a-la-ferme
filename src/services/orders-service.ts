import { Order, OrderWithoutId } from '../models'
import { NotFound } from '../error'

export default class OrderService {
  private orders: { [farmName: string]: Order[] } = {
    'Bergerie de Bubertre': [
      {
        id: '1',
        fullname: 'Antoine Cheron',
        telephone: '06.12.85.59.89',
        address: 'Le Pré de la Grande 61190 Bubertré',
        paymentMethod: 'carte',
        status: 'new',
        passedOn: new Date(Date.now()),
        items: [
          {
            id: '1',
            title: 'Crottin chèvres',
            category: 'Catégorie 1',
            price: 2.25,
            amount: 2
          },
          {
            id: '2',
            title: 'Crottin brebis',
            category: 'Catégorie 2',
            price: 22.25,
            amount: 4
          }
        ]
      },
      {
        id: '2',
        fullname: 'Antoine Cheron (2)',
        telephone: '06.12.85.59.89',
        address: 'Le Pré de la Grande 61190 Bubertré',
        paymentMethod: 'carte',
        status: 'in-progress',
        passedOn: new Date(Date.now()),
        items: [
          {
            id: '1',
            title: 'Crottin chèvres',
            category: 'Catégorie 1',
            price: 2.25,
            amount: 2
          },
          {
            id: '2',
            title: 'Crottin brebis',
            category: 'Catégorie 2',
            price: 22.25,
            amount: 4
          }
        ]
      }
    ]
  }

  public async list (farmName: string): Promise<Order[]> {
    return this.orders[farmName] || []
  }

  public async getOrder (orderId: string, farmName: string): Promise<Order> {
    const maybeOrder = this.orders[farmName].find(order => order.id === orderId)
    if (maybeOrder !== undefined) {
      return maybeOrder
    } else {
      throw new NotFound()
    }
  }

  public async createOrder (
    order: OrderWithoutId,
    farmName: string
  ): Promise<void> {
    const orders = await this.list(farmName)

    const id = await this.nextOrderId(farmName)
    const finalOrder: Order = {
      ...order,
      id: String(id),
      status: 'new',
      passedOn: new Date(Date.now())
    }
    orders.push(finalOrder)
  }

  public async updateOrder (
    orderId: string,
    value: OrderWithoutId,
    farmName: string
  ): Promise<void> {
    const orders = await this.list(farmName)
    const order = orders.find(order => order.id === orderId)

    if (order !== undefined) {
      const index = orders.indexOf(order)
      orders[index] = { id: orderId, ...value }
    } else {
      throw new NotFound()
    }
  }

  public async completeOrder (
    orderId: string,
    farmName: string
  ): Promise<void> {
    const order = await this.getOrder(orderId, farmName)
    order.status = 'canceled'
  }

  private async nextOrderId (farmName: string): Promise<number> {
    const orders = await this.list(farmName)
    const actualMaxOrderId = orders
      .map(order => parseInt(order.id))
      .reduce((max, value) => (value > max ? value : max), 1)
    return actualMaxOrderId + 1
  }
}
