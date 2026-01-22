import { Routes, Route } from 'react-router'
import Home from './pages/home'
import CreateAudience from './pages/createaudience'
import AudienceDetails from './pages/audiencedetails'
import Connections from './pages/connections'
import ComponentsShowcase from './pages/components'
import { useRouteSync } from './hooks/route'
import { useParentCommunication } from './hooks/useParentCommunication'

function App() {
  useRouteSync();
  useParentCommunication();
  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'auto' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-audience" element={<CreateAudience />} />
        <Route path="/:id" element={<AudienceDetails />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/components" element={<ComponentsShowcase />} />
      </Routes>
    </div>
  )
}

export default App
