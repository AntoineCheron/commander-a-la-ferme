import { Order, OrderRequest, OrderStatus } from '../models'
import Http from './Http'

export default class OrderService {
  public async getAll (): Promise<Order[]> {
    const response = await Http.instance().get('/orders')
    return response.data.orders.map(this.retype)
  }

  public async findById (id: string): Promise<Order> {
    const response = await Http.instance().get(`/orders/${id}`)
    return this.retype(response.data)
  }

  public async create (farmName: string, order: OrderRequest): Promise<void> {
    return await Http.instance().post(`/orders/${farmName}`, order)
  }

  public async updateStatus (
    orderId: string,
    status: OrderStatus
  ): Promise<void> {
    return await Http.instance().put(`/orders/${orderId}/status`, { status })
  }

  private retype (order: Order): Order {
    return {
      ...order,
      passedOn: new Date(order.passedOn)
    }
  }
}
