import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "pages/App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { IUser, IUsersData } from "./types";
import Navbar from "./components/Navbar";
import UserTable from "components/UserTable";
const client = new ApolloClient({
  uri: "https://ex1.cmhackers.com/graphql",
  cache: new InMemoryCache(),
});
// const client = ...

// client
//   .query({
//     query: gql`
//       query Jwt {
//         getJwt
//       }
//     `,
//   })
//   .then((result) => console.log(result));
const USERS = gql`
  query Users {
    users {
      id
      email
      username
    }
  }
`;
function Users() {
  const { loading, error, data } = useQuery<IUsersData, IUser>(USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data ? <UserTable users={data.users} /> : null;
}
// function App() {
//   return (
//     <div>
//       <Navbar />
//       <h1 className="text-3xl font-bold underline">My second Apollo app 🚀</h1>
//       <Users />
//     </div>
//   );
// }
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="users" element={<Users />} />
        </Routes>
        {/* <div>
          <h1 className="text-3xl font-bold underline">Rummy</h1>
          <App />
        </div> */}
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
