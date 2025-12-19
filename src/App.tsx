import { Routes, Route } from 'react-router'
import Home from './pages/home'
import CreateAudience from './pages/createaudience'
import ComponentsShowcase from './pages/components'
import { useRouteSync } from './hooks/route'

function App() {
  useRouteSync();
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-audience" element={<CreateAudience />} />
        <Route path="/components" element={<ComponentsShowcase />} />
      </Routes>
    </div>
  )
}

export default App
