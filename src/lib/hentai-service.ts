
'use client';

/**
 * @fileOverview Serviço de Integração HentaiOcean API v1.0
 */

export interface HentaiInfo {
  id: number;
  urlname: string;
  videoname: string;
  description: string;
  releasedate: string;
  uploaddate: string;
  coverimg: string;
  genres: string[];
}

export async function fetchHentaiData(slug: string): Promise<HentaiInfo | null> {
  try {
    const response = await fetch(`https://hentaiocean.com/api?action=hentai&slug=${slug}`);
    const data = await response.json();
    if (data.info && data.info.length > 0) {
      return {
        ...data.info[0],
        genres: data.genres.map((g: any) => g.genre)
      };
    }
    return null;
  } catch (error) {
    console.error("Erro na API Hentai:", error);
    return null;
  }
}

export function getEmbedUrl(slug: string): string {
  return `https://hentaiocean.com/embed/${slug}?la=1`;
}

export function getCoverUrl(filename: string): string {
  return `https://hentaiocean.com/assets/cover/${filename}`;
}

export function getThumbnailUrl(slug: string): string {
  return `https://hentaiocean.com/thumbnail/${slug}.webp`;
}
