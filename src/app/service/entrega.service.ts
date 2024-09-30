import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Entrega } from '../models/entrega';

@Injectable({
  providedIn: 'root'
})
export class EntregaService {
  private urlEntrega: string = `https://app.whatsme.com.br//exped/api/entrega/`;
  private urlEntregaToken: string = `https://app.whatsme.com.br//exped/api/entregatoken/`;
  private secretKey: string = '.eJyrVkrOK8hSslIyNjAzUNJRSs0rKUpNT1SyMtRRykwBihsYGBgCxQuKUssyixPzgSLhqSk6CkZmCl6lOQpGBkbGCgYGVmCk4O4bAlRaXJJYUlqsZGWgo1SWmpcCMqsWAKfxG-w.1mt5gcdDK9AuKgNNvXHVMtd7jeI';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.secretKey}`
    });
    return headers;
  }

  getEntregas(){
    const headers = this.getHeaders();
    return this.http.get<Entrega[]>(this.urlEntrega, { headers });
  }

  createEntrega(payLoad: Entrega){
    const headers = this.getHeaders();
    return this.http.post<Entrega>(this.urlEntrega, payLoad, { headers });
  }

  getByIdEntrega(id: number){
    const headers = this.getHeaders();
    return this.http.get<Entrega>(`${this.urlEntrega}${id}`, { headers });
  }

  updateEntrega(payLoad: Entrega){
    const headers = this.getHeaders();
    return this.http.put(`${this.urlEntrega}${payLoad.id}`, payLoad, { headers });
  }

  getByTokenEntrega(token: string | null){
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.urlEntregaToken}${token}`, { headers });
  }
}
