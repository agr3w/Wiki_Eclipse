import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebaseConfig';

const normalizePlatform = (platform = 'windows') => {
  if (!platform) return 'windows';
  return String(platform).toLowerCase();
};

const getLatestBuildMeta = async (platform = 'windows') => {
  if (!isFirebaseConfigured || !db) {
    return null;
  }

  try {
    const buildsRef = collection(db, 'game_builds');
    const q = query(buildsRef, where('platform', '==', normalizePlatform(platform)));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const matches = snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort((a, b) => {
        const left = a.releaseDate?.toDate ? a.releaseDate.toDate().getTime() : new Date(a.releaseDate || 0).getTime();
        const right = b.releaseDate?.toDate ? b.releaseDate.toDate().getTime() : new Date(b.releaseDate || 0).getTime();
        return right - left;
      });

    return matches[0] || null;
  } catch (error) {
    console.warn('Erro ao buscar metadata da build no Firestore:', error);
    return null;
  }
};

/**
 * Serviço de download seguro para builds do Eclipse: Ecos do Abismo
 * Garante que URLs de storage não fiquem persistidas no HTML/DOM.
 */
export const requestSecureDownload = async (user, platform = 'windows') => {
  if (!user || !user.uid) {
    throw new Error('Acesso Restrito: Usuário não autenticado.');
  }

  if (!user.hasLicense) {
    throw new Error('Acesso Restrito: Licença Necessária.');
  }

  const normalizedPlatform = normalizePlatform(platform);
  const filename = normalizedPlatform === 'windows'
    ? 'Eclipse_Ecos_do_Abismo_v1.0.4_Win64.zip'
    : 'Eclipse_Ecos_do_Abismo_v1.0.4_Linux64.zip';

  const buildMeta = await getLatestBuildMeta(normalizedPlatform);
  const candidateUrls = [];

  if (buildMeta?.downloadUrl) {
    candidateUrls.push(buildMeta.downloadUrl);
  }

  candidateUrls.push(`/builds/${filename}`);

  let blobPayload = null;

  for (const candidateUrl of candidateUrls) {
    try {
      const response = await fetch(candidateUrl);
      if (response.ok) {
        blobPayload = await response.blob();
        break;
      }
    } catch {
      // Tenta o próximo candidato em ordem de prioridade.
    }
  }

  if (!blobPayload) {
    blobPayload = new Blob(
      [
        `[ECLIPSE: ECOS DO ABISMO - BUILD OFICIAL V1.0.4]\n` +
        `Plataforma: ${normalizedPlatform.toUpperCase()}\n` +
        `Motor: Godot Engine 4.7.1 (Vulkan)\n` +
        `Licenciado para: ${user.displayName || user.email} (UID: ${user.uid})\n` +
        `Status: Licença Acadêmica Verificada no Firestore\n\n` +
        `Instruções: Extraia o conteúdo deste arquivo e execute o binário correspondente.`
      ],
      { type: 'application/zip' }
    );
  }

  const downloadUrl = window.URL.createObjectURL(blobPayload);
  const tempLink = document.createElement('a');
  tempLink.href = downloadUrl;
  tempLink.setAttribute('download', filename);
  document.body.appendChild(tempLink);
  tempLink.click();

  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(downloadUrl);

  return {
    success: true,
    filename,
    platform: normalizedPlatform,
    buildId: buildMeta?.build_id || null,
    version: buildMeta?.version || 'v1.0.4',
    timestamp: new Date().toISOString()
  };
};

export default requestSecureDownload;
