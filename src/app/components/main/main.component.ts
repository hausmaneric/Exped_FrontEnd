import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EntregaService } from 'src/app/service/entrega.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  token: string = '';
  isLoading: boolean = false;
  constructor(private router: Router,public dialog: MatDialog, private entregaService: EntregaService){ }

  ngOnInit(){}

  openDialogToken() {
    const dialogRef = this.dialog.open(DialogElementsToken, {
      width: '240px',
      height:'80px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDialogTokenl() {
    const dialogRef = this.dialog.open(DialogElementsTokenl, {
      width: '240px',
      height:'120px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  async rastrear() {
    this.isLoading = true;

    if(this.token != ''){
      const data = await this.entregaService.getByTokenEntrega(this.token).toPromise();
      if(data![0] != undefined){
        const data1 = data!.map((item: any) => item.data);
        if (this.token === '') {
          this.isLoading = false;
          this.openDialogToken();
        } else {
          const filteredData = data1!.filter((item: any) => {
            const cnpjSubstring = item.cnpj.substring(0, 8);
            const vendaString = item.venda.toString();
            const searchString = cnpjSubstring + vendaString;

            this.isLoading = false;
            return searchString.startsWith(this.token);
          });

          if (filteredData.length > 0) {
            this.isLoading = false;
            this.router.navigate(['/exped', this.token]);
          } else {
            this.openDialogTokenl();
            this.isLoading = false;
          }
        }
      }else {
        this.openDialogTokenl();
        this.isLoading = false;
      }
    }else{
      this.isLoading = false;
      this.openDialogToken();
    }

  }

}

@Component({
  selector: 'login.component.component',
  templateUrl: 'dialog-elements-token.html',
})
export class DialogElementsToken {
  constructor(public dialog: MatDialog){

  }
  fecharDialog(){
    this.dialog.closeAll();
  }
}

@Component({
  selector: 'login.component.component',
  templateUrl: 'dialog-elements-tokenl.html',
})
export class DialogElementsTokenl {
  constructor(public dialog: MatDialog){

  }
  fecharDialog(){
    this.dialog.closeAll();
  }
}

