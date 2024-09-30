import { Component } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Entrega } from 'src/app/models/entrega';
import { Evento } from 'src/app/models/evento';
import { EntregaService } from 'src/app/service/entrega.service';
import { EventoService } from 'src/app/service/evento.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-maindetails',
  templateUrl: './maindetails.component.html',
  styleUrls: ['./maindetails.component.css']
})
export class MaindetailsComponent {
  mostrarRatreio: { [numeroEntrega: string]: boolean } = {};

  entregaForm: Entrega = {
    id: '',
    cnpj: '',
    venda: 0,
    entrega: 0,
    status: 0,
    previsao: '',
  };

  allEntrega: Entrega[] | undefined = [];
  allEvento: Evento[] | undefined = [];

  disable = false;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private entregaService: EntregaService,
    private eventoService: EventoService,
    private router: Router,
    private dateAdapter: DateAdapter<Date>, private datePipe: DatePipe) {
      this.dateAdapter.setLocale('en-GB');
    }

    addOneDay(date: string | null): string {
      if (!date) {
        return '';
      }

      const originalDate = new Date(date);
      const newDate = new Date(originalDate);
      newDate.setDate(newDate.getDate() + 1);
      return this.datePipe.transform(newDate, 'dd/MM/yyyy') || '';
    }

  ngOnInit() {
    this.route.paramMap.subscribe((param) => {
      var id = param.get('id');
      this.getTokenEntrega(id);
      this.getEntrega(id);
    });
    setTimeout(() => {
      if(this.entregaForm.venda == 0){
        this.isLoading = false;
      }
    }, 2000);
  }

  async getTokenEntrega(token: string | null) {
    this.isLoading = true;

    const data = await this.entregaService.getByTokenEntrega(token).toPromise();
    this.entregaForm = data![0].data;
    this.isLoading = false;

    const dataVerificacao = await this.eventoService.getByEntregaEvento(this.entregaForm.id).toPromise();
    if (dataVerificacao.apiEvento == false) {
      this.disable = true;
    } else {
      this.disable = false;
    }
  }

  async getEntrega(token: string | null) {
    this.isLoading = true;

    const data = await this.entregaService.getByTokenEntrega(token).toPromise();
    this.allEntrega = data!.map((item: any) => item.data);
    console.log(this.allEntrega[0].previsao)
    this.isLoading = false;
  }

  async getEvento(entrega: string) {
    this.isLoading = true;

    const data = await this.eventoService.getByEntregaEvento(entrega).toPromise();
    this.allEvento = data!.map((item: any) => item.data);
    console.log(this.allEvento);
    this.isLoading = false;
  }

  atualizarRatreio(numeroEntrega: string): void {
    for (const entregaId in this.mostrarRatreio) {
      if (entregaId !== numeroEntrega) {
        this.mostrarRatreio[entregaId] = false;
        const elementoFechado = document.querySelector(`.card_entrega_${entregaId}`) as HTMLElement;
        elementoFechado.style.height = '50px';
      }
    }

    this.mostrarRatreio[numeroEntrega] = !this.mostrarRatreio[numeroEntrega];
    const elemento = document.querySelector(`.card_entrega_${numeroEntrega}`) as HTMLElement;
    if (this.mostrarRatreio[numeroEntrega]) {
      elemento.style.height = 'auto';
    } else {
      elemento.style.height = '50px';
    }
    this.getEvento(numeroEntrega);
  }

  getEntregaIdAsString(entrega: any): string {
    return String(entrega.id);
  }

  convertToIndex(entrega: any): string {
    return String(entrega.id);
  }

  shouldDisplayEvento(evento: Evento): boolean {
    if (evento.tipo === 6) {
      return true;
    }

    if (evento.tipo === 5) {
      const index = this.allEvento!.findIndex(e => e === evento);
      for (let i = index + 1; i < this.allEvento!.length; i++) {
        if (this.allEvento![i].tipo === 6) {
          return false;
        }
      }
    }

    return true;
  }

  getEventoIcon(tipo: number): string {
    switch (tipo) {
      case 1: return 'hourglass_top';
      case 2: return 'inventory_2';
      case 3: return 'schedule_send';
      case 4: return 'local_shipping';
      case 5: return 'done_all';
      case 6: return 'send_and_archive';
      case 7: return 'cancel_schedule_send';
      default: return '';
    }
  }

  getEventoLabel(tipo: number): string {
    switch (tipo) {
      case 1: return 'Aguardando';
      case 2: return 'Em separação';
      case 3: return 'Carregando';
      case 4: return 'Trânsito';
      case 5: return 'Entregue';
      case 6: return 'Devolvida';
      case 7: return 'Cancelada';
      default: return '';
    }
  }

  isSeparadorVisible(tipo: number): boolean {
    if (tipo === 1 || tipo === 2 || tipo === 3) {
      const nextTipoExists = this.allEvento?.some(evento => evento.tipo === tipo + 1);
      return nextTipoExists !== undefined ? nextTipoExists : false;
    }

    if (tipo === 4) {
      const tipo5Exists = this.allEvento?.some(evento => evento.tipo === 5) ?? false;
      const tipo6Exists = this.allEvento?.some(evento => evento.tipo === 6) ?? false;
      return tipo5Exists || tipo6Exists; // Only return true if both type 5 and type 6 exist.
    }

    if (tipo === 5) {
      const tipo7Exists = this.allEvento?.some(evento => evento.tipo === 7);
      return tipo7Exists !== undefined ? tipo7Exists : false;
    }

    if (tipo === 6) {
      const tipo4Exists = this.allEvento?.some(evento => evento.tipo === 4);
      const tipo5Exists = this.allEvento?.some(evento => evento.tipo === 5) ?? false;
      const tipo7Exists = this.allEvento?.some(evento => evento.tipo === 7) ?? false;
      return (tipo4Exists !== undefined && !tipo4Exists) || (tipo5Exists !== undefined && !tipo5Exists && (tipo7Exists !== undefined ? tipo7Exists : false));
    }

    return false;
  }

  retornar() {
    this.router.navigate(['']);
  }

}
