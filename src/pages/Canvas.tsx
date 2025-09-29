import { useCallback, useEffect, useState } from "react";
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploadNode } from "@/components/canvas/ImageUploadNode";
import { PromptNode } from "@/components/canvas/PromptNode";
import { GeneratedImageNode } from "@/components/canvas/GeneratedImageNode";
import { CanvasToolbar } from "@/components/canvas/CanvasToolbar";
import { NodeCreationMenu } from "@/components/canvas/NodeCreationMenu";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const nodeTypes = {
  image_upload: ImageUploadNode,
  prompt: PromptNode,
  generated_image: GeneratedImageNode,
};

const CanvasInner = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [boardName, setBoardName] = useState("");
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const loadBoard = async () => {
    if (!boardId) return;

    const { data: boardData, error: boardError } = await supabase
      .from("boards")
      .select("*")
      .eq("id", boardId)
      .single();

    if (boardError || !boardData) {
      toast.error("Failed to load board");
      navigate("/boards");
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
          id: "initial-upload-1",
          type: "image_upload",
          position: { x: 100, y: 150 },
          data: {},
        },
        {
          id: "initial-upload-2",
          type: "image_upload",
          position: { x: 100, y: 350 },
          data: {},
        },
        {
          id: "initial-prompt",
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
          id: "conn-1",
          board_id: boardId,
          source_node_id: "initial-upload-1",
          target_node_id: "initial-prompt",
        },
        {
          id: "conn-2",
          board_id: boardId,
          source_node_id: "initial-upload-2",
          target_node_id: "initial-prompt",
        },
      ];

      for (const conn of initialConnections) {
        await supabase.from("connections").insert(conn);
      }

      setNodes(initialNodes);
      setEdges([
        { id: "conn-1", source: "initial-upload-1", target: "initial-prompt" },
        { id: "conn-2", source: "initial-upload-2", target: "initial-prompt" },
      ]);

      toast.success("Board iniciado com nós de exemplo!");
    }
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

  const onConnect = useCallback(
    async (connection: Connection) => {
      if (!boardId) return;

      const newEdge = addEdge(connection, edges);
      setEdges(newEdge);

      await supabase.from("connections").insert({
        board_id: boardId,
        source_node_id: connection.source!,
        target_node_id: connection.target!,
      });
    },
    [boardId, edges]
  );

  const handleCreateNode = async (type: "image_upload" | "prompt") => {
    if (!boardId) return;

    const newNode: Node = {
      id: `${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {},
    };

    setNodes((nds) => [...nds, newNode]);
    await saveNode(newNode);
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
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async (nodeId: string, prompt: string) => {
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

    const resultNodeId = `result-${Date.now()}`;
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
    setEdges((eds) => [
      ...eds,
      {
        id: `${nodeId}-${resultNodeId}`,
        source: nodeId,
        target: resultNodeId,
      },
    ]);

    await saveNode(resultNode);

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
