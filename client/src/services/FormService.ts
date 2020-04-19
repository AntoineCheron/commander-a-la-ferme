import { Farm } from '../models'

export default class FormService {
  private static farms: Farm[] = [
    {
      name: 'Bergerie de Bubertre',
      telephone: '02.02.02.02.02',
      address: 'Route de la bergerie, 61190 Bubertré',
      description: 'Bergerie qui vous propose des produits frais et bio',
      paymentMethods: ['Carte Bancaire'],
      inventory: [
        {
          id: '1',
          title: 'Crottins de brebis BIO',
          category: 'Produits en lait BIO de brebis',
          price: 2.5,
          remaining: 80,
          ordered: 20
        },
        {
          id: '2',
          title: 'Crottins de chèvre BIO',
          category: 'Produits en lait BIO de chèvres',
          price: 2.25,
          remaining: 80,
          ordered: 20
        },
        {
          id: 'pending-3',
          title: 'Crottins de brebis',
          category: 'Produits en lait BIO de brebis',
          price: 2.5,
          remaining: 80,
          ordered: 20
        }
      ]
    }
  ]

  static getInventoryOfFarm (farmName: string): Farm | undefined {
    return FormService.farms.find(farm => farm.name === farmName)
  }
}
