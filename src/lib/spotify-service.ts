'use client';

/**
 * @fileOverview Serviço de Integração Spotify Web API v2.0
 * Implementa Fluxo Authorization Code com PKCE e suporte a Client ID dinâmico.
 */

const DEFAULT_CLIENT_ID = '85c63567d13047a0b59b57743d83d1c1';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/settings` : '';

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  uri: string;
}

function getClientId() {
  if (typeof window === 'undefined') return DEFAULT_CLIENT_ID;
  return localStorage.getItem('spotify_client_id') || DEFAULT_CLIENT_ID;
}

export async function loginWithSpotify() {
  const clientId = getClientId();
  const verifier = generateRandomString(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem('spotify_verifier', verifier);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    scope: 'user-read-private user-read-email user-modify-playback-state user-read-playback-state'
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  
  // Abre em nova aba para evitar SecurityError de navegação em frame/workstation
  window.open(authUrl, '_blank');
}

export async function handleSpotifyCallback(code: string) {
  const clientId = getClientId();
  const verifier = localStorage.getItem('spotify_verifier');
  if (!verifier) return false;

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier
  });

  try {
    const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const data = await result.json();
    if (data.access_token) {
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_refresh_token', data.refresh_token);
      return true;
    }
    return false;
  } catch (e) {
    console.error("Spotify Auth Error:", e);
    return false;
  }
}

export async function searchSpotify(query: string): Promise<SpotifyTrack[]> {
  const token = localStorage.getItem('spotify_access_token');
  if (!token) return [];

  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 401) {
      // Token expirado, deveria dar refresh, mas por agora retornamos vazio
      return [];
    }

    const data = await response.json();
    if (!data.tracks) return [];
    
    return data.tracks.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      artist: item.artists[0].name,
      album: item.album.name,
      image: item.album.images[0]?.url || '',
      uri: item.uri
    }));
  } catch (e) {
    return [];
  }
}

function generateRandomString(length: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
