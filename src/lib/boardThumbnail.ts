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
    
    if (!dataUrl) {
      console.error('No dataUrl generated');
      return null;
    }
    
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // Upload to storage with PNG format (better quality for canvas screenshots)
    const fileName = `${user.id}/${boardId}.png`;
    const { error: uploadError } = await supabase.storage
      .from('board-thumbnails')
      .upload(fileName, blob, {
        upsert: true,
        contentType: 'image/png',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL with cache busting
    const { data: { publicUrl } } = supabase.storage
      .from('board-thumbnails')
      .getPublicUrl(fileName);

    // Add timestamp to bust cache
    const urlWithCache = `${publicUrl}?t=${Date.now()}`;

    // Update board with thumbnail URL
    const { error: updateError } = await supabase
      .from('boards')
      .update({ thumbnail_url: urlWithCache })
      .eq('id', boardId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    console.log('Thumbnail generated successfully:', urlWithCache);
    return urlWithCache;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
};
