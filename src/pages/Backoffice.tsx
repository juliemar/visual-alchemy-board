import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  boardCount: number;
  plan: string;
  created_at: string;
}

const Backoffice = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        navigate("/");
        return;
      }

      // Check if user has admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        toast.error("Access denied. Only administrators can access this area.");
        navigate("/boards");
        return;
      }

      setIsAdmin(true);
      loadUsers();
    } catch (error) {
      toast.error("Error verifying permissions");
      navigate("/boards");
    }
  };

  const loadUsers = async () => {
    try {
      // Get all users from auth
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Get subscriptions
      const { data: subscriptions } = await supabase
        .from("subscriptions")
        .select("*");

      // Get board counts
      const { data: boards } = await supabase
        .from("boards")
        .select("user_id");

      const boardCounts: Record<string, number> = {};
      boards?.forEach((board) => {
        boardCounts[board.user_id] = (boardCounts[board.user_id] || 0) + 1;
      });

      const subscriptionsMap: Record<string, any> = {};
      subscriptions?.forEach((sub) => {
        subscriptionsMap[sub.user_id] = sub;
      });

      const usersData: User[] = authUsers.map((user) => ({
        id: user.id,
        email: user.email || "",
        boardCount: boardCounts[user.id] || 0,
        plan: subscriptionsMap[user.id]?.plan || "free",
        created_at: user.created_at,
      }));

      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas-bg">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-canvas-bg p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/boards")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Backoffice</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Boards</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.boardCount}</TableCell>
                    <TableCell>
                      <Badge variant={user.plan === "pro" ? "default" : "secondary"}>
                        {user.plan === "pro" ? "Premium" : "Freemium"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString("en-US")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Backoffice;
