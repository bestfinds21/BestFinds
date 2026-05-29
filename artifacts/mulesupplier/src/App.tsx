import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "sonner";
import { EditorToggle } from "@/components/EditorToggle";
import { InstallButton } from "@/components/InstallButton";
import { HomePage } from "@/pages/HomePage";
import { CategoryPage } from "@/pages/CategoryPage";
import { ProductPage } from "@/pages/ProductPage";
import { isEditorUnlocked } from "@/store";

function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-foreground mb-2">404</h1>
        <p className="text-muted-foreground">Page not found.</p>
      </div>
    </div>
  );
}

function Router({ isEditor }: { isEditor: boolean }) {
  return (
    <Switch>
      <Route path="/" component={() => <HomePage isEditor={isEditor} />} />
      <Route path="/c/:categoryId" component={() => <CategoryPage isEditor={isEditor} />} />
      <Route path="/c/:categoryId/p/:productId" component={() => <ProductPage isEditor={isEditor} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isEditor, setIsEditor] = useState(() => isEditorUnlocked());

  useEffect(() => {
    setIsEditor(isEditorUnlocked());
  }, []);

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <WouterRouter base={base}>
      <Router isEditor={isEditor} />
      <EditorToggle isUnlocked={isEditor} onToggle={setIsEditor} />
      <InstallButton />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "hsl(260 20% 10%)",
            color: "hsl(260 10% 95%)",
            border: "1px solid hsl(260 20% 18%)",
          },
        }}
      />
    </WouterRouter>
  );
}

export default App;
