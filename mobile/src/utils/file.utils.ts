/**
 * Utilitaires de gestion de fichiers pour React Native
 */

// Utiliser l'API legacy d'Expo FileSystem (SDK 54+)
import * as FileSystem from 'expo-file-system/legacy';

/**
 * Convertit une data URI base64 en fichier temporaire
 *
 * @param dataUri - Data URI au format "data:image/png;base64,..."
 * @param filename - Nom du fichier de destination
 * @returns Objet avec l'URI du fichier temporaire
 *
 * @example
 * const result = await base64ToFile('data:image/png;base64,iVBORw0...', 'signature.png');
 * console.log(result.uri); // file:///path/to/temp/signature_1234567890.png
 */
export async function base64ToFile(
  dataUri: string,
  filename: string
): Promise<{ uri: string; name: string; type: string }> {
  try {
    // Extraire le type MIME de la data URI
    const mimeMatch = dataUri.match(/data:(.*?);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

    // Enlever le préfixe "data:image/png;base64," pour avoir seulement le base64
    const base64Data = dataUri.replace(/^data:.*?;base64,/, '');

    // Créer un nom de fichier unique avec timestamp
    const timestamp = Date.now();
    const extension = filename.split('.').pop() || 'png';
    const uniqueFilename = `${filename.replace(/\.[^/.]+$/, '')}_${timestamp}.${extension}`;

    // Chemin du fichier temporaire
    const fileUri = `${FileSystem.cacheDirectory}${uniqueFilename}`;

    // Écrire le fichier base64 dans le cache
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return {
      uri: fileUri,
      name: uniqueFilename,
      type: mimeType,
    };
  } catch (error) {
    console.error('Error converting base64 to file:', error);
    throw new Error('Impossible de convertir le fichier base64');
  }
}

/**
 * Supprime un fichier temporaire du cache
 *
 * @param fileUri - URI du fichier à supprimer
 *
 * @example
 * await deleteTempFile('file:///path/to/temp/signature_1234567890.png');
 */
export async function deleteTempFile(fileUri: string): Promise<void> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
    }
  } catch (error) {
    console.error('Error deleting temp file:', error);
    // Ne pas throw - la suppression d'un fichier temp n'est pas critique
  }
}

/**
 * Obtient la taille d'un fichier en bytes
 *
 * @param fileUri - URI du fichier
 * @returns Taille en bytes ou 0 si le fichier n'existe pas
 */
export async function getFileSize(fileUri: string): Promise<number> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    return fileInfo.exists && 'size' in fileInfo ? fileInfo.size : 0;
  } catch (error) {
    console.error('Error getting file size:', error);
    return 0;
  }
}
