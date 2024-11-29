import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root, {loader as rootLoader, action as rootAction,} from "./routes/root.jsx"
import ErrorPage from "./error-page";
import Contact, {loader as contactLoader, action as contactAction} from "./routes/contact.jsx";
import EditContact, {action as editAction} from "./routes/edit.jsx";
import {action as destroyAction} from "./routes/destroy.jsx";
import Index from "./routes/index.jsx";
import Token from "./routes/token.jsx";
import View from "./routes/view.jsx";
import Login from "./routes/login.jsx";
import Home from "./routes/home.jsx";
import View2 from "./routes/view2.jsx";
import Register from "./routes/register.jsx";


function allow(){
    return false;
};
const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <ErrorPage/>,
        loader: rootLoader,
        action: rootAction,
        children:[
            {
                errorElement: <ErrorPage/>,
                children: [
                    {index: true, element:<Index/>},
                    {
                        path: "contacts/:contactId",
                        element: <Contact />,
                        loader: contactLoader,
                        action: contactAction,
                    },
                    {
                        path: "contacts/:contactId/edit",
                        element: <EditContact />,
                        loader: contactLoader, //no reason to attempt to share loaders among routes, they usually have their own
                        action: editAction,
                    },
                    {
                        path: "contacts/:contactId/destroy",
                        action: destroyAction,
                        errorElement:<div>Oops! There was an error.</div>,
                    },
                ],
            },
        ],
    },
    {
        path: "/token/:t",
        element: <Token></Token>,


    },
    {
        path: "/view/:id",
        element: <View2></View2>,
    },
    {
        path: "/login",
        element: <Login/>,
    },
    {
        path: "/register",
        element: <Register/>,
    },
    {
        path: "/home",
        element: <Home></Home>
    }

]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
