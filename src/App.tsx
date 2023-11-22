import './App.css'
import ConnectButton from './components/ConnectButton'
import Farmyard from './components/Farmyard'

function App() {
  return (
    <div className='m-auto flex-auto'>
      <ConnectButton />
      <Farmyard></Farmyard>
    </div>
  )
}

export default App
