import { Order } from '../models'

export default class OrderService {
  private static orders: Order[] = [
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

  static getAll (): Order[] {
    return OrderService.orders
  }

  static findById (id: string): Order | undefined {
    return OrderService.orders.find(order => order.id === id)
  }
}
