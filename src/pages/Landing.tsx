import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Layers, Zap, Users } from "lucide-react";
import { AuthDialog } from "@/components/landing/AuthDialog";
import { DemoImageUploadNode } from "@/components/landing/DemoImageUploadNode";
import { DemoPromptNode } from "@/components/landing/DemoPromptNode";

const Landing = () => {
  const navigate = useNavigate();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [leftImage, setLeftImage] = useState<string | undefined>();
  const [rightImage, setRightImage] = useState<string | undefined>();
  const [prompt, setPrompt] = useState("");

  const handleImageUpload = (file: File, position: 'left' | 'right') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (position === 'left') {
        setLeftImage(reader.result as string);
      } else {
        setRightImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = () => {
    setAuthDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-canvas-bg via-background to-canvas-bg">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Image Generation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Crie Imagens Incríveis com IA
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed">
            Conecte múltiplas imagens e prompts em um canvas visual. 
            Deixe a IA criar composições únicas combinando suas referências.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => setAuthDialogOpen(true)}
            >
              Começar Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => {
                const featuresEl = document.getElementById("features");
                featuresEl?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Ver Como Funciona
            </Button>
          </div>
        </div>

        {/* Interactive Demo Board */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl" />
            <Card className="relative overflow-hidden border-2 shadow-2xl bg-canvas-bg">
              <CardContent className="p-8 md:p-16">
                <div className="relative min-h-[500px] flex items-center justify-center">
                  {/* Left Image Upload */}
                  <div className="absolute left-0 md:left-12 top-1/2 -translate-y-1/2 z-10">
                    <DemoImageUploadNode
                      imageUrl={leftImage}
                      onImageUpload={(file) => handleImageUpload(file, 'left')}
                      onImageRemove={() => setLeftImage(undefined)}
                    />
                  </div>

                  {/* Center Prompt Node */}
                  <div className="z-20">
                    <DemoPromptNode
                      prompt={prompt}
                      onPromptChange={setPrompt}
                      onGenerate={handleGenerate}
                    />
                  </div>

                  {/* Right Image Upload */}
                  <div className="absolute right-0 md:right-12 top-1/2 -translate-y-1/2 z-10">
                    <DemoImageUploadNode
                      imageUrl={rightImage}
                      onImageUpload={(file) => handleImageUpload(file, 'right')}
                      onImageRemove={() => setRightImage(undefined)}
                    />
                  </div>

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--primary))" />
                      </marker>
                    </defs>
                    {/* Left to Center */}
                    <path
                      d="M 25% 50% Q 37.5% 50% 42% 50%"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                      opacity="0.6"
                    />
                    {/* Right to Center */}
                    <path
                      d="M 75% 50% Q 62.5% 50% 58% 50%"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                      opacity="0.6"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Poder e Simplicidade
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para criar imagens únicas com IA
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Canvas Visual</h3>
                <p className="text-muted-foreground">
                  Sistema de nós intuitivo. Conecte imagens e prompts visualmente 
                  para criar composições complexas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">IA Poderosa</h3>
                <p className="text-muted-foreground">
                  Powered by Google Gemini. Gere imagens combinando 
                  múltiplas referências com prompts personalizados.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Boards Salvos</h3>
                <p className="text-muted-foreground">
                  Organize projetos em boards. Seu trabalho é salvo 
                  automaticamente e pode ser retomado a qualquer momento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Crie imagens incríveis em 4 passos simples
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {[
              {
                step: "01",
                title: "Crie um Board",
                description: "Comece criando um novo board para seu projeto. Dê um nome e organize suas ideias.",
              },
              {
                step: "02",
                title: "Adicione Imagens",
                description: "Carregue múltiplas imagens de referência usando nós de upload. Quantas você quiser!",
              },
              {
                step: "03",
                title: "Conecte e Escreva",
                description: "Conecte suas imagens a um nó de prompt. Descreva o que você quer criar combinando as referências.",
              },
              {
                step: "04",
                title: "Gere com IA",
                description: "Clique em gerar e veja a mágica acontecer. A IA cria uma nova imagem única baseada em suas referências.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{item.step}</span>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-lg text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para Criar?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Junte-se a criadores que estão usando IA para gerar imagens únicas. 
            Comece gratuitamente hoje.
          </p>
          <Button
            size="lg"
            className="text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => setAuthDialogOpen(true)}
          >
            Criar Minha Primeira Imagem
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Canvas Banana. Powered by AI.</p>
        </div>
      </footer>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
};

export default Landing;
