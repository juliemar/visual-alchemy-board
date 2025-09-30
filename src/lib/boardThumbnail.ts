import { supabase } from "@/integrations/supabase/client";
import { getNodesBounds, getViewportForBounds } from "@xyflow/react";
import type { Node } from "@xyflow/react";

export const generateBoardThumbnail = async (
  boardId: string,
  nodes: Node[],
  toPng?: () => Promise<string>
): Promise<string | null> => {
  try {
    if (!toPng || nodes.length === 0) {
      console.log('No thumbnail function or nodes available');
      return null;
    }

    // Generate PNG from React Flow
    const dataUrl = await toPng();
    
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // Upload to storage
    const fileName = `${user.id}/${boardId}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('board-thumbnails')
      .upload(fileName, blob, {
        upsert: true,
        contentType: 'image/jpeg',
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('board-thumbnails')
      .getPublicUrl(fileName);

    // Update board with thumbnail URL
    const { error: updateError } = await supabase
      .from('boards')
      .update({ thumbnail_url: publicUrl })
      .eq('id', boardId);

    if (updateError) throw updateError;

    console.log('Thumbnail generated successfully');
    return publicUrl;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
};
