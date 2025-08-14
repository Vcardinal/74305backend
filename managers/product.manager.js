import { ProductModel } from '../models/Product.model.js';

export default class ProductManager {
  async getAll({ limit = 5, page = 1, sort, nombre }) {
    const query = {};
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
    };

     if (nombre) {
      query.nombre = { $regex: nombre, $options: 'i' };
    }

    if (sort) {
      const sortLower = sort.toLowerCase();
      let sortOrder = 1;
      if (sortLower === 'desc') {
        sortOrder = -1;
      }
      options.sort = { precio: sortOrder };
    }

    const result = await ProductModel.paginate(query, options);

    const { docs, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } = result;

    const buildLink = (p) => `/api/products?limit=${limit}&page=${p}` + (sort ? `&sort=${sort}` : '') + (nombre ? `&nombre=${nombre}` : '');

    return {
      status: 'success',
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      page: parseInt(page),
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage && buildLink(prevPage),
      nextLink: hasNextPage && buildLink(nextPage),
    };
  }

  async getById(id) {
    return await ProductModel.findById(id).lean();
  }

  async createProduct(data) {
    return await ProductModel.create(data);
  }

  async updateProduct(id, data) {
    return await ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProduct(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}


