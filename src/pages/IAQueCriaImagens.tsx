import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brain, Rocket, CheckCircle2, Star } from "lucide-react";

const IAQueCriaImagens = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            IA que Cria Imagens: Entenda Como Funciona (de Forma Simples) 🤖
          </h1>
          <p className="text-xl text-muted-foreground">
            Descubra a mágica por trás da tecnologia que está transformando qualquer pessoa 
            em um artista digital. Sem complicação, só diversão!
          </p>
          <Button size="lg" onClick={() => navigate("/")} className="gap-2">
            <Sparkles className="h-5 w-5" />
            Testar Agora Grátis
          </Button>
        </div>
      </section>

      {/* O que é */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center mb-8">
            O Que É Uma IA que Cria Imagens?
          </h2>
          
          <Card className="border-2">
            <CardContent className="pt-6 space-y-4">
              <p className="text-lg leading-relaxed">
                Imagine ter um artista super talentoso que <strong>nunca dorme</strong>, entende 
                exatamente o que você quer, e pode desenhar <strong>qualquer coisa</strong> em 
                segundos. Isso é uma IA que cria imagens!
              </p>
              
              <div className="bg-primary/5 p-6 rounded-lg">
                <p className="text-lg">
                  🎨 <strong>Em palavras simples:</strong> É um programa de computador que 
                  "aprendeu" com milhões de imagens e agora consegue criar imagens novas 
                  do zero, só a partir da sua descrição em texto.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="container mx-auto px-4 py-12 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Como Funciona? (Sem Termos Técnicos!)
          </h2>
          
          <div className="space-y-6">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  <Brain className="h-12 w-12 text-primary flex-shrink-0 mt-2" />
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">
                      1. A IA "Estudou" Muito 📚
                    </h3>
                    <p className="text-muted-foreground">
                      Assim como você aprende olhando exemplos, a IA foi treinada com bilhões 
                      de imagens e suas descrições. Ela aprendeu que "gato" tem bigodes, 
                      orelhas pontudas e quatro patas. Que "pôr do sol" tem tons laranjas 
                      e rosas. E assim por diante para praticamente tudo!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  <Rocket className="h-12 w-12 text-primary flex-shrink-0 mt-2" />
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">
                      2. Você Faz o Pedido 💬
                    </h3>
                    <p className="text-muted-foreground">
                      Quando você escreve algo como "um cachorro dançando ballet", a IA 
                      analisa cada palavra. Ela sabe como é um cachorro, como é ballet, 
                      e usa toda aquela "experiência" para juntar as duas coisas de forma 
                      criativa.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  <Sparkles className="h-12 w-12 text-primary flex-shrink-0 mt-2" />
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">
                      3. A Mágica Acontece ✨
                    </h3>
                    <p className="text-muted-foreground">
                      Em poucos segundos, a IA cria uma imagem completamente nova, do zero! 
                      Não é uma montagem de fotos existentes - é uma criação original baseada 
                      no que ela "entendeu" do seu pedido.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Por que usar */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por Que Usar Uma IA Para Criar Imagens?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Rápido Como um Raio</h3>
                </div>
                <p className="text-muted-foreground">
                  Uma imagem que levaria horas para um designer criar fica pronta em segundos. 
                  Perfeito quando você tem pressa!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Sem Limite Para Criatividade</h3>
                </div>
                <p className="text-muted-foreground">
                  Quer ver um unicórnio programando? Uma pizza no espaço? Qualquer ideia 
                  maluca vira realidade!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Não Precisa Saber Desenhar</h3>
                </div>
                <p className="text-muted-foreground">
                  Zero habilidade artística necessária. Se você consegue descrever o que quer, 
                  a IA faz o resto!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Econômico</h3>
                </div>
                <p className="text-muted-foreground">
                  Contratar um designer pode ser caro. Com IA, você pode criar dezenas de 
                  imagens por uma fração do preço!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Casos de Uso */}
      <section className="container mx-auto px-4 py-12 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Para Que As Pessoas Usam?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Star className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Redes Sociais</h3>
                <p className="text-sm text-muted-foreground">
                  Criar posts chamativos, stories únicos e conteúdo que se destaca
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Star className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Trabalho</h3>
                <p className="text-sm text-muted-foreground">
                  Ilustrar apresentações, criar materiais de marketing e visualizar ideias
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Star className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Diversão</h3>
                <p className="text-sm text-muted-foreground">
                  Fazer memes, criar avatares personalizados e explorar a criatividade
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Star className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Educação</h3>
                <p className="text-sm text-muted-foreground">
                  Ilustrar conceitos, criar material didático e tornar aulas mais visuais
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Star className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Arte</h3>
                <p className="text-sm text-muted-foreground">
                  Explorar estilos artísticos, criar obras originais e inspirar-se
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Star className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold">Negócios</h3>
                <p className="text-sm text-muted-foreground">
                  Criar logos, mockups de produtos e imagens para sites e lojas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Diferencial Canvas Banana */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Por Que o Canvas Banana é Diferente?
          </h2>
          
          <Card className="border-2">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">🎨 Canvas Visual Único</h3>
                <p className="text-muted-foreground">
                  Diferente de outros geradores, você pode organizar seus prompts e imagens 
                  em um espaço visual, conectando ideias e criando workflows complexos de 
                  forma intuitiva.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">🔗 Combine Múltiplas Imagens</h3>
                <p className="text-muted-foreground">
                  Quer misturar elementos de várias imagens? Nossa interface permite combinar 
                  e transformar múltiplas referências em uma criação única.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">⚡ IA de Última Geração</h3>
                <p className="text-muted-foreground">
                  Usamos o Google Gemini 2.5 Flash, uma das IAs mais avançadas do mercado, 
                  garantindo qualidade profissional em cada imagem.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold">
            Experimente a Melhor IA Para Criar Imagens
          </h2>
          <p className="text-lg text-muted-foreground">
            Gratuito para começar. Sem complicação. Só resultados incríveis! 🚀
          </p>
          <Button size="lg" onClick={() => navigate("/")} className="gap-2">
            <Sparkles className="h-5 w-5" />
            Começar Agora Grátis
          </Button>
        </div>
      </section>

      {/* Navegação */}
      <section className="container mx-auto px-4 py-8 border-t">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Leia Mais:</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => navigate("/como-criar-imagem-com-ia")}>
              Como Criar Imagem
            </Button>
            <Button variant="outline" onClick={() => navigate("/transformar-texto-em-imagem")}>
              Texto para Imagem
            </Button>
            <Button variant="outline" onClick={() => navigate("/criar-arte-com-ia-gratis")}>
              Criar Arte Grátis
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground text-sm">
            © 2025 Canvas Banana - IA que Cria Imagens
          </p>
        </div>
      </footer>
    </div>
  );
};

export default IAQueCriaImagens;
