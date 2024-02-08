import { BrowserRouter, Routes, Route} from 'react-router-dom'

//pages and components 
import Home from './pages/Home'
import Navbar from './components/NavBar'
import Simulations from './pages/Simulations'
import NotFound from './pages/NotFound'
import About from './pages/About'
import Documentation from './pages/Documentation'
import Api from './pages/documentation/Api'
import Client from './pages/documentation/Client'
import Installation from './pages/documentation/Installation'
import ParametersById from './pages/ParametersById'

import Footer from './components/Footer/Footer'
import ParameterSearch from './pages/ParameterSearch'

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
              path="/:id/parameters"
              element={ <ParametersById/>}
            />
            <Route 
              path="/simulation_runs"
              element={ <Simulations/> }
            />
            <Route 
              path="/parameter_search"
              element={ <ParameterSearch/> }
            />
            <Route 
              path="/about"
              element={ <About/> }
            />
            <Route 
              path="/documentation"
              element={ <Documentation/> }
            />
            <Route 
              path="/documentation/api"
              element={ <Api/> }
            />
            <Route 
              path="/documentation/client"
              element={ <Client/> }
            />
            <Route 
              path="/documentation/installation"
              element={ <Installation/> }
            />
            <Route
              path="*"
              element={ <NotFound/> }
            />
          </Routes>
        </div>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
