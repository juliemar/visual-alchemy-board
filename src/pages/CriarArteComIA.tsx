import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Palette, Heart, TrendingUp, Users, Gift } from "lucide-react";

const CriarArteComIA = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Criar Arte com IA Grátis: Libere o Artista em Você 🎨
          </h1>
          <p className="text-xl text-muted-foreground">
            Transforme suas ideias em obras de arte impressionantes sem precisar 
            de anos de treino artístico. É grátis, fácil e super divertido!
          </p>
          <Button size="lg" onClick={() => navigate("/")} className="gap-2">
            <Sparkles className="h-5 w-5" />
            Criar Minha Primeira Arte
          </Button>
        </div>
      </section>

      {/* Intro */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2">
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-2xl font-bold">
                Por Que Criar Arte com IA?
              </h2>
              <p className="text-lg leading-relaxed">
                Sabe aquela sensação de ver uma obra de arte linda e pensar <em>"queria conseguir 
                fazer isso"</em>? Com IA, você consegue! Não importa se você nunca segurou um pincel 
                na vida - se você tem imaginação, você pode criar arte incrível.
              </p>
              
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
                <p className="font-semibold text-center text-lg">
                  💫 Qualquer pessoa pode ser artista com as ferramentas certas!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tipos de Arte */}
      <section className="container mx-auto px-4 py-12 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Que Tipo de Arte Você Pode Criar?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Palette className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-semibold text-lg">🎨 Arte Digital</h3>
                <p className="text-sm text-muted-foreground">
                  Pinturas digitais, ilustrações modernas, arte conceitual para jogos e filmes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Palette className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-semibold text-lg">🖼️ Estilos Clássicos</h3>
                <p className="text-sm text-muted-foreground">
                  Recrie obras no estilo Van Gogh, Monet, Picasso ou qualquer artista famoso
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Palette className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-semibold text-lg">✨ Arte Abstrata</h3>
                <p className="text-sm text-muted-foreground">
                  Explore formas, cores e composições únicas que expressam emoções
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Palette className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-semibold text-lg">🌟 Arte Fantástica</h3>
                <p className="text-sm text-muted-foreground">
                  Criaturas míticas, mundos imaginários, cenários de fantasia épicos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Palette className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-semibold text-lg">📸 Fotorrealismo</h3>
                <p className="text-sm text-muted-foreground">
                  Imagens que parecem fotografias reais, mas totalmente geradas por IA
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Palette className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-semibold text-lg">🎭 Arte Pop</h3>
                <p className="text-sm text-muted-foreground">
                  Cores vibrantes, alto contraste, estilo Andy Warhol e cultura pop
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Casos de Uso */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Como Pessoas Estão Usando Arte com IA
          </h2>
          
          <div className="space-y-6">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  <Heart className="h-8 w-8 text-primary flex-shrink-0" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Para Decoração</h3>
                    <p className="text-muted-foreground">
                      Crie arte única para sua casa ou escritório. Imprima e emoldure 
                      suas próprias criações por uma fração do preço de arte tradicional.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  <TrendingUp className="h-8 w-8 text-primary flex-shrink-0" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Para Vender</h3>
                    <p className="text-muted-foreground">
                      Muitas pessoas estão vendendo arte gerada por IA em prints, 
                      camisetas, canecas e outros produtos. Comece seu negócio criativo!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  <Users className="h-8 w-8 text-primary flex-shrink-0" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Para Redes Sociais</h3>
                    <p className="text-muted-foreground">
                      Destaque-se no Instagram, TikTok e outras plataformas com 
                      arte original que ninguém mais tem.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  <Gift className="h-8 w-8 text-primary flex-shrink-0" />
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Para Presentes</h3>
                    <p className="text-muted-foreground">
                      Crie presentes personalizados e memoráveis para amigos e família. 
                      Um retrato artístico ou uma paisagem especial pode ser inesquecível!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ideias */}
      <section className="container mx-auto px-4 py-12 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            10 Ideias de Arte Para Você Começar Agora
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Retrato seu no estilo Van Gogh",
              "Paisagem alienígena com múltiplas luas",
              "Animal de estimação como personagem de anime",
              "Cidade futurista cyberpunk ao entardecer",
              "Floresta mágica com árvores bioluminescentes",
              "Dragão majestoso sobre montanhas",
              "Praia tropical em estilo aquarela",
              "Galáxia espiral em cores vibrantes",
              "Castelo medieval flutuando nas nuvens",
              "Jardim zen com flores exóticas"
            ].map((idea, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <p className="flex items-center gap-2">
                    <span className="text-primary font-bold">{index + 1}.</span>
                    <span>{idea}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dicas */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Dicas Para Criar Arte Profissional com IA
          </h2>
          
          <div className="space-y-4">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">💡 Especifique o Estilo Artístico</h3>
                <p className="text-muted-foreground">
                  Adicione termos como "óleo sobre tela", "aquarela", "arte digital", 
                  "fotorrealista", "impressionista" para guiar o estilo da IA.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">🎨 Use Referências de Artistas</h3>
                <p className="text-muted-foreground">
                  "No estilo de Picasso", "inspirado em Banksy", "como uma obra de Dali" 
                  ajudam a IA a entender a estética que você busca.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">🌈 Descreva a Paleta de Cores</h3>
                <p className="text-muted-foreground">
                  "Paleta de cores quentes", "tons pastéis suaves", "cores vibrantes e saturadas" 
                  fazem toda diferença no resultado final.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">⚡ Adicione Atmosfera</h3>
                <p className="text-muted-foreground">
                  Palavras como "melancólico", "alegre", "misterioso", "épico" ajudam 
                  a transmitir emoção na sua arte.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">🔄 Experimente e Itere</h3>
                <p className="text-muted-foreground">
                  Não espere perfeição na primeira tentativa! Gere várias versões, 
                  ajuste sua descrição e veja qual resultado você mais gosta.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Por que Canvas Banana */}
      <section className="container mx-auto px-4 py-12 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Por Que Criar Arte no Canvas Banana?
          </h2>
          
          <Card className="border-2">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">100% Gratuito Para Começar</h3>
                  <p className="text-muted-foreground text-sm">
                    Não pedimos cartão de crédito. Você ganha 5 créditos grátis para 
                    experimentar e criar suas primeiras obras de arte!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Interface Visual Única</h3>
                  <p className="text-muted-foreground text-sm">
                    Nosso canvas visual permite combinar múltiplas ideias, misturar estilos 
                    e criar workflows criativos complexos de forma intuitiva.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Qualidade Profissional</h3>
                  <p className="text-muted-foreground text-sm">
                    Usamos IA de última geração (Google Gemini 2.5) para garantir 
                    resultados que rivalizam com arte criada por humanos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-12">
          <h2 className="text-3xl font-bold">
            Comece Sua Jornada Artística Hoje!
          </h2>
          <p className="text-lg text-muted-foreground">
            Não deixe a falta de habilidade artística tradicional te impedir. 
            Com IA, você é limitado apenas pela sua imaginação! 🎨✨
          </p>
          <Button size="lg" onClick={() => navigate("/")} className="gap-2">
            <Sparkles className="h-5 w-5" />
            Criar Arte Grátis Agora
          </Button>
          <p className="text-sm text-muted-foreground">
            5 créditos grátis • Sem necessidade de cartão
          </p>
        </div>
      </section>

      {/* Navegação */}
      <section className="container mx-auto px-4 py-8 border-t">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">Artigos Relacionados:</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={() => navigate("/como-criar-imagem-com-ia")}>
              Como Criar Imagem
            </Button>
            <Button variant="outline" onClick={() => navigate("/ia-que-cria-imagens")}>
              IA que Cria Imagens
            </Button>
            <Button variant="outline" onClick={() => navigate("/transformar-texto-em-imagem")}>
              Texto para Imagem
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground text-sm">
            © 2025 Canvas Banana - Criar Arte com IA Grátis
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CriarArteComIA;
