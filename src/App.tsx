import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'

function App() {
  return (
    <div className="bg-background text-on-background font-body antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      <Navbar />
      <main className="pt-[80px]">
        <HomePage />
      </main>
      <Footer />
    </div>
  )
}

export default App
