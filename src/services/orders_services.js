import { get, post, put, deleteReq } from '../utils/network';
import API_PATHS from '../utils/Apipaths';

// 1. Create Order
export const createOrder = async (payload) => {
  return await post({
    path: API_PATHS.ORDER_CREATE,
    data: payload,
  });
};

// 2. Get All Orders (with optional filters)
export const getAllOrders = async ({ startDate, endDate, status } = {}) => {
  const queryParams = [];

  if (startDate) queryParams.push(`startDate=${startDate}`);
  if (endDate) queryParams.push(`endDate=${endDate}`);
  if (status) queryParams.push(`status=${status}`);

  const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

  return await get({
    path: `${API_PATHS.ORDER_LIST}${queryString}`,
  });
};
export async function getOrders() {
  try {
    const res = await apiRequest.get(API_PATHS.GET_ORDERS);
    return res.data;
  } catch (err) {
    console.error('Failed to fetch orders', err);
    return [];
  }
}
// 3. Get Order by ID
export const getOrderById = async (orderId) => {
  return await get({
    path: API_PATHS.ORDER_DETAILS(orderId),
  });
};

// 4. Update Order Status
export const updateOrderStatus = async (orderId, newStatus) => {
  return await put({
    path: API_PATHS.ORDER_UPDATE_STATUS(orderId),
    data: { status: newStatus },
  });
};

// 5. Cancel Order
export const cancelOrder = async (orderId) => {
  return await put({
    path: API_PATHS.ORDER_CANCEL(orderId),
  });
};

// 6. Return Order
export const returnOrder = async (orderId) => {
  return await put({
    path: API_PATHS.ORDER_RETURN(orderId),
  });
};

// 7. Delete Order
export const deleteOrder = async (Id) => {
  return await deleteReq({
    path: API_PATHS.ORDER_DELETE(Id),
  });
};

// 8. Get Order filter (startDate, endDate, status)
export const getOrderFilter = async ({ startDate, endDate, status }) => {
  const queryParams = [];

  if (startDate) queryParams.push(`startDate=${startDate}`);
  if (endDate) queryParams.push(`endDate=${endDate}`);
  if (status) queryParams.push(`status=${status}`);

  const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

  return await get({
    path: `${API_PATHS.ORDER_LIST}${queryString}`,
  });
};