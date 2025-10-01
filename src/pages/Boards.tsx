import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, LogOut, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeModal } from "@/components/upgrade/UpgradeModal";

interface Board {
  id: string;
  name: string;
  created_at: string;
  thumbnail_url?: string | null;
}

const Boards = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [editBoardName, setEditBoardName] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingBoard, setDeletingBoard] = useState<Board | null>(null);
  
  const { subscription, checkBoardLimit, upgradeToPro } = useSubscription();

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    const { data, error } = await supabase
      .from("boards")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load boards");
      return;
    }

    setBoards(data || []);
  };

  const createBoard = async () => {
    if (!newBoardName.trim()) {
      toast.error("Please enter a board name");
      return;
    }

    // Check board limit
    const limitCheck = await checkBoardLimit();
    if (!limitCheck.canCreate) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      toast.error("You must be logged in");
      return;
    }

    const { data, error } = await supabase
      .from("boards")
      .insert({
        name: newBoardName,
        user_id: userData.user.id,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast.error("Failed to create board");
      return;
    }

    toast.success("Board created!");
    setNewBoardName("");
    setIsDialogOpen(false);
    setBoards([data, ...boards]);
  };

  const handleEditBoard = (board: Board) => {
    setEditingBoard(board);
    setEditBoardName(board.name);
    setIsEditDialogOpen(true);
  };

  const updateBoardName = async () => {
    if (!editBoardName.trim()) {
      toast.error("Please enter a board name");
      return;
    }

    if (!editingBoard) return;

    setLoading(true);

    const { error } = await supabase
      .from("boards")
      .update({ name: editBoardName })
      .eq("id", editingBoard.id);

    setLoading(false);

    if (error) {
      toast.error("Failed to update board");
      return;
    }

    toast.success("Board updated!");
    setBoards(boards.map(b => b.id === editingBoard.id ? { ...b, name: editBoardName } : b));
    setIsEditDialogOpen(false);
    setEditingBoard(null);
    setEditBoardName("");
  };

  const handleDeleteBoard = (board: Board) => {
    setDeletingBoard(board);
  };

  const confirmDeleteBoard = async () => {
    if (!deletingBoard) return;

    const { error } = await supabase
      .from("boards")
      .delete()
      .eq("id", deletingBoard.id);

    if (error) {
      toast.error("Failed to delete board");
      return;
    }

    toast.success("Board deleted");
    setBoards(boards.filter(b => b.id !== deletingBoard.id));
    setDeletingBoard(null);
  };

  const handleSignOut = async () => {
    try {
      // Try to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      // Even if there's an error (like session_not_found), we should still:
      // 1. Clear local storage manually
      // 2. Navigate away
      // This ensures the user is logged out on the frontend regardless of backend state
      
      if (error && error.message !== "Session from session_id claim in JWT does not exist") {
        console.error("Sign out error:", error);
        toast.error("Error signing out, but clearing local session");
      } else {
        toast.success("Signed out successfully");
      }
      
      // Force clear any remaining auth data
      localStorage.removeItem('supabase.auth.token');
      
      // Navigate to home and trigger full auth state refresh
      navigate("/", { replace: true });
      
      // Force reload to clear any cached state
      window.location.reload();
    } catch (err) {
      console.error("Unexpected error during sign out:", err);
      toast.error("Error signing out");
      // Still try to navigate away and clear state
      localStorage.removeItem('supabase.auth.token');
      navigate("/", { replace: true });
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-canvas-bg p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Your Boards</h1>
            <p className="text-muted-foreground">
              Create and manage your image generation boards
            </p>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center h-48">
                  <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Create New Board</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Board</DialogTitle>
                <DialogDescription>
                  Give your board a name to get started
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="boardName">Board Name</Label>
                  <Input
                    id="boardName"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="My Awesome Board"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") createBoard();
                    }}
                  />
                </div>
                <Button onClick={createBoard} disabled={loading} className="w-full">
                  Create Board
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {boards.map((board) => (
            <Card
              key={board.id}
              className="cursor-pointer hover:shadow-lg transition-shadow group relative overflow-hidden"
            >
              <div onClick={() => navigate(`/canvas/${board.id}`)}>
                {board.thumbnail_url && (
                  <div className="w-full h-48 overflow-hidden bg-muted flex items-center justify-center">
                    <img 
                      src={board.thumbnail_url} 
                      alt={board.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Hide image if it fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                      loading="lazy"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-2">{board.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(board.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditBoard(board);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBoard(board);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        onUpgrade={() => {
          upgradeToPro();
          setShowUpgradeModal(false);
        }}
        type="board"
        limit={subscription?.plan === "pro" ? 999 : 2}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Board</DialogTitle>
            <DialogDescription>
              Update the name of your board
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editBoardName">Board Name</Label>
              <Input
                id="editBoardName"
                value={editBoardName}
                onChange={(e) => setEditBoardName(e.target.value)}
                placeholder="My Awesome Board"
                onKeyDown={(e) => {
                  if (e.key === "Enter") updateBoardName();
                }}
              />
            </div>
            <Button onClick={updateBoardName} disabled={loading} className="w-full">
              Update Board
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingBoard} onOpenChange={(open) => !open && setDeletingBoard(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the board "{deletingBoard?.name}" and all its content. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteBoard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Boards;
