import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { NovostoicMolecule } from "./overall-stoichiometry";
import { ChemicalAutoCompleteResponse } from "../api/mmli-backend/v1";
import { Loadable } from "../services/novostoic.service";

export class EnzymeSelectionRequest {
  form = new FormGroup({
    primaryPrecursor: new FormControl(""),
    enzymeSequence: new FormControl("", [Validators.required, this.enzSeqValidator.bind(this)]),
    agreeToSubscription: new FormControl(false),
    subscriberEmail: new FormControl("", [Validators.email]),
  });

  primaryPrecursor: Loadable<ChemicalAutoCompleteResponse> = {
    status: 'na',
    data: null
  };
  MAX_SEQ_NUM = 20;
  totalSeqNum = 0;
  validSeqNum = 0;
  sequencesMap: Map<string, string> = new Map();

  enzSeqValidator(control: AbstractControl): ValidationErrors | null {
    const sequence = control.value;
    let splitString: string[] = sequence.split('>').slice(1);

    const validAminoAcid = new RegExp("[^GPAVLIMCFYWHKRQNEDST]", "i");

    if (splitString.length == 0) {
      return { errors: [{ noSequence: true }]}
    }

    if (splitString.length > this.MAX_SEQ_NUM) {
      return { errors: [{ exceedsMaxSeqNum: true }] }
    }

    this.sequencesMap = new Map();
    const errors = splitString.map((seq: string, idx: number) => {
      let aminoHeader: string = seq.split('\n')[0];
      let aminoSeq: string = seq.split('\n').slice(1).join('');
      let aminoSeqName: string = aminoHeader.split(' ')[0];

      if (aminoSeq.slice(-1) == '*') {
        aminoSeq = aminoSeq.slice(0,-1);
      }
      aminoSeq = aminoSeq.toUpperCase();

      if (aminoHeader.length == 0) {
        return { headerCannotBeEmpty: idx }
      }

      if (aminoHeader.indexOf(':') !== -1) {
        return { containsColon: aminoSeqName }
      }

      if (validAminoAcid.test(aminoSeq)) {
        return { invalidSequence: aminoSeqName }
      }

      if (aminoSeq.length > 1022) {
        return { sequenceLengthGreaterThan1022: aminoSeqName }
      }

      if (aminoSeq.length == 0) {
        return { sequenceLengthIs0: aminoSeqName }
      }

      this.sequencesMap.set(`${aminoSeqName}:${aminoSeq}`, `>${seq}`);
      return null;
    });

    this.totalSeqNum = splitString.length;
    this.validSeqNum = splitString.length - errors.filter(error => error).length;

    if (errors.filter(error => error).length === 0) {
      return null;
    }

    return { errors: errors.filter(error => error) };
  }

  static example() {
    const request = new EnzymeSelectionRequest();
    request.form.controls["primaryPrecursor"].setValue("O=C(O)C[C@H](O)C(=O)O");
    request.primaryPrecursor = {
      status: 'loaded',
      data: {
        "name": "(S)-malate",
        "smiles": "O=C(O)C[C@H](O)C(=O)O",
        "inchi": "InChI=1S/C4H6O5/c5-2(4(8)9)1-3(6)7/h2,5H,1H2,(H,6,7)(H,8,9)/p-2/t2-/m0/s1",
        "inchi_key": "InChIKey=BJEPYKJPYRNKOW-REOHCLBHSA-L",
        "metanetx_id": "MNXM1107192",
        "kegg_id": "C00149",
      }
    }
    request.form.controls["enzymeSequence"].setValue(
      ">A0A4P8WFA8\nMTKRVLVTGGAGFLGSHLCERLLSEGHEVICLDNFGSGRRKNIKEFEDHPSFKVNDRDVRISESLPSVDRIYHLASRASPADFTQFPVNIALANTQGTRRLLDQARACDARMVFASTSEVYGDPKVHPQPETYTGNVNIRGARGCYDESKRFGETLTVAYQRKYDVDARTVRIFNTYGPRMRPDDGRVVPTFVTQALRGDDLTIYGDGEQTRSFCYVDDLIEGLISLMRVDNPEHNVYNIGKENERTIKELAYEVLGLTDTESDIVYEPLPEDDPGQRRPDITRAKTELDWEPKISLREGLEDTITYFDN",
    );
    return request;
  }

  isExampleUsed() {
    return this.form.controls["primaryPrecursor"].value === "O=C(O)C[C@H](O)C(=O)O"
      && this.form.controls["enzymeSequence"].value === ">A0A4P8WFA8\nMTKRVLVTGGAGFLGSHLCERLLSEGHEVICLDNFGSGRRKNIKEFEDHPSFKVNDRDVRISESLPSVDRIYHLASRASPADFTQFPVNIALANTQGTRRLLDQARACDARMVFASTSEVYGDPKVHPQPETYTGNVNIRGARGCYDESKRFGETLTVAYQRKYDVDARTVRIFNTYGPRMRPDDGRVVPTFVTQALRGDDLTIYGDGEQTRSFCYVDDLIEGLISLMRVDNPEHNVYNIGKENERTIKELAYEVLGLTDTESDIVYEPLPEDDPGQRRPDITRAKTELDWEPKISLREGLEDTITYFDN";
  }

  clearAll() {
    Object.values(this.form.controls).forEach((control) => control.reset());
    this.primaryPrecursor = {
      status: 'na',
      data: null
    };
  }

  toRequestBody() {
    if (!this.primaryPrecursor) {
      throw new Error("Primary precursor not set");
    }
    const jobInfo = {
      primary_precursor: 'N00001',
      add_info: `N00001:${this.primaryPrecursor.data?.smiles}`,
      enzyme_sequences: Array.from(this.sequencesMap.keys()),
      user_input_map: Object.fromEntries(this.sequencesMap),
    };
    return {
      job_info: JSON.stringify(jobInfo),
      email: this.form.controls["subscriberEmail"].value || "",
    };
  }
}