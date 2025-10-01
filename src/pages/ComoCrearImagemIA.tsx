import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Lightbulb, Zap, Heart, ImageIcon, Wand2 } from "lucide-react";

const ComoCrearImagemIA = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Como Criar Imagem com IA: Guia Completo para Iniciantes 🎨
          </h1>
          <p className="text-xl text-muted-foreground">
            Descubra como transformar suas ideias em imagens incríveis usando inteligência artificial. 
            É mais fácil e divertido do que você imagina!
          </p>
          <Button size="lg" onClick={() => navigate("/")} className="gap-2">
            <Sparkles className="h-5 w-5" />
            Começar a Criar Agora
          </Button>
        </div>
      </section>

      {/* Intro */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <p className="text-lg leading-relaxed">
            Você já imaginou poder criar qualquer imagem que vem à sua cabeça? Um gato astronauta, 
            uma paisagem de outro planeta, ou até mesmo um retrato artístico seu? Com a inteligência 
            artificial, isso não só é possível, como é <strong>surpreendentemente fácil</strong>!
          </p>
        </div>
      </section>

      {/* Passo a Passo */}
      <section className="container mx-auto px-4 py-12 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            5 Passos Para Criar Sua Primeira Imagem com IA
          </h2>
          
          <div className="space-y-8">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Pense na Sua Ideia
                    </h3>
                    <p className="text-muted-foreground">
                      Não precisa ser complicado! Pode ser algo simples como "um cachorro surfando" 
                      ou mais elaborado como "uma cidade futurista ao pôr do sol". Quanto mais 
                      detalhes você der, mais específica será a imagem.
                    </p>
                    <div className="bg-primary/5 p-4 rounded-lg mt-3">
                      <p className="text-sm"><strong>💡 Dica:</strong> Comece simples e vá 
                      adicionando detalhes aos poucos!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      Escreva Sua Descrição
                    </h3>
                    <p className="text-muted-foreground">
                      Agora é hora de descrever sua ideia para a IA. Use palavras simples e seja 
                      descritivo. A IA entende português perfeitamente!
                    </p>
                    <div className="bg-primary/5 p-4 rounded-lg mt-3 space-y-2">
                      <p className="text-sm font-semibold">Exemplos de descrições que funcionam:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>"Um gato laranja dormindo em uma nuvem rosa"</li>
                        <li>"Uma xícara de café fumegante em uma mesa de madeira"</li>
                        <li>"Paisagem montanhosa com aurora boreal"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Wand2 className="h-5 w-5 text-primary" />
                      Deixe a Mágica Acontecer
                    </h3>
                    <p className="text-muted-foreground">
                      Clique no botão de gerar e... pronto! Em poucos segundos a IA vai criar 
                      sua imagem. É como ter um artista profissional trabalhando para você!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">4</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Ajuste se Necessário
                    </h3>
                    <p className="text-muted-foreground">
                      Não ficou exatamente como você queria? Sem problema! Você pode gerar 
                      novamente com pequenas mudanças na descrição ou combinar com outras imagens.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">5</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      Salve e Compartilhe
                    </h3>
                    <p className="text-muted-foreground">
                      Adorou o resultado? Salve sua criação e compartilhe com seus amigos! 
                      Você pode usar suas imagens em redes sociais, trabalhos, ou onde quiser.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dicas Pro */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Dicas de Ouro Para Criar Imagens Incríveis 💎
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-lg">🎯 Seja Específico</h3>
                <p className="text-sm text-muted-foreground">
                  Em vez de "um carro", tente "um carro esportivo vermelho brilhante em alta velocidade"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-lg">🎨 Use Estilos</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione estilos como "aquarela", "fotografia profissional", "desenho animado" para variar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-lg">🌈 Descreva Cores</h3>
                <p className="text-sm text-muted-foreground">
                  Cores fazem diferença! "Céu azul vibrante" funciona melhor que só "céu"
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-lg">⚡ Experimente!</h3>
                <p className="text-sm text-muted-foreground">
                  Não tenha medo de testar ideias malucas. As melhores criações vêm da experimentação!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Exemplos Populares */}
      <section className="container mx-auto px-4 py-12 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Ideias Para Você Começar Agora 🚀
          </h2>
          
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Para Diversão:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• "Meu animal de estimação como super-herói"</li>
                  <li>• "Uma festa de aniversário no espaço"</li>
                  <li>• "Dinossauros jogando videogame"</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Para Trabalho:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• "Logo profissional minimalista para empresa de tecnologia"</li>
                  <li>• "Ilustração de conceito para apresentação"</li>
                  <li>• "Banner para redes sociais com tema moderno"</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Para Arte:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• "Retrato artístico estilo Van Gogh"</li>
                  <li>• "Paisagem surreal com cores vibrantes"</li>
                  <li>• "Arte abstrata inspirada em sonhos"</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold">
            Pronto Para Criar Sua Primeira Imagem?
          </h2>
          <p className="text-lg text-muted-foreground">
            Não precisa de conhecimento técnico, cartão de crédito ou experiência. 
            Só precisa da sua imaginação! 🌟
          </p>
          <Button size="lg" onClick={() => navigate("/")} className="gap-2">
            <Sparkles className="h-5 w-5" />
            Criar Minha Primeira Imagem
          </Button>
          <p className="text-sm text-muted-foreground">
            Grátis para sempre • 5 créditos iniciais
          </p>
        </div>
      </section>

      {/* Navegação */}
      <section className="container mx-auto px-4 py-8 border-t">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Continue Explorando:</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => navigate("/ia-que-cria-imagens")}>
              IA que Cria Imagens
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

      {/* Footer */}
      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground text-sm">
            © 2025 Canvas Banana - Como Criar Imagem com IA
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ComoCrearImagemIA;
