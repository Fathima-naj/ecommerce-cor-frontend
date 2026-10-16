import { useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  const user = useSelector((state) => state.user.user)

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7dfd2] bg-[#f7f3ee]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-3 text-[#243a2f] no-underline">
          <span className="brand-mark">g</span>
          <span className="text-xl font-semibold tracking-[-0.04em]">goodfinds</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-[#617263] sm:inline">
            Thoughtful living
          </span>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `nav-pill ${isActive ? 'active' : ''}`
            }
          >
            Products
          </NavLink>

          {user?.role === 'admin' && (
            <NavLink
              to="/admin/products"
              className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
            >
              Manage
            </NavLink>
          )}

          {user ? (
            <span className="hidden text-sm font-medium text-[#435448] sm:inline">
              Hi, {user.name}
            </span>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
