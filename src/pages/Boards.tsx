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
import { Plus, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeModal } from "@/components/upgrade/UpgradeModal";

interface Board {
  id: string;
  name: string;
  created_at: string;
}

const Boards = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
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
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/canvas/${board.id}`)}
            >
              <CardHeader>
                <CardTitle className="line-clamp-2">{board.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(board.created_at).toLocaleDateString()}
                </p>
              </CardContent>
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
    </div>
  );
};

export default Boards;
