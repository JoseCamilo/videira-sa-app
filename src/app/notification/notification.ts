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
            'border-l-4 border-green-600': notification.type === 'success',
            'border-l-4 border-yellow-600': notification.type === 'warning',
            'border-l-4 border-red-600': notification.type === 'error',
            'bg-green-50': notification.type === 'success',
            'bg-yellow-50': notification.type === 'warning',
            'bg-red-50': notification.type === 'error'
          }"
          class="rounded-xl shadow-lg flex flex-col overflow-hidden animate-slide-in-right pointer-events-auto border border-gray-300">
          
          <div class="px-5 py-4 flex items-center gap-3">
            <span 
              [ngClass]="{
                'text-green-600': notification.type === 'success',
                'text-yellow-600': notification.type === 'warning',
                'text-red-600': notification.type === 'error'
              }"
              class="material-icons flex-shrink-0 text-xl">
              {{ getIcon(notification.type) }}
            </span>
            
            <p 
              [ngClass]="{
                'text-green-900': notification.type === 'success',
                'text-yellow-900': notification.type === 'warning',
                'text-red-900': notification.type === 'error'
              }"
              class="flex-1 text-sm font-medium">{{ notification.message }}</p>
            
            <button
              (click)="remove(notification.id)"
              class="flex-shrink-0 hover:opacity-60 transition">
              <span 
                [ngClass]="{
                  'text-green-600': notification.type === 'success',
                  'text-yellow-600': notification.type === 'warning',
                  'text-red-600': notification.type === 'error'
                }"
                class="material-icons text-lg">close</span>
            </button>
          </div>

          <!-- Barra de progresso -->
          <div class="h-1.5 bg-gray-200 overflow-hidden">
            <div
              [ngClass]="{
                'bg-green-600': notification.type === 'success',
                'bg-yellow-600': notification.type === 'warning',
                'bg-red-600': notification.type === 'error'
              }"
              class="h-full w-full progress-bar"
              [style.--progress-duration]="(notification.duration || 5000) / 1000 + 's'">
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    @keyframes slide-in-right {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes progress-bar {
      0% {
        width: 100%;
        opacity: 1;
      }
      100% {
        width: 0%;
        opacity: 1;
      }
    }

    :global(.animate-slide-in-right) {
      animation: slide-in-right 0.3s ease-out !important;
    }

    .progress-bar {
      animation: progress-bar var(--progress-duration, 5s) linear forwards;
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
