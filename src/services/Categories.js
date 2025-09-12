// src/services/categoryService.js
import { post ,get,put,del,} from '@/utils/network';
import API_PATHS from '../utils/Apipaths';

export const getAllCategories = () =>
  get(API_PATHS.GET_ALL_CATEGORIES);

export const createCategory = (payload) =>
  post(API_PATHS.CREATE_CATEGORY, payload);

export const deleteCategoryById = (id) =>
  del(API_PATHS.DELETE_CATEGORY_BY_ID(id));
