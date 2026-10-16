
import { Outlet } from "react-router-dom";
import AdminNavbar from "../admin/AdminNavbar";


export default function AdminLayout() {
    return (
        <>
            <AdminNavbar />
            <main className="page-wrap">
                <Outlet />
            </main>
        </>
    );
}
