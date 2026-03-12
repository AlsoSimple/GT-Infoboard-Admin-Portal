import { Outlet } from "react-router-dom";
import { Navigation } from "../components/navigation/Navigation";
import style from './MainLayout.module.scss'

export function MainLayout(){
  return(
    <main className={style.mainLayoutContainer}>
      <Navigation />
      <Outlet />
    </main>
  )
}