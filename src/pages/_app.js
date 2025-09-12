
// src/pages/_app.js
"use client"; // required if you use hooks like useEffect here
import "@/styles/globals.css";
import { Provider } from "react-redux";
import store from "@/redux/store"; // no curly braces now
import Layout from "@/components/common/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MyApp({ Component, pageProps }) {
  const noLayout = Component.noLayout || false;
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Skip auth check for login/register pages
    if (noLayout) {
      setAuthorized(true);
      return;
    }

    const token = sessionStorage.getItem("token"); // JWT or your auth method
    if (!token) {
      router.replace("/login"); // redirect to login if not authenticated
    } else {
      setAuthorized(true);
    }
  }, [router.pathname]);

  // Prevent rendering before auth check
  if (!authorized) return null;

  return (
    <Provider store={store}>
      {noLayout ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </Provider>
  );
}



