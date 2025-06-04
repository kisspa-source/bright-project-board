import { supabase } from '../supabase';
import { Tables, Insertable, Updateable } from '../../types/supabase';

export type Profile = Tables<'profiles'>;
export type NewProfile = Insertable<'profiles'>;
export type UpdateProfile = Updateable<'profiles'>;

export const getProfile = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const upsertProfile = async (profile: NewProfile | UpdateProfile) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
};
