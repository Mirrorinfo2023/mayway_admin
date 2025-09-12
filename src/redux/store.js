// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import dashboardReducer from "./slices/dashboardSlice";
import categoryReducer from "./slices/categorySlice";
import plusCartReducer from "./slices/plusCartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    dashboard: dashboardReducer,
    categories: categoryReducer,
    plusCart: plusCartReducer,
  },
});

export default store;   // <-- default export
