import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import GeradorImagemIA from "./pages/GeradorImagemIA";
import Boards from "./pages/Boards";
import Canvas from "./pages/Canvas";
import Backoffice from "./pages/Backoffice";
import PaymentSuccess from "./pages/PaymentSuccess";
import PurchaseCredits from "./pages/PurchaseCredits";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/gerador-imagem-ia-gratis" element={<GeradorImagemIA />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/canvas/:boardId" element={<Canvas />} />
          <Route path="/backoffice" element={<Backoffice />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/purchase-credits" element={<PurchaseCredits />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
