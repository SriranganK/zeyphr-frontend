import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import SuspenseLoader from "./components/suspense-loader";
import JuryNoticeDialog from "./components/jury-notice";

// pages
const LoginPage = lazy(() => import("./pages/login"));
const HomePage = lazy(() => import("./pages/home"));

const App: React.FC = () => {
  return (
    <div className="flex w-screen h-screen overflow-x-hidden">
      <JuryNoticeDialog />
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
