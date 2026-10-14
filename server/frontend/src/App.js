import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Routes are lazy so each page only loads its own CSS: Home and About use Tailwind/HeroUI,
// the rest still use Bootstrap, and the two must not land on the same page.
const Home = lazy(() => import("./components/Home/Home"));
const About = lazy(() => import("./components/About/About"));
const LoginPanel = lazy(() => import("./components/Login/Login"));
const Register = lazy(() => import("./components/Register/Register"));
const Dealers = lazy(() => import("./components/Dealers/Dealers"));
const Dealer = lazy(() => import("./components/Dealers/Dealer"));
const PostReview = lazy(() => import("./components/Dealers/PostReview"));

function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginPanel />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dealers" element={<Dealers />} />
        <Route path="/dealer/:id" element={<Dealer />} />
        <Route path="/postreview/:id" element={<PostReview/>} />
      </Routes>
    </Suspense>
  );
}
export default App;
