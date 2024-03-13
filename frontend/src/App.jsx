import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import NotFoundPage from "./pages/NotFoundPage"
import TransactionPage from "./pages/TransactionPage"
import Header from "./components/ui/Header"

import { useQuery } from "@apollo/client"
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query"
import { Toaster } from "react-hot-toast"

function App() {

  const { loading, data } = useQuery(GET_AUTHENTICATED_USER)

  if (loading) return null;


  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route path="/" element={data ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!data ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!data ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="transaction/:id" element={data ? <TransactionPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
