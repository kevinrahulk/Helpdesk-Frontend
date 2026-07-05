import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store/store"
import { ColorModeProvider } from "./theme/ColorModeContext"
import { router } from "./App"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ColorModeProvider>
        <RouterProvider router={router} />
      </ColorModeProvider>
    </Provider>
  </React.StrictMode>,
)
