//API DE IMAGENES DE LA NASA
const NASA_IMAGE_API = "https://images-api.nasa.gov/search";
const NASA_KEY = process.env.NASA_API_KEY;

export interface NasaImage {
  title: string;
  url: string;
  description: string;
}
//Futura prueba de idioma
export const PLANET_GALLERY: Record<string, string> = {
  "Júpiter": "https://images-assets.nasa.gov/image/PIA01369/PIA01369~orig.jpg",
  "Jupiter": "https://images-assets.nasa.gov/image/PIA01369/PIA01369~orig.jpg",
  "Marte": "https://images-assets.nasa.gov/image/PIA02096/PIA02096~orig.jpg",
  "Mars": "https://images-assets.nasa.gov/image/PIA02096/PIA02096~orig.jpg",
  "Mercurio": "https://images-assets.nasa.gov/image/PIA11410/PIA11410~orig.jpg",
  "Mercury": "https://images-assets.nasa.gov/image/PIA11410/PIA11410~orig.jpg",
  "Neptuno": "https://images-assets.nasa.gov/image/PIA00063/PIA00063~orig.jpg",
  "Neptune": "https://images-assets.nasa.gov/image/PIA00063/PIA00063~orig.jpg",
  "Saturno": "https://images-assets.nasa.gov/image/PIA01956/PIA01956~orig.jpg",
  "Saturn": "https://images-assets.nasa.gov/image/PIA01956/PIA01956~orig.jpg",
  "Tierra": "https://images-assets.nasa.gov/image/iss043e010521/iss043e010521~orig.jpg",
  "Earth": "https://images-assets.nasa.gov/image/iss043e010521/iss043e010521~orig.jpg",
  "Urano": "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000537/GSFC_20171208_Archive_e000537~orig.jpg",
  "Uranus": "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000537/GSFC_20171208_Archive_e000537~orig.jpg",
  "Venus": "https://images-assets.nasa.gov/image/PIA00272/PIA00272~orig.jpg",
  "Luna": "https://images-assets.nasa.gov/image/AS11-44-6551/AS11-44-6551~medium.jpg",
  "Moon": "https://images-assets.nasa.gov/image/AS11-44-6551/AS11-44-6551~medium.jpg",
  "Training": "https://images-assets.nasa.gov/image/iss038e042112/iss038e042112~orig.jpg",
  "Pasaporte": "https://images-assets.nasa.gov/image/NHQ202604280023/NHQ202604280023~orig.jpg",
  "Passport": "https://images-assets.nasa.gov/image/NHQ202604280023/NHQ202604280023~orig.jpg",
};

export async function getNasaImages(query: string, limit = 6): Promise<NasaImage[]> {
  const normalizedQuery = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
  if (PLANET_GALLERY[normalizedQuery]) {
    return [{
      title: query,
      url: PLANET_GALLERY[normalizedQuery],
      description: `Vista oficial de ${query} seleccionada para Iris Aerospace.`
    }];
  }

  try {
    const res = await fetch(`${NASA_IMAGE_API}?q=${encodeURIComponent(query + " planet")}&media_type=image`, {
      next: { revalidate: 86400 },
    });
    const data = await res.json();
    const items = data.collection?.items?.slice(0, limit) ?? [];

    return items
      .filter((item: any) => item.links?.[0]?.href)
      .map((item: any) => ({
        title: item.data[0].title,
        url: item.links[0].href,
        description: item.data[0].description?.slice(0, 200) ?? "",
      }));
  } catch {
    return [];
  }
}

export async function getApod(): Promise<{ url: string; title: string; explanation: string } | null> {
  try {
    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY || 'DEMO_KEY'}`,
      { next: { revalidate: 86400 } }
    );
    return res.json();
  } catch {
    return null;
  }
}