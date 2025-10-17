import './App.css'
import { Login } from './components/Login'

function App() {


  return (
    <div className="App">
      <Login onLogin={(data) => { console.log('Logged in', data); }} onBack={() => { console.log('Back clicked'); }} />
    </div>
  )
}

export default App
