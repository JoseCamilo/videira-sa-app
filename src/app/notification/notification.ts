import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from './notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
      @for (notification of notifications; track notification.id) {
        <div
          [ngClass]="{
            'bg-green-300 text-white': notification.type === 'success',
            'bg-yellow-300 text-white': notification.type === 'warning',
            'bg-red-300 text-white': notification.type === 'error'
          }"
          class="px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in-right pointer-events-auto">
          
          <span class="material-icons flex-shrink-0 text-gray-700">
            {{ getIcon(notification.type) }}
          </span>
          
          <p class="flex-1 text-sm font-medium text-gray-700">{{ notification.message }}</p>
          
          <button
            (click)="remove(notification.id)"
            class="flex-shrink-0 hover:opacity-80 transition">
            <span class="material-icons text-lg text-gray-700">close</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NotificationComponent implements OnInit {
  private notificationService = inject(NotificationService);
  notifications: Notification[] = [];

  ngOnInit() {
    this.notificationService.notifications.subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  getIcon(type: 'success' | 'warning' | 'error'): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  }

  remove(id: string) {
    this.notificationService.remove(id);
  }
}
