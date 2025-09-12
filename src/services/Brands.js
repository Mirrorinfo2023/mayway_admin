// src/services/brandService.js

import API_PATHS from '../utils/Apipaths';
import { post ,get,put,del,} from '@/utils/network';

export const getAllBrands = () =>
  get(API_PATHS.GET_ALL_BRANDS);

export const createBrand = (payload) =>
  post(API_PATHS.CREATE_BRAND, payload);

export const deleteBrandById = (id) =>
  del(API_PATHS.DELETE_BRAND_BY_ID(id));
