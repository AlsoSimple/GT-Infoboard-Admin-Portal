import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from "../pages/LoginPage/LoginPage"
import { HomePage } from "../pages/HomePage/HomePage"
import { ProfilePage } from "../pages/ProfilePage/ProfilePage"
import { CreateEventPage } from "../pages/CreateEventPage/CreateEventPage"
import { EditEventPage } from "../pages/EditEventPage/EditEventPage"

export const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/create-event" element={<CreateEventPage />} />
      <Route path="/edit-event/:id" element={<EditEventPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}