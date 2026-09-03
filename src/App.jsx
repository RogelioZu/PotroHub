import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import Ieee from './pages/Ieee'
import Community from './pages/Community'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="resultados" element={<Results />} />
        <Route path="ieee" element={<Ieee />} />
        <Route path="comunidad" element={<Community />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
