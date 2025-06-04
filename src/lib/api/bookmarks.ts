import { supabase } from '../supabase';
import { Tables, Insertable, Updateable } from '../../types/supabase';

export type Bookmark = Tables<'bookmarks'>;
export type NewBookmark = Insertable<'bookmarks'>;
export type UpdateBookmark = Updateable<'bookmarks'>;

export const createBookmark = async (bookmark: NewBookmark) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .insert(bookmark)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getBookmarksByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateBookmark = async (id: string, bookmark: UpdateBookmark) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .update(bookmark)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteBookmark = async (id: string) => {
  const { error } = await supabase.from('bookmarks').delete().eq('id', id);
  if (error) throw error;
  return true;
};
