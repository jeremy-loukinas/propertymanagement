import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <aside className="aside">
            <div className="brand">PropertyOps</div>
            <nav className="nav">
              <a href="/">Dashboard</a>
              <a href="/bookings">Bookings</a>
              <a href="/tickets">Tickets</a>
              <a href="/calls">Service Calls</a>
              <a href="/vendors">Vendors</a>
              <a href="/assets">Properties & Units</a>
              <a href="/admin">Admin</a>
            </nav>
            <footer>v0.5</footer>
          </aside>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  )
}
