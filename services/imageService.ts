// services/imageService.ts
import { getGridFS } from '@/lib/gridfs';
import { GridFSBucket } from 'mongodb';

let cachedGridFS: GridFSBucket | null = null;

export async function saveUserAvatar(userId: string, file: File): Promise<string> {
    const gridFS = await getGridFS();
  
    // 1. Busca e remove TODOS os arquivos existentes para este usuário
    const existingFiles = await gridFS.find({ 'metadata.userId': userId }).toArray();
    
    // Remove cada arquivo existente de forma sequencial e segura
    for (const existingFile of existingFiles) {
      try {
        await new Promise((resolve, reject) => {
          gridFS.delete(existingFile._id)
            .then(() => {
              console.log(`Arquivo antigo ${existingFile._id} removido com sucesso`);
              resolve(true);
            })
            .catch((err: any) => {
              console.error(`Erro ao deletar arquivo ${existingFile._id}:`, err);
              reject(err);
            });
        });
      } catch (deleteError) {
        console.error('Falha ao remover arquivo existente:', deleteError);
        throw new Error('Não foi possível remover a imagem antiga');
      }
    }
  
    // 2. Faz upload do novo arquivo
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadStream = gridFS.openUploadStream(file.name, {
      contentType: file.type,
      metadata: { 
        userId: userId,
        uploadedAt: new Date()
      }
    });
  
    return new Promise((resolve, reject) => {
      uploadStream.write(buffer);
      uploadStream.end();
  
      uploadStream.on('finish', () => {
        console.log(`Novo arquivo salvo com ID: ${uploadStream.id}`);
        resolve(`/api/imagens/${userId}`);
      });
  
      uploadStream.on('error', (error) => {
        console.error('Erro no upload:', error);
        reject(new Error('Falha ao salvar a nova imagem'));
      });
    });
  }

export async function getUserAvatar(userId: string) {
    const gridFS = await getGridFS();
    const files = await gridFS.find({ 'metadata.userId': userId })
        .sort({ uploadDate: -1 }) // Pega a mais recente
        .limit(1)
        .toArray();

    if (files.length === 0) return null;

    return files[0];
}

export async function deleteUserAvatar(userId: string) {
    const gridFS = await getGridFS();
    const files = await gridFS.find({ 'metadata.userId': userId }).toArray();

    if (files.length > 0) {
        await Promise.all(files.map(file =>
            gridFS.delete(file._id)
        ));
        return true;
    }
    return false;
}