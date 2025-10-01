import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, MessageSquare, Image, Zap, Palette } from "lucide-react";

const TransformarTextoEmImagem = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Transformar Texto em Imagem: A Mágica da IA Explicada ✨
          </h1>
          <p className="text-xl text-muted-foreground">
            Aprenda a transformar suas palavras em imagens incríveis! É como ter 
            superpoderes criativos na ponta dos dedos.
          </p>
          <Button size="lg" onClick={() => navigate("/")} className="gap-2">
            <Sparkles className="h-5 w-5" />
            Testar a Mágica Agora
          </Button>
        </div>
      </section>

      {/* Intro */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2">
            <CardContent className="pt-6 space-y-4">
              <p className="text-lg leading-relaxed">
                Imagine se você pudesse simplesmente <strong>descrever</strong> qualquer cena, 
                objeto ou ideia e, magicamente, ver ela ganhar vida em uma imagem linda? 
                Isso não é mais ficção científica - é a realidade da tecnologia texto para imagem!
              </p>
              
              <div className="bg-primary/5 p-6 rounded-lg">
                <p className="text-lg font-semibold text-center">
                  "Um pôr do sol roxo sobre montanhas nevadas" → 🎨 → Uma imagem perfeita!
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
            Como Transformar Texto em Imagem?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">1. Escreva</h3>
                <p className="text-muted-foreground">
                  Digite ou fale o que você quer ver. Pode ser simples ou detalhado!
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">2. IA Trabalha</h3>
                <p className="text-muted-foreground">
                  A inteligência artificial interpreta suas palavras e cria a imagem
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Image className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">3. Resultado</h3>
                <p className="text-muted-foreground">
                  Sua imagem aparece em segundos, pronta para usar!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Exemplos Práticos */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Exemplos de Transformação Texto → Imagem
          </h2>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/10 px-3 py-1 rounded text-sm font-semibold text-blue-600">
                      TEXTO
                    </div>
                    <p className="flex-1 italic">
                      "Um gato astronauta flutuando no espaço com a Terra ao fundo"
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 px-3 py-1 rounded text-sm font-semibold text-primary">
                      RESULTADO
                    </div>
                    <p className="flex-1 text-muted-foreground">
                      Uma imagem fotorealista de um gato com traje espacial, cercado por estrelas, 
                      com nosso planeta azul brilhando ao fundo ✨
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/10 px-3 py-1 rounded text-sm font-semibold text-blue-600">
                      TEXTO
                    </div>
                    <p className="flex-1 italic">
                      "Café fumegante em uma xícara branca sobre uma mesa de madeira rústica"
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 px-3 py-1 rounded text-sm font-semibold text-primary">
                      RESULTADO
                    </div>
                    <p className="flex-1 text-muted-foreground">
                      Uma foto aconchegante e profissional, perfeita para posts de café da manhã 
                      ou marketing de cafeteria ☕
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/10 px-3 py-1 rounded text-sm font-semibold text-blue-600">
                      TEXTO
                    </div>
                    <p className="flex-1 italic">
                      "Logo minimalista para empresa de tecnologia, cores azul e branco"
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 px-3 py-1 rounded text-sm font-semibold text-primary">
                      RESULTADO
                    </div>
                    <p className="flex-1 text-muted-foreground">
                      Um design profissional e moderno, pronto para usar no seu site ou cartão 
                      de visitas 💼
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dicas */}
      <section className="container mx-auto px-4 py-12 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Segredos Para Textos Que Geram Imagens Perfeitas
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Palette className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-semibold text-lg">✅ FAÇA Assim:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• "Um cachorro golden retriever correndo em um campo florido ao pôr do sol"</li>
                  <li>• Use adjetivos: lindo, moderno, vibrante, suave</li>
                  <li>• Descreva cores: azul céu, vermelho intenso</li>
                  <li>• Mencione estilos: fotografia, aquarela, cartoon</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Palette className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-semibold text-lg">❌ EVITE Assim:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• "Um cachorro" (muito vago)</li>
                  <li>• Textos muito longos e confusos</li>
                  <li>• Instruções contraditórias</li>
                  <li>• Pedir coisas impossíveis fisicamente</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Usos Populares */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            O Que Você Pode Criar Transformando Texto em Imagem?
          </h2>
          
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 text-lg">🎨 Para Criatividade Pessoal:</h3>
                <div className="grid md:grid-cols-2 gap-3 text-muted-foreground">
                  <p>• Ilustrações para histórias</p>
                  <p>• Avatares personalizados</p>
                  <p>• Memes originais</p>
                  <p>• Cartões de presente únicos</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 text-lg">💼 Para Trabalho e Negócios:</h3>
                <div className="grid md:grid-cols-2 gap-3 text-muted-foreground">
                  <p>• Posts para redes sociais</p>
                  <p>• Imagens para apresentações</p>
                  <p>• Mockups de produtos</p>
                  <p>• Banners e anúncios</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 text-lg">📚 Para Educação:</h3>
                <div className="grid md:grid-cols-2 gap-3 text-muted-foreground">
                  <p>• Ilustrar conceitos complexos</p>
                  <p>• Material didático visual</p>
                  <p>• Infográficos educativos</p>
                  <p>• Mapas mentais ilustrados</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparação */}
      <section className="container mx-auto px-4 py-12 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Texto Para Imagem vs. Método Tradicional
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg text-center mb-4">
                  🚀 Com IA (Texto → Imagem)
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm">Segundos para criar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm">Não precisa saber desenhar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm">Ilimitadas tentativas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span className="text-sm">Custo baixo ou grátis</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg text-center mb-4">
                  🎨 Método Tradicional
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">Horas ou dias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">Precisa de habilidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">Revisões demoradas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">Pode ser caro</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold">
            Comece a Transformar Seus Textos em Imagens Agora!
          </h2>
          <p className="text-lg text-muted-foreground">
            Grátis, fácil e divertido. Você só precisa saber escrever! 💬→🎨
          </p>
          <Button size="lg" onClick={() => navigate("/")} className="gap-2">
            <Sparkles className="h-5 w-5" />
            Experimentar Grátis Agora
          </Button>
          <p className="text-sm text-muted-foreground">
            5 créditos grátis • Sem cartão de crédito
          </p>
        </div>
      </section>

      {/* Navegação */}
      <section className="container mx-auto px-4 py-8 border-t">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Continue Explorando:</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => navigate("/como-criar-imagem-com-ia")}>
              Como Criar Imagem
            </Button>
            <Button variant="outline" onClick={() => navigate("/ia-que-cria-imagens")}>
              IA que Cria Imagens
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
            © 2025 Canvas Banana - Transformar Texto em Imagem
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TransformarTextoEmImagem;
