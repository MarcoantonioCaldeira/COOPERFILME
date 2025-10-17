import './App.css'
// import { Login } from './components/Login'
import { TelaInicio } from './components/TelaInicio'

function App() {


  return (
    <div className="App">
      {/* <Login onLogin={(data) => { console.log('Logged in', data); }} onBack={() => { console.log('Back clicked'); }} /> */}
      <TelaInicio onNavigate={(page) => { console.log('Navigate to', page); }} />
    </div>
  )
}

export default App
