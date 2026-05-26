import { Toaster } from "sonner";
import { Route, Switch, Router as WouterRouter } from "wouter";
import Home from "./pages/Home";
import Create from "./pages/Create";
import NotFound from "./pages/NotFound";

const basePath = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create" component={Create} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-center" theme="dark" />
      <WouterRouter base={basePath}>
        <Router />
      </WouterRouter>
    </>
  );
}
