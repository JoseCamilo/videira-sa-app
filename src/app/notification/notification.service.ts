import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  public notifications: Observable<Notification[]> = this.notifications$.asObservable();
  private notificationId = 0;
  private readonly DEFAULT_DURATION = 7000;

  show(message: string, type: 'success' | 'warning' | 'error' = 'success', duration: number = this.DEFAULT_DURATION) {
    const id = `notification-${this.notificationId++}`;
    const notification: Notification = {
      id,
      message,
      type,
      duration
    };

    const currentNotifications = this.notifications$.value;
    this.notifications$.next([...currentNotifications, notification]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, duration: number = this.DEFAULT_DURATION) {
    this.show(message, 'success', duration);
  }

  warning(message: string, duration: number = this.DEFAULT_DURATION) {
    this.show(message, 'warning', duration);
  }

  error(message: string, duration: number = this.DEFAULT_DURATION) {
    this.show(message, 'error', duration);
  }

  remove(id: string) {
    const currentNotifications = this.notifications$.value;
    this.notifications$.next(currentNotifications.filter(n => n.id !== id));
  }

  clear() {
    this.notifications$.next([]);
  }
}
