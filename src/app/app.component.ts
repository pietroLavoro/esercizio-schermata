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
  erroreCodiceModifica = false;
  messaggioErroreModifica = "";

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

  // Inicializar después de que el array agenzie esté definido
  nuovaAgenzia: Agenzia = this.inizializzaNuovaAgenzia();

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
    // Limpiar errores previos
    this.erroreCodiceModifica = false;
    this.messaggioErroreModifica = "";

    // Creare una copia dell'agenzia per la modifica
    this.agenziaOriginale = a;
    this.agenziaInModifica = { ...a };
    this.dialogModificaVisibile = true;
  }

  salvaModifica() {
    if (this.agenziaInModifica && this.agenziaOriginale) {
      // Validar que el código no sea duplicado
      if (
        this.codiceDuplicato(
          this.agenziaInModifica.codice,
          this.agenziaOriginale
        )
      ) {
        this.erroreCodiceModifica = true;
        this.messaggioErroreModifica = `Il codice ${this.agenziaInModifica.codice} è già utilizzato da un'altra agenzia.`;
        return; // No guardar si hay error
      }

      // Reset error state
      this.erroreCodiceModifica = false;
      this.messaggioErroreModifica = "";

      // Trovare l'indice dell'agenzia originale nell'array
      const index = this.agenzie.findIndex((a) => a === this.agenziaOriginale);
      if (index !== -1) {
        // Sostituire l'agenzia originale con quella modificata
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
    // Limpiar errores
    this.erroreCodiceModifica = false;
    this.messaggioErroreModifica = "";
  }

  elimina(a: Agenzia) {
    this.agenzie = this.agenzie.filter((x) => x !== a);
  }

  // Genera el próximo ID disponible automáticamente
  generaProssimoCodice(): number {
    if (!this.agenzie || this.agenzie.length === 0) {
      return 1;
    }
    const maxCodice = Math.max(...this.agenzie.map((a) => a.codice));
    return maxCodice + 1;
  }

  // Verifica se un código ya existe (excluyendo la agencia especificada)
  codiceDuplicato(codice: number, agenziaEsclusa?: Agenzia): boolean {
    return this.agenzie.some(
      (a) => a.codice === codice && a !== agenziaEsclusa
    );
  }

  // Validación en tiempo real del código durante la modificación
  validaCodiceModifica() {
    if (this.agenziaInModifica && this.agenziaOriginale) {
      if (
        this.codiceDuplicato(
          this.agenziaInModifica.codice,
          this.agenziaOriginale
        )
      ) {
        this.erroreCodiceModifica = true;
        this.messaggioErroreModifica = `Il codice ${this.agenziaInModifica.codice} è già utilizzato da un'altra agenzia.`;
      } else {
        this.erroreCodiceModifica = false;
        this.messaggioErroreModifica = "";
      }
    }
  }

  inizializzaNuovaAgenzia(): Agenzia {
    return {
      codice: 0, // Inicializamos con 0, se asignará el correcto al abrir el diálogo
      denominazione: "",
      dataNomina: "",
      stato: "Attiva",
    };
  }

  apriDialogInserisci() {
    this.nuovaAgenzia = this.inizializzaNuovaAgenzia();
    // Asegurar que el código esté actualizado al momento de abrir el diálogo
    this.nuovaAgenzia.codice = this.generaProssimoCodice();
    this.dialogInserisciVisibile = true;
  }

  salvaInserimento() {
    if (this.nuovaAgenzia.denominazione && this.nuovaAgenzia.dataNomina) {
      // Asegurar que el código sea único (regenerar si es necesario)
      this.nuovaAgenzia.codice = this.generaProssimoCodice();
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
