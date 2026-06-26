import { createClient } from '@supabase/supabase-js';

const FARM_STATE_ID = 'main';
let supabaseClient = null;

const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
};

export const isSupabaseConfigured = () => {
  return Boolean(getSupabaseConfig());
};

const getSupabaseClient = () => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  supabaseClient = createClient(config.url, config.anonKey);
  return supabaseClient;
};

const normalizeRemoteState = (row) => {
  if (!row) return null;

  return {
    farmers: Array.isArray(row.farmers) ? row.farmers : [],
    nextId: typeof row.next_id === 'number' ? row.next_id : 1,
    updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : 0
  };
};

export const loadRemoteFarmState = async () => {
  const client = getSupabaseClient();
  if (!client) return null;

  const { data, error } = await client
    .from('farm_state')
    .select('farmers,next_id,updated_at')
    .eq('id', FARM_STATE_ID)
    .maybeSingle();

  if (error) {
    console.warn('Failed to load remote farm state:', error);
    return null;
  }

  return normalizeRemoteState(data);
};

export const saveRemoteFarmState = async ({ farmers, nextId, updatedAt }) => {
  const client = getSupabaseClient();
  if (!client) return false;

  const payload = {
    id: FARM_STATE_ID,
    farmers: Array.isArray(farmers) ? farmers : [],
    next_id: typeof nextId === 'number' ? nextId : 1,
    updated_at: new Date(updatedAt || Date.now()).toISOString()
  };

  const { error } = await client
    .from('farm_state')
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    console.warn('Failed to save remote farm state:', error);
    return false;
  }

  return true;
};

export const subscribeToRemoteFarmState = (onUpdate) => {
  const client = getSupabaseClient();
  if (!client) return null;

  const channel = client
    .channel('farm_state_updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'farm_state',
        filter: `id=eq.${FARM_STATE_ID}`
      },
      payload => {
        onUpdate(normalizeRemoteState(payload.new));
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
};
