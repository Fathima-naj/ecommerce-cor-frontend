import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logoutUser, logout } from '../redux/userSlice'
import { useEffect, useState } from 'react'
import { fetchCart, resetCart } from '../redux/cartSlice'

function Navbar() {
  const user = useSelector((state) => state.user.user)
  const navigate=useNavigate()
  const dispatch=useDispatch()
 const [loggingOut, setLoggingOut] = useState(false);

 const handleLogout = async () => {
    setLoggingOut(true)

    try {
        await dispatch(logoutUser()).unwrap()
    } catch (error) {
        console.error('Logout request failed:', error)
    } finally {
        dispatch(logout())
        dispatch(resetCart())
        setLoggingOut(false)
        navigate('/', { replace: true })
    }
}


  const items = useSelector(
    (state) => state.cart.cart?.items || []
)

const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
)

useEffect(() => {
    if (user) {
        dispatch(fetchCart())
    } else {
        dispatch(resetCart())
    }
}, [dispatch, user])

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
          {user && user.role !== 'admin' && (
    <NavLink
        to="/cart"
        className={({ isActive }) =>
            `nav-pill ${isActive ? 'active' : ''}`
        }
    >
        Cart
        <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-[#243a2f] px-1.5 py-0.5 text-xs text-white">
            {cartCount}
        </span>
    </NavLink>
)}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin/products"
              className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
            >
              Manage
            </NavLink>
          )}

          {user ? (
            <div>
              <span className="hidden text-sm font-medium text-[#435448] sm:inline">
              Hi, {user.name}
            </span>
             <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="rounded-lg border border-white/25 px-3 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-60"
                    >
                        {loggingOut ? "Signing out..." : "Logout"}
                    </button>
              </div>
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
