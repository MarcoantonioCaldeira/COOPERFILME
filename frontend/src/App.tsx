import './App.css'
// import { Login } from './components/Login'
import { PublicHome } from './components/PublicHome'

function App() {


  return (
    <div className="App">
      {/* <Login onLogin={(data) => { console.log('Logged in', data); }} onBack={() => { console.log('Back clicked'); }} /> */}
      <PublicHome onNavigate={(page) => { console.log('Navigate to', page); }} />
    </div>
  )
}

export default App
