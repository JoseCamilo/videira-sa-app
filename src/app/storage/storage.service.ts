import { inject, Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, uploadString } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class StorageService {
  storage = inject(Storage);

  async uploadFoto(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }
  
  async uploadString(base64: string, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadString(storageRef, base64, 'data_url');
    return getDownloadURL(storageRef);
  }

  async uploadTicket(base64: string, path: string): Promise<string> {
    const storageRef = ref(this.storage, `tickets/${path}`);
    await uploadString(storageRef, base64, 'data_url');
    return getDownloadURL(storageRef);
  }
}