import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  http = inject(HttpClient);

  processPayment(paymentData: any): Observable<any> {
    return this.http.post(`${environment.urlBackendAPI}/process_payment`, paymentData);
  }

  getPaymentStatus(paymentId: string): Observable<any> {
    return this.http.get(`${environment.urlBackendAPI}/payment_status/${paymentId}`);
  }
}