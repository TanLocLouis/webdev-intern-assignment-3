import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  {
    to: '/',
    label: 'Homepage',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" fill="currentColor" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
    ),
  },
  {
    to: '/statistics',
    label: 'Statistics',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" fill="currentColor" viewBox="0 0 512 512"><path d="M32 32c17.7 0 32 14.3 32 32l0 336c0 8.8 7.2 16 16 16l400 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L80 480c-44.2 0-80-35.8-80-80L0 64C0 46.3 14.3 32 32 32zM240 96c6.7 0 13.1 2.8 17.7 7.8L328.8 181.3 375 135c9.4-9.4 24.6-9.4 33.9 0l64 64c4.5 4.5 7 10.6 7 17l0 112c0 13.3-10.7 24-24 24l-304 0c-13.3 0-24-10.7-24-24l0-112c0-6 2.3-11.8 6.3-16.2l88-96c4.5-5 11-7.8 17.7-7.8z"/></svg>
    ),
  },
  {
    to: '/top-group-a',
    label: 'Top Group A',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" fill="currentColor" viewBox="0 0 384 512"><path d="M2.4 204.2c5 12 16.6 19.8 29.6 19.8l320 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-160-160c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-9.2 9.2-11.9 22.9-6.9 34.9zm0 103.5c-5 12-2.2 25.7 6.9 34.9l160 160c12.5 12.5 32.8 12.5 45.3 0l160-160c9.2-9.2 11.9-22.9 6.9-34.9S364.9 288 352 288L32 288c-12.9 0-24.6 7.8-29.6 19.8z"/></svg>
    ),
  },
]

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        id="sidebar-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm transition-colors"
      >
        {mobileOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 w-64
          bg-white border-r border-slate-200/80
          flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-100">
          <NavLink to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/20">
              <span className="text-white font-extrabold text-sm">G</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-none">G-Scores</h1>
              <p className="text-[10px] text-slate-400 uppercase mt-0.5 font-semibold tracking-wider">THPT 2024</p>
            </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="px-3 mb-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 nav-link ${isActive ? 'active' : ''}`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center font-medium">© 2024 G-Scores</p>
        </div>
      </aside>
    </>
  )
}
