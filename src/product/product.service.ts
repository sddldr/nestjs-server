import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  private products = [
    { id: 1, product: 'iPhone', price: 999, number: 10 },
    { id: 2, product: 'MacBook', price: 1999, number: 5 },
  ];

  findAll() {
    return this.products;
  }

  create(product) {
    this.products.push({
      ...product,
      id: Date.now(),
    });
    return { success: true };
  }

  update(id: number, product) {
    this.products = this.products.map((p) =>
      p.id === id ? { ...p, ...product } : p,
    );
    return { success: true };
  }

  remove(id: number) {
    this.products = this.products.filter((p) => p.id !== id);
    return { success: true };
  }
}
