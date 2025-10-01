import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Layers, CheckCircle2, ArrowRight } from "lucide-react";
import { AuthDialog } from "@/components/landing/AuthDialog";

const GeradorImagemIA = () => {
  const navigate = useNavigate();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session as any);
      if (session) {
        navigate("/boards");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session as any);
      if (session) {
        navigate("/boards");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleStartFree = () => {
    navigate("/");
  };

  const handleSignUp = () => {
    setAuthDialogOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent leading-tight">
              Gerador de Imagens com IA Grátis
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Crie imagens impressionantes usando inteligência artificial avançada. 
              Canvas visual para combinar prompts e transformar suas ideias em arte única.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                onClick={handleStartFree}
                className="text-lg gap-2"
              >
                <Sparkles className="h-5 w-5" />
                Começar Grátis Agora
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleSignUp}
                className="text-lg gap-2"
              >
                Criar Conta Grátis
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              ✨ Sem necessidade de cartão de crédito • 5 créditos grátis para começar
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Como Funciona o Gerador de Imagens IA
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Canvas Visual Intuitivo</h3>
                  <p className="text-muted-foreground">
                    Organize seus prompts e imagens em um canvas interativo. 
                    Conecte nós para criar workflows complexos de geração de imagens.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">IA Avançada</h3>
                  <p className="text-muted-foreground">
                    Powered by Google Gemini 2.5 Flash. Tecnologia de ponta para 
                    gerar imagens realistas e criativas a partir de texto.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Resultados Instantâneos</h3>
                  <p className="text-muted-foreground">
                    Veja suas criações ganharem vida em segundos. 
                    Ajuste, refine e combine até atingir a perfeição.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-16 bg-card/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Por Que Escolher o Canvas Banana?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "100% grátis para começar - sem cartão de crédito",
                "Interface visual intuitiva - sem necessidade de código",
                "Combine múltiplas imagens e prompts",
                "Qualidade profissional com IA de ponta",
                "Edite e refine suas criações facilmente",
                "Salve e organize seus projetos"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pronto para Criar Imagens Incríveis com IA?
            </h2>
            <p className="text-xl text-muted-foreground">
              Junte-se a milhares de criadores que já estão usando o Canvas Banana 
              para transformar ideias em realidade visual.
            </p>
            <Button 
              size="lg" 
              onClick={handleStartFree}
              className="text-lg gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Começar Gratuitamente
            </Button>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Perguntas Frequentes
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  O gerador de imagens IA é realmente grátis?
                </h3>
                <p className="text-muted-foreground">
                  Sim! Você recebe 5 créditos grátis para começar, sem necessidade de 
                  cartão de crédito. Cada crédito permite gerar uma imagem com IA.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  Que tipo de imagens posso criar?
                </h3>
                <p className="text-muted-foreground">
                  Você pode criar praticamente qualquer tipo de imagem: arte digital, 
                  ilustrações, designs, mockups, e muito mais. Basta descrever o que 
                  imagina no prompt.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  Preciso de conhecimento técnico?
                </h3>
                <p className="text-muted-foreground">
                  Não! O Canvas Banana foi projetado para ser intuitivo. Se você sabe 
                  descrever o que quer, a IA faz o resto. A interface visual facilita 
                  ainda mais o processo criativo.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  Posso usar as imagens comercialmente?
                </h3>
                <p className="text-muted-foreground">
                  Sim, você tem direitos sobre as imagens que criar. Use-as em seus 
                  projetos pessoais ou comerciais sem preocupações.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center text-muted-foreground">
              © 2025 Canvas Banana - Gerador de Imagens com Inteligência Artificial
            </p>
          </div>
        </footer>
      </div>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};

export default GeradorImagemIA;
