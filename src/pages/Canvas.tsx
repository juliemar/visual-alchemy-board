import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeModal } from "@/components/upgrade/UpgradeModal";
import { generateBoardThumbnail } from "@/lib/boardThumbnail";
import { toPng } from "html-to-image";

const nodeTypes = {
  image_upload: ImageUploadNode,
  prompt: PromptNode,
  generated_image: GeneratedImageNode,
};

const CanvasInner = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const reactFlowInstance = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [boardName, setBoardName] = useState("");
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const thumbnailTimeoutRef = useRef<NodeJS.Timeout>();
  const isInitialLoadRef = useRef(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeType, setUpgradeType] = useState<"node" | "board">("node");
  
  const { subscription, checkNodeLimit, upgradeToPro } = useSubscription();

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const loadBoard = async () => {
    if (!boardId) return;

    setIsLoading(true);

    const { data: boardData, error: boardError } = await supabase
      .from("boards")
      .select("*")
      .eq("id", boardId)
      .single();

    if (boardError || !boardData) {
      toast.error("Failed to load board");
      navigate("/boards");
      setIsLoading(false);
      return;
    }

    setBoardName(boardData.name);

    const { data: nodesData } = await supabase
      .from("nodes")
      .select("*")
      .eq("board_id", boardId);

    const { data: connectionsData } = await supabase
      .from("connections")
      .select("*")
      .eq("board_id", boardId);

    if (nodesData && nodesData.length > 0) {
      const loadedNodes: Node[] = nodesData.map((node) => ({
        id: node.id,
        type: node.node_type,
        position: { x: node.position_x, y: node.position_y },
        data: (node.node_data as Record<string, unknown>) || {},
      }));
      setNodes(loadedNodes);

      if (connectionsData) {
        const loadedEdges: Edge[] = connectionsData.map((conn) => ({
          id: conn.id,
          source: conn.source_node_id,
          target: conn.target_node_id,
        }));
        setEdges(loadedEdges);
      }
    } else {
      // Board vazio - criar nós iniciais
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

      // Salvar nós iniciais no banco
      for (const node of initialNodes) {
        await supabase.from("nodes").insert({
          id: node.id,
          board_id: boardId,
          node_type: node.type || 'image_upload',
          node_data: node.data as any,
          position_x: node.position.x,
          position_y: node.position.y,
        });
      }

      // Criar conexões iniciais
      const initialConnections = [
        {
          id: crypto.randomUUID(),
          board_id: boardId,
          source_node_id: initialNodes[0].id,
          target_node_id: initialNodes[2].id,
        },
        {
          id: crypto.randomUUID(),
          board_id: boardId,
          source_node_id: initialNodes[1].id,
          target_node_id: initialNodes[2].id,
        },
      ];

      for (const conn of initialConnections) {
        await supabase.from("connections").insert(conn);
      }

      setNodes(initialNodes);
      setEdges([
        { id: initialConnections[0].id, source: initialNodes[0].id, target: initialNodes[2].id },
        { id: initialConnections[1].id, source: initialNodes[1].id, target: initialNodes[2].id },
      ]);

      toast.success("Board iniciado com nós de exemplo!");
    }
    
    isInitialLoadRef.current = false;
    
    // Small delay to ensure everything is rendered
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const saveNode = async (node: Node) => {
    if (!boardId) return;

    const { error } = await supabase.from("nodes").upsert({
      id: node.id,
      board_id: boardId,
      node_type: node.type || 'image_upload',
      node_data: node.data as any,
      position_x: node.position.x,
      position_y: node.position.y,
    }, {
      onConflict: 'id'
    });

    if (error) {
      console.error('Error saving node:', error);
    }
  };

  // Autosave com debounce
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      if (!boardId || isInitialLoadRef.current) return;
      
      // Salvar todos os nós
      for (const node of nodes) {
        await supabase.from("nodes").upsert({
          id: node.id,
          board_id: boardId,
          node_type: node.type || 'image_upload',
          node_data: node.data as any,
          position_x: node.position.x,
          position_y: node.position.y,
        }, {
          onConflict: 'id'
        });
      }
      
      console.log('Autosaved:', nodes.length, 'nodes');
    }, 1000); // Salva 1 segundo após última mudança
  }, [boardId, nodes]);

  // Generate thumbnail debounced
  const debouncedThumbnail = useCallback(async () => {
    if (thumbnailTimeoutRef.current) {
      clearTimeout(thumbnailTimeoutRef.current);
    }

    thumbnailTimeoutRef.current = setTimeout(async () => {
      if (!boardId || nodes.length === 0) return;
      
      try {
        const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
        if (!viewportElement) {
          console.error('Viewport element not found');
          return;
        }

        await generateBoardThumbnail(
          boardId, 
          nodes,
          async () => {
            return await toPng(viewportElement, {
              backgroundColor: '#ffffff',
              quality: 0.8,
            });
          }
        );
        console.log('Thumbnail generated');
      } catch (error) {
        console.error('Failed to generate thumbnail:', error);
      }
    }, 3000); // Generate thumbnail 3 seconds after last change
  }, [boardId, nodes]);

  // Trigger autosave and thumbnail when nodes change
  useEffect(() => {
    if (!isInitialLoadRef.current) {
      debouncedSave();
      debouncedThumbnail();
    }
  }, [nodes, debouncedSave, debouncedThumbnail]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (thumbnailTimeoutRef.current) {
        clearTimeout(thumbnailTimeoutRef.current);
      }
    };
  }, []);

  // Salvar antes de sair da página
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (nodes.length > 0 && !isInitialLoadRef.current) {
        // Força save síncrono antes de sair
        for (const node of nodes) {
          await supabase.from("nodes").upsert({
            id: node.id,
            board_id: boardId,
            node_type: node.type || 'image_upload',
            node_data: node.data as any,
            position_x: node.position.x,
            position_y: node.position.y,
          }, {
            onConflict: 'id'
          });
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [nodes, boardId]);

  const onConnect = useCallback(
    async (connection: Connection) => {
      if (!boardId) return;

      const connId = crypto.randomUUID();
      const newEdge = { id: connId, source: connection.source!, target: connection.target! };
      setEdges((eds) => [...eds, newEdge]);

      // Salvar conexão no banco
      const { error } = await supabase.from("connections").insert({
        id: connId,
        board_id: boardId,
        source_node_id: connection.source!,
        target_node_id: connection.target!,
      });

      if (!error) {
        toast.success("Conexão criada e salva!");
      }
    },
    [boardId]
  );

  const handleCreateNode = async (type: "image_upload" | "prompt") => {
    if (!boardId) return;

    // Check node limit
    const limitCheck = await checkNodeLimit(boardId);
    if (!limitCheck.canAdd) {
      setUpgradeType("node");
      setShowUpgradeModal(true);
      return;
    }

    const newNode: Node = {
      id: crypto.randomUUID(),
      type,
      position: { x: 200 + Math.random() * 300, y: 200 + Math.random() * 300 },
      data: {},
    };

    setNodes((nds) => [...nds, newNode]);
    
    // Salvar novo nó imediatamente
    await saveNode(newNode);
    toast.success("Nó criado e salvo!");
  };

  const handleImageUpload = async (nodeId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, imageUrl: base64 } }
            : node
        )
      );

      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        await saveNode({ ...node, data: { ...node.data, imageUrl: base64 } });
        toast.success("Imagem carregada e salva!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = async (nodeId: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, imageUrl: undefined } }
          : node
      )
    );

    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      await saveNode({ ...node, data: { ...node.data, imageUrl: undefined } });
      toast.success("Imagem removida!");
    }
  };

  const handleGenerate = async (nodeId: string, prompt: string) => {
    // Check node limit before generating (result node)
    const limitCheck = await checkNodeLimit(boardId!);
    if (!limitCheck.canAdd) {
      setUpgradeType("node");
      setShowUpgradeModal(true);
      return;
    }

    const sourceNodes = edges
      .filter((edge) => edge.target === nodeId)
      .map((edge) => nodes.find((n) => n.id === edge.source))
      .filter((node) => node?.data?.imageUrl);

    if (sourceNodes.length === 0) {
      toast.error("Please connect at least one image to generate");
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
    const newEdge = {
      id: edgeId,
      source: nodeId,
      target: resultNodeId,
    };
    
    setEdges((eds) => [...eds, newEdge]);

    // Salvar nó e conexão
    await saveNode(resultNode);
    await supabase.from("connections").insert({
      id: edgeId,
      board_id: boardId,
      source_node_id: nodeId,
      target_node_id: resultNodeId,
    });

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

      await saveNode({
        ...resultNode,
        data: { imageUrl: data.imageUrl, isGenerating: false },
      });

      toast.success("Image generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate image");
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

  return (
    <div className="h-screen w-screen">
      {isLoading && (
        <div className="absolute inset-0 bg-background z-50 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Loading board...</h2>
            <p className="text-muted-foreground">Please wait while we load your workspace</p>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/boards")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{boardName}</h1>
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
        onMove={(_, viewport) => setZoom(viewport.zoom)}
        fitView
      >
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>

      <NodeCreationMenu onCreateNode={handleCreateNode} />
      
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        onUpgrade={() => {
          upgradeToPro();
          setShowUpgradeModal(false);
        }}
        type={upgradeType}
        limit={subscription?.plan === "pro" ? 30 : 7}
      />
    </div>
  );
};

const Canvas = () => {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
};

export default Canvas;
