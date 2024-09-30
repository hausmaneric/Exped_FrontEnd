import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evento } from '../models/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  urlEvento: string = `https://app.whatsme.com.br//exped/api/evento/`;
  urlEventoEntrega: string = `https://app.whatsme.com.br//exped/api/eventoentrega/`;
  urlEventoVenda: string = `https://app.whatsme.com.br//exped/api/eventovenda/`;
  private secretKey: string = '.eJyrVkrOK8hSslIyNjAzUNJRSs0rKUpNT1SyMtRRykwBihsYGBgCxQuKUssyixPzgSLhqSk6CkZmCl6lOQpGBkbGCgYGVmCk4O4bAlRaXJJYUlqsZGWgo1SWmpcCMqsWAKfxG-w.1mt5gcdDK9AuKgNNvXHVMtd7jeI';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.secretKey}`
    });
    return headers;
  }

  getEventos(){
    const headers = this.getHeaders();
    return this.http.get<Evento[]>(this.urlEvento, { headers });
  }

  createEvento(payLoad:Evento){
    const headers = this.getHeaders();
    return this.http.post<Evento>(this.urlEvento, payLoad, { headers });
  }

  getByIdEvento(id:number){
    const headers = this.getHeaders();
    return this.http.get<Evento>(`${this.urlEvento}${id}`, { headers });
  }

  getByEntregaEvento(entrega:string){
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.urlEventoEntrega}${entrega}`, { headers });
  }

  getByVendaEvento(venda:number){
    const headers = this.getHeaders();
    return this.http.get<Evento>(`${this.urlEventoVenda}${venda}`, { headers });
  }

  updateEvento(payLoad:Evento){
    const headers = this.getHeaders();
    return this.http.put(`${this.urlEvento}${payLoad.id}`,payLoad, { headers });
  }

  updateEventoEntrega(payLoad:Evento){
    const headers = this.getHeaders();
    return this.http.put(`${this.urlEventoEntrega}${payLoad.entrega}`,payLoad, { headers });
  }
}
