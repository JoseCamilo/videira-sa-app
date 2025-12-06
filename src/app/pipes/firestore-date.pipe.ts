import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'firestoreDate',
  standalone: true
})
export class FirestoreDatePipe implements PipeTransform {
  transform(value: any, format: string = 'dd/MM/yyyy HH:mm'): string {
    if (!value) {
      return '';
    }

    let date: Date;

    // Verifica se é um Timestamp do Firestore
    if (value instanceof Timestamp) {
      date = value.toDate();
    } else if (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) {
      // Se for um objeto com seconds e nanoseconds (Firestore Timestamp serializado)
      date = new Date(value.seconds * 1000);
    } else if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'number') {
      date = new Date(value);
    } else if (typeof value === 'string') {
      date = new Date(value);
    } else {
      return '';
    }

    // Formata a data manualmente
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    if (format === 'dd/MM/yyyy HH:mm') {
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } else if (format === 'dd/MM/yyyy') {
      return `${day}/${month}/${year}`;
    } else if (format === 'HH:mm') {
      return `${hours}:${minutes}`;
    } else if (format === 'dd/MM/yyyy HH:mm:ss') {
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}
