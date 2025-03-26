// services/imageService.ts
import dbConnect from '@/lib/dbConnect';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';

let cachedGridFS: GridFSBucket | null = null;

export async function getGridFS() {
  if (cachedGridFS) return cachedGridFS;

  await dbConnect();
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error('Database connection is not established.');
  }

  cachedGridFS = new GridFSBucket(db, { bucketName: 'avatars' });
  return cachedGridFS;
}

export async function getUserAvatar(userId: string) {
  try {
    const gridFS = await getGridFS();
    const files = await gridFS.find({ 'metadata.userId': new mongoose.Types.ObjectId(userId) })
      .sort({ uploadDate: -1 })
      .limit(1)
      .toArray();

    if (files.length === 0) return null;

    // Verifica se o arquivo realmente existe
    const chunksExist = await gridFS.find({ files_id: files[0]._id }).hasNext();
    if (!chunksExist) {
      // Remove a referência inválida
      await gridFS.delete(files[0]._id);
      return null;
    }

    return files[0];
  } catch (error) {
    console.error('Error getting user avatar:', error);
    return null;
  }
}