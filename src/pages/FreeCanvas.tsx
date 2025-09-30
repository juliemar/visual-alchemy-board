import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploadNode } from "@/components/canvas/ImageUploadNode";
import { PromptNode } from "@/components/canvas/PromptNode";
import { GeneratedImageNode } from "@/components/canvas/GeneratedImageNode";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { NodeCreationMenu } from "@/components/canvas/NodeCreationMenu";
import { FreemiumAuthModal } from "@/components/canvas/FreemiumAuthModal";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import { generateBoardThumbnail } from "@/lib/boardThumbnail";
import { toPng } from "html-to-image";

const nodeTypes = {
  image_upload: ImageUploadNode,
  prompt: PromptNode,
  generated_image: GeneratedImageNode,
};

const STORAGE_KEY = "free_generations_count";
const MAX_FREE_GENERATIONS = 5;

const FreeCanvasInner = () => {
  const navigate = useNavigate();
  const reactFlowInstance = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [zoom, setZoom] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [generationsCount, setGenerationsCount] = useState(0);
  const [session, setSession] = useState<any>(null);

  // Inicializar canvas com nós padrão
  useEffect(() => {
    const initialNodes: Node[] = [
      {
        id: crypto.randomUUID(),
        type: "image_upload",
        position: { x: 100, y: 150 },
        data: {},
      },
      {
        id: crypto.randomUUID(),
        type: "image_upload",
        position: { x: 100, y: 350 },
        data: {},
      },
      {
        id: crypto.randomUUID(),
        type: "prompt",
        position: { x: 400, y: 250 },
        data: {},
      },
    ];

    setNodes(initialNodes);

    // Criar conexões iniciais
    setEdges([
      { id: crypto.randomUUID(), source: initialNodes[0].id, target: initialNodes[2].id },
      { id: crypto.randomUUID(), source: initialNodes[1].id, target: initialNodes[2].id },
    ]);

    // Carregar contador de gerações
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setGenerationsCount(parseInt(stored, 10));
    }
  }, []);

  // Monitorar sessão
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Se usuário logou, migrar canvas para board real
        migrateToRealBoard();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        migrateToRealBoard();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const migrateToRealBoard = async () => {
    if (nodes.length === 0) {
      navigate("/boards");
      return;
    }

    try {
      // Criar board real
      const { data: boardData, error: boardError } = await supabase
        .from("boards")
        .insert({ name: "Meu Primeiro Board", user_id: (await supabase.auth.getUser()).data.user?.id })
        .select()
        .single();

      if (boardError) throw boardError;

      // Migrar nós
      for (const node of nodes) {
        await supabase.from("nodes").insert({
          id: node.id,
          board_id: boardData.id,
          node_type: node.type || 'image_upload',
          node_data: node.data as any,
          position_x: node.position.x,
          position_y: node.position.y,
        });
      }

      // Migrar conexões
      for (const edge of edges) {
        await supabase.from("connections").insert({
          id: edge.id,
          board_id: boardData.id,
          source_node_id: edge.source,
          target_node_id: edge.target,
        });
      }

      toast.success("Canvas salvo! Bem-vindo!");
      localStorage.removeItem(STORAGE_KEY);
      navigate(`/canvas/${boardData.id}`);
    } catch (error) {
      console.error("Error migrating canvas:", error);
      navigate("/boards");
    }
  };

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
      toast.success("Conexão criada!");
    },
    []
  );

  const handleCreateNode = (type: "image_upload" | "prompt") => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type,
      position: { x: 200 + Math.random() * 300, y: 200 + Math.random() * 300 },
      data: {},
    };

    setNodes((nds) => [...nds, newNode]);
    toast.success("Nó criado!");
  };

  const handleImageUpload = (nodeId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, imageUrl: base64 } }
            : node
        )
      );
      toast.success("Imagem carregada!");
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (nodeId: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, imageUrl: undefined } }
          : node
      )
    );
    toast.success("Imagem removida!");
  };

  const handleGenerate = async (nodeId: string, prompt: string) => {
    // Verificar limite de gerações grátis
    if (generationsCount >= MAX_FREE_GENERATIONS) {
      setShowAuthModal(true);
      return;
    }

    const sourceNodes = edges
      .filter((edge) => edge.target === nodeId)
      .map((edge) => nodes.find((n) => n.id === edge.source))
      .filter((node) => node?.data?.imageUrl);

    if (sourceNodes.length === 0) {
      toast.error("Conecte pelo menos uma imagem para gerar");
      return;
    }

    const imageUrls = sourceNodes.map((node) => node!.data.imageUrl);

    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, isGenerating: true } }
          : node
      )
    );

    const resultNodeId = crypto.randomUUID();
    const resultNode: Node = {
      id: resultNodeId,
      type: "generated_image",
      position: {
        x: nodes.find((n) => n.id === nodeId)!.position.x + 350,
        y: nodes.find((n) => n.id === nodeId)!.position.y,
      },
      data: { isGenerating: true },
    };

    setNodes((nds) => [...nds, resultNode]);
    
    const edgeId = crypto.randomUUID();
    setEdges((eds) => [...eds, {
      id: edgeId,
      source: nodeId,
      target: resultNodeId,
    }]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt, images: imageUrls },
      });

      if (error) throw error;

      setNodes((nds) =>
        nds.map((node) =>
          node.id === resultNodeId
            ? { ...node, data: { imageUrl: data.imageUrl, isGenerating: false } }
            : node.id === nodeId
            ? { ...node, data: { ...node.data, isGenerating: false } }
            : node
        )
      );

      // Incrementar contador
      const newCount = generationsCount + 1;
      setGenerationsCount(newCount);
      localStorage.setItem(STORAGE_KEY, newCount.toString());

      toast.success("Imagem gerada! Cadastre-se para criar mais!");
    } catch (error: any) {
      toast.error(error.message || "Falha ao gerar imagem");
      setNodes((nds) => nds.filter((n) => n.id !== resultNodeId));
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, isGenerating: false } }
            : node
        )
      );
    }
  };

  const remainingGenerations = MAX_FREE_GENERATIONS - generationsCount;

  return (
    <div className="h-screen w-screen">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <h1 className="text-2xl font-bold">Experimente Grátis</h1>
        <div className="bg-primary/10 px-3 py-1 rounded-full text-sm">
          {remainingGenerations} imagem grátis restante
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <Button onClick={() => setShowAuthModal(true)} variant="outline">
          <LogIn className="mr-2 h-4 w-4" />
          Entrar / Cadastrar
        </Button>
      </div>

      <CanvasToolbar zoomLevel={zoom} />
      
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            onImageUpload: node.type === "image_upload"
              ? (file: File) => handleImageUpload(node.id, file)
              : undefined,
            onImageRemove: node.type === "image_upload"
              ? () => handleImageRemove(node.id)
              : undefined,
            onGenerate: node.type === "prompt"
              ? (prompt: string) => handleGenerate(node.id, prompt)
              : undefined,
          },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        onMove={(_, viewport) => setZoom(viewport.zoom)}
      >
        <Background />
        <Controls />
      </ReactFlow>

      <NodeCreationMenu onCreateNode={handleCreateNode} />

      <FreemiumAuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onSuccess={async () => {
          try {
            // Salvar canvas temporário como board real
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Criar novo board
            const { data: boardData, error: boardError } = await supabase
              .from("boards")
              .insert({
                name: "Meu Primeiro Board",
                user_id: user.id,
              })
              .select()
              .single();

            if (boardError) throw boardError;

            // Salvar todos os nós
            if (nodes.length > 0) {
              const nodesData = nodes.map((node) => ({
                id: node.id,
                board_id: boardData.id,
                node_type: node.type,
                position_x: node.position.x,
                position_y: node.position.y,
                node_data: node.data,
              }));

              const { error: nodesError } = await supabase
                .from("nodes")
                .insert(nodesData);

              if (nodesError) throw nodesError;
            }

            // Salvar todas as conexões
            if (edges.length > 0) {
              const connectionsData = edges.map((edge) => ({
                board_id: boardData.id,
                source_node_id: edge.source,
                target_node_id: edge.target,
              }));

              const { error: connectionsError } = await supabase
                .from("connections")
                .insert(connectionsData);

              if (connectionsError) throw connectionsError;
            }

            // Gerar thumbnail
            try {
              const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
              if (viewportElement) {
                await generateBoardThumbnail(
                  boardData.id,
                  nodes,
                  async () => {
                    return await toPng(viewportElement, {
                      backgroundColor: '#ffffff',
                      quality: 0.8,
                    });
                  }
                );
              }
            } catch (thumbError) {
              console.error('Failed to generate thumbnail:', thumbError);
            }

            toast.success("Canvas salvo com sucesso!");
            
            // Redirecionar para o board salvo
            setTimeout(() => {
              navigate(`/canvas/${boardData.id}`);
            }, 1000);
          } catch (error) {
            console.error("Erro ao salvar canvas:", error);
            toast.error("Erro ao salvar canvas");
          }
        }}
      />
    </div>
  );
};

const FreeCanvas = () => (
  <ReactFlowProvider>
    <FreeCanvasInner />
  </ReactFlowProvider>
);

export default FreeCanvas;