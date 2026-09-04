import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import AppLayout from './layouts/AppLayout';
import Landing   from './pages/Landing';
import Auth      from './pages/Auth';
import Screening from './pages/Screening';
import Translate from './pages/Translate';
import Speak     from './pages/Speak';
import Settings  from './pages/Settings';

// Page transition wrapper
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.18 } },
};

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

// Routes inside AppLayout (all except Auth which is full-page)
function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Full-page auth — no navbar */}
        <Route path="/auth" element={
          <AnimatedPage><Auth /></AnimatedPage>
        } />

        {/* App routes — with navbar */}
        <Route element={<AppLayout />}>
          <Route path="/" element={
            <AnimatedPage><Landing /></AnimatedPage>
          } />
          <Route path="/screening" element={
            <AnimatedPage><Screening /></AnimatedPage>
          } />
          <Route path="/translate" element={
            <AnimatedPage><Translate /></AnimatedPage>
          } />
          <Route path="/speak" element={
            <AnimatedPage><Speak /></AnimatedPage>
          } />
          <Route path="/settings" element={
            <AnimatedPage><Settings /></AnimatedPage>
          } />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
