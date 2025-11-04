import { Component } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";

/* PrimeNG */
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { DatePickerModule } from "primeng/datepicker";

type Stato = "Attiva" | "Cessata";

interface Agenzia {
  codice: number;
  denominazione: string;
  dataNomina: string; // ISO date string
  stato: Stato;
}

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TagModule,
    TooltipModule,
    DatePickerModule,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [DatePipe],
})
export class AppComponent {
  titolo = "Elenco Agenzie";
  globalFilter = "";
  filtroCodice = "";
  filtroDenominazione = "";
  filtroData: Date | null = null;
  filtroStato: Stato | "" = "";
  dialogVisibile = false;
  selezionata: Agenzia | null = null;
  dialogModificaVisibile = false;
  agenziaInModifica: Agenzia | null = null;
  agenziaOriginale: Agenzia | null = null;
  dialogInserisciVisibile = false;
  nuovaAgenzia: Agenzia = this.inizializzaNuovaAgenzia();

  stati = [
    { label: "Tutti", value: "" },
    { label: "Attiva", value: "Attiva" as Stato },
    { label: "Cessata", value: "Cessata" as Stato },
  ];

  statiInserimento = [
    { label: "Attiva", value: "Attiva" as Stato },
    { label: "Cessata", value: "Cessata" as Stato },
  ];

  agenzie: Agenzia[] = [
    {
      codice: 101,
      denominazione: "Agenzia 01",
      dataNomina: "1840-01-01",
      stato: "Attiva",
    },
    {
      codice: 103,
      denominazione: "Agenzia 02",
      dataNomina: "1834-01-01",
      stato: "Attiva",
    },
    {
      codice: 106,
      denominazione: "Agenzia 03",
      dataNomina: "1830-01-01",
      stato: "Attiva",
    },
    {
      codice: 108,
      denominazione: "Agenzia 04",
      dataNomina: "1983-05-01",
      stato: "Cessata",
    },
    {
      codice: 109,
      denominazione: "Agenzia 05",
      dataNomina: "1830-01-01",
      stato: "Cessata",
    },
    {
      codice: 111,
      denominazione: "Agenzia 06",
      dataNomina: "1988-06-01",
      stato: "Attiva",
    },
    {
      codice: 113,
      denominazione: "Agenzia 07",
      dataNomina: "1830-01-01",
      stato: "Attiva",
    },
    {
      codice: 114,
      denominazione: "Agenzia 08",
      dataNomina: "1979-01-01",
      stato: "Attiva",
    },
  ];

  get agenzieFiltrate(): Agenzia[] {
    const gf = this.globalFilter.toLowerCase();
    return this.agenzie.filter(
      (a) =>
        (!this.filtroCodice || String(a.codice).includes(this.filtroCodice)) &&
        (!this.filtroDenominazione ||
          a.denominazione
            .toLowerCase()
            .includes(this.filtroDenominazione.toLowerCase())) &&
        (!this.filtroData ||
          this.confrontaDate(new Date(a.dataNomina), this.filtroData)) &&
        (!this.filtroStato || a.stato === this.filtroStato) &&
        (!gf ||
          String(a.codice).includes(gf) ||
          a.denominazione.toLowerCase().includes(gf) ||
          a.stato.toLowerCase().includes(gf))
    );
  }

  statoSeverita(stato: Stato): "success" | "danger" {
    return stato === "Attiva" ? "success" : "danger";
  }

  statoIcon(stato: Stato): string {
    return stato === "Attiva" ? "pi pi-check" : "pi pi-exclamation-triangle";
  }

  confrontaDate(dataAgenzia: Date, filtroData: Date): boolean {
    // Confronta solo la data (giorno, mese, anno) ignorando l'ora
    return (
      dataAgenzia.getFullYear() === filtroData.getFullYear() &&
      dataAgenzia.getMonth() === filtroData.getMonth() &&
      dataAgenzia.getDate() === filtroData.getDate()
    );
  }

  apriDialog(a: Agenzia) {
    this.selezionata = a;
    this.dialogVisibile = true;
  }

  chiudiDialog() {
    this.dialogVisibile = false;
  }

  apriDialogModifica(a: Agenzia) {
    // Creiamo una copia dell'agenzia per la modifica
    this.agenziaOriginale = a;
    this.agenziaInModifica = { ...a };
    this.dialogModificaVisibile = true;
  }

  salvaModifica() {
    if (this.agenziaInModifica && this.agenziaOriginale) {
      // Troviamo l'indice dell'agenzia originale nell'array
      const index = this.agenzie.findIndex((a) => a === this.agenziaOriginale);
      if (index !== -1) {
        // Sostituiamo l'agenzia originale con quella modificata
        this.agenzie[index] = { ...this.agenziaInModifica };
      }
    }
    this.chiudiDialogModifica();
  }

  annullaModifica() {
    this.chiudiDialogModifica();
  }

  chiudiDialogModifica() {
    this.dialogModificaVisibile = false;
    this.agenziaInModifica = null;
    this.agenziaOriginale = null;
  }

  elimina(a: Agenzia) {
    this.agenzie = this.agenzie.filter((x) => x !== a);
  }

  inizializzaNuovaAgenzia(): Agenzia {
    return {
      codice: 0,
      denominazione: "",
      dataNomina: "",
      stato: "Attiva",
    };
  }

  apriDialogInserisci() {
    this.nuovaAgenzia = this.inizializzaNuovaAgenzia();
    this.dialogInserisciVisibile = true;
  }

  salvaInserimento() {
    if (
      this.nuovaAgenzia.codice &&
      this.nuovaAgenzia.denominazione &&
      this.nuovaAgenzia.dataNomina
    ) {
      // Converti la data in formato stringa se necessario
      let dataNominaStringa = this.nuovaAgenzia.dataNomina;
      if (typeof dataNominaStringa !== "string") {
        // Se è un oggetto Date, convertilo in stringa formato ISO
        dataNominaStringa = (dataNominaStringa as any)
          .toISOString()
          .split("T")[0];
      }

      const nuovaAgenziaCompleta: Agenzia = {
        ...this.nuovaAgenzia,
        dataNomina: dataNominaStringa,
      };

      this.agenzie.push(nuovaAgenziaCompleta);
    }
    this.chiudiDialogInserisci();
  }

  annullaInserimento() {
    this.chiudiDialogInserisci();
  }

  chiudiDialogInserisci() {
    this.dialogInserisciVisibile = false;
    this.nuovaAgenzia = this.inizializzaNuovaAgenzia();
  }
}
