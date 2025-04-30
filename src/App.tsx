import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

// pages
const LoginPage = lazy(() => import("./pages/login"));

const App: React.FC = () => {
  return (
    <div className="flex w-screen h-screen">
      <Suspense fallback={<h1>Loading....</h1>}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
