import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from "../pages/LoginPage/LoginPage"
import { HomePage } from "../pages/HomePage/HomePage"
import { ProfilePage } from "../pages/ProfilePage/ProfilePage"
import { CreateEventPage } from "../pages/CreateEventPage/CreateEventPage"
import { EditEventPage } from "../pages/EditEventPage/EditEventPage"
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute"
import { MainLayout } from '../layouts/MainLayout'

export const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />} >
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-event" 
        element={
          <ProtectedRoute>
            <CreateEventPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit-event/:id" 
        element={
          <ProtectedRoute>
            <EditEventPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Route>
    </Routes>
  )
}