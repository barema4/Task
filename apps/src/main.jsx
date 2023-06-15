import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App.jsx";
import "./index.css";
import usersReducer from "./usersSlice";

const queryClient = new QueryClient();

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>
);
