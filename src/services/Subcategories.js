// src/services/subcategoryService.js

import { post ,get,put,del,} from '@/utils/network';
import API_PATHS from '../utils/Apipaths';

export const getAllSubcategories = () =>
  get(API_PATHS.GET_ALL_SUBCATEGORIES);

export const createSubcategory = (payload) =>
  post(API_PATHS.CREATE_SUBCATEGORY, payload);

export const deleteSubcategoryById = (id) =>
  del(API_PATHS.DELETE_SUBCATEGORY_BY_ID(id));
