import { BrowserRouter, Routes, Route} from 'react-router-dom'

//pages and components 
import Home from './pages/Home'
import Navbar from './components/NavBar'
import Simulations from './pages/Simulations'
import NotFound from './pages/NotFound'
import About from './pages/About'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className = "pages">
          <Routes>
            <Route
              path="/"
              element={ <Home/>}
              />
            <Route 
              path="/simulations"
              element={ <Simulations/> }
            />
            <Route 
              path="/about"
              element={ <About/> }
            />
            <Route
              path="*"
              element={ <NotFound/> }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
