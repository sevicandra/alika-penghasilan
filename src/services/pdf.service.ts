import fs from "fs";
import path from "path";
import { Content } from "pdfmake/interfaces";
import generatePdf from "@/config/pdf.config";
import { numberToWords } from "@/helpers/numberToWord.helper";
import {
  DataGaji,
  DataKurang,
  DataLain,
  DataLembur,
  DataMakan,
  DataProfil,
  DataSptPegawai,
  DataTukin,
  RefBulan,
  RefSptTahunan,
  ViewGaji,
  ViewTukin,
} from "@/models";
import DataSatker from "@/models/DataSatker.model";
import ViewPajakGaji from "@/models/ViewPajakGaji.model";
import ViewPajakKurang from "@/models/ViewPajakKurang.model";
import { Keluarga } from "@/types/serviceKemenkeu";

export class PdfService {
  static async Header({
    eselon2,
    eselon3,
    alamat,
  }: {
    eselon2: string;
    eselon3?: string;
    alamat: string;
  }) {
    const imageData = fs
      .readFileSync(path.join(__dirname, "../../assets/logoKemenkeu.png"))
      .toString("base64");
    const header = [
      {
        table: {
          widths: ["auto", "*"],
          body: [
            [
              {
                image: `data:image/png;base64,${imageData}`,
                width: 62.65,
                rowSpan: 5,
              },
              {
                text: "KEMENTERIAN KEUANGAN REPUBLIK INDONESIA",
                alignment: "center",
                bold: true,
                fontSize: 13,
              },
            ],
            [
              {},
              {
                text: "DIREKTORAT JENDERAL KEKAYAAN NEGARA",
                alignment: "center",
                bold: true,
                fontSize: 11,
              },
            ],
            [
              {},
              {
                text: eselon2.toLocaleUpperCase(),
                alignment: "center",
                fontSize: 11,
                bold: true,
              },
            ],
            [
              {},
              {
                text: eselon3?.toLocaleUpperCase(),
                alignment: "center",
                fontSize: 11,
                bold: true,
              },
            ],
            [
              {},
              {
                text: alamat.toLocaleUpperCase(),
                alignment: "center",
                fontSize: 7,
              },
            ],
          ],
        },
        layout: "noBorders",
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 18 * (72 / 2.54),
            y2: 0,
            lineWidth: 1,
          },
        ],
        margin: [0, 10, 0, 10],
      },
    ];
    return header as Content[];
  }
  static async Tte({
    kota,
    tanggal,
    jabatan,
    nama,
  }: {
    kota: string;
    tanggal: string;
    jabatan: string;
    nama: string;
  }) {
    const tte = [
      {
        table: {
          widths: ["*", 150],
          heights: ["auto", "auto", 70, "auto", "auto"],
          body: [
            [{}, `${kota}, ${tanggal}`],
            [{}, `${jabatan}`],
            [
              {},
              {
                text: "$",
                characterSpacing: 2,
                margin: [35, 35],
              },
            ],
            [{}, { text: "Ditandatangani secara elektronik", fontSize: 7 }],
            [{}, `${nama}`],
          ],
        },
        margin: [0, 10, 20, 0],
        layout: "noBorders",
      },
    ];
    return tte as Content[];
  }

  static async Form1721A2({
    pegawai,
    satker,
    profil,
    gaji,
    kurang,
    tukin,
    tarif,
    nama,
    nip,
    jabatan,
    npwp,
    nik,
    golongan,
    nomor,
    tanggal,
  }: {
    pegawai: DataSptPegawai;
    satker: DataSatker;
    profil: DataProfil;
    gaji: ViewPajakGaji | null;
    kurang: ViewPajakKurang | null;
    tukin: ViewTukin[] | [];
    tarif: RefSptTahunan;
    tahun: string | number;
    nama: string;
    nip: string;
    jabatan: string;
    npwp: string;
    nik: string;
    golongan: string;
    nomor?: string;
    tanggal?: string;
  }): Promise<String> {
    return new Promise(async (resolve, reject) => {
      try {
        const imageData = fs
          .readFileSync(path.join(__dirname, "../../assets/logoKemenkeu.png"))
          .toString("base64");

        const setahun = gaji?.jumlah || 0 >= 12 ? 12 : gaji?.jumlah || 0;
        let gapok = 0;
        let tistri = 0;
        let tanak = 0;
        let kelg = 0;
        let tumum = 0;
        let tstruktur = 0;
        let tfungsi = 0;
        let tunj = 0;
        let tberas = 0;
        let bulat = 0;
        let tpapua = 0;
        let jml_dipungut = 0;
        let jml_tukin = 0;

        if (kurang) {
          gapok += kurang.gapok;
          tistri += kurang.tistri;
          tanak += kurang.tanak;
          kelg += gapok + tistri + tanak;
          tumum += kurang.tumum;
          tstruktur += kurang.tstruktur;
          tfungsi += kurang.tfungsi;
          tunj += tstruktur + tfungsi;
          tberas += kurang.tberas;
          bulat += kurang.bulat;
          tpapua += kurang.tpapua;
          jml_dipungut += kurang.tpajak;
        }

        if (gaji) {
          gapok += gaji.gapok;
          tistri += gaji.tistri;
          tanak += gaji.tanak;
          kelg += gapok + tistri + tanak;
          tumum += gaji.tumum;
          tstruktur += gaji.tstruktur;
          tfungsi += gaji.tfungsi;
          tunj += tstruktur + tfungsi;
          tberas += gaji.tberas;
          bulat += gaji.bulat;
          tpapua += gaji.tpapua;
          jml_dipungut += gaji.tpajak;
        }

        if (tukin) {
          jml_dipungut += tukin.reduce((acc, curr) => acc + curr.potongan, 0);
        }

        jml_tukin += tukin?.reduce((acc, curr) => acc + curr.netto, 0) || 0;
        const bruto = kelg + tumum + tunj + tberas + bulat + tpapua + jml_tukin;
        const ptkp_wp = tarif?.ptkp_wp;
        const ptkp_istri = tarif?.ptkp_istri;
        const ptkp_anak = tarif?.ptkp_anak;
        const iuran_pensiun = tarif?.iuran_pensiun;
        const biaya_jabatan = tarif?.biaya_jabatan;
        const biaya_jabatan_maks = tarif?.biaya_jabatan_maks;
        const jml_iuran_pensiun = (iuran_pensiun * kelg) / 100;
        const jml_biaya_jabatan = (biaya_jabatan * bruto) / 100;
        const total_biaya_jabatan =
          jml_biaya_jabatan >= biaya_jabatan_maks ? biaya_jabatan_maks : jml_biaya_jabatan;
        const pengurangan = jml_iuran_pensiun + total_biaya_jabatan;
        const netto = bruto - pengurangan;
        let disetahun = 0;
        if (setahun == 0) {
          disetahun = 0;
        } else {
          disetahun = Math.floor(((netto / setahun) * 12) / 1000) * 1000;
        }
        const peg_wp = Number(pegawai.kdkawin.substring(0, 1));
        const peg_istri = Number(pegawai.kdkawin.substring(1, 1));
        const peg_anak = Number(pegawai.kdkawin.substring(2, 2));
        const jml_ptkp_wp = peg_wp * ptkp_wp;
        const jml_ptkp_istri = peg_istri * ptkp_istri;
        const jml_ptkp_anak = peg_anak * ptkp_anak;
        const ptkp = jml_ptkp_wp + jml_ptkp_istri + jml_ptkp_anak;
        const pkp = disetahun - ptkp;

        const pph_tarif_1 = tarif?.pph_tarif_1;
        const pph_tarif_2 = tarif?.pph_tarif_2;
        const pph_tarif_3 = tarif?.pph_tarif_3;
        const pph_tarif_4 = tarif?.pph_tarif_4;
        const pph_limit_1 = tarif?.pph_limit_1;
        const pph_limit_2 = tarif?.pph_limit_2;
        const pph_limit_3 = tarif?.pph_limit_3;
        //hitung pph
        let pph1;
        let pph2;
        let pph3;
        let pph4;
        let pph;
        if (pkp > pph_limit_3) {
          pph1 = pph_tarif_1 * pph_limit_1;
          pph2 = pph_tarif_2 * (pph_limit_2 - pph_limit_1);
          pph3 = pph_tarif_3 * (pph_limit_3 - pph_limit_2);
          pph4 = pph_tarif_4 * (pkp - pph_limit_3);
          pph = (pph1 + pph2 + pph3 + pph4) / 100;
        } else if (pkp > pph_limit_2) {
          pph1 = pph_tarif_1 * pph_limit_1;
          pph2 = pph_tarif_2 * (pph_limit_2 - pph_limit_1);
          pph3 = pph_tarif_3 * (pkp - pph_limit_2);
          pph = (pph1 + pph2 + pph3) / 100;
        } else if (pkp > pph_limit_1) {
          pph1 = pph_tarif_1 * pph_limit_1;
          pph2 = pph_tarif_2 * (pkp - pph_limit_1);
          pph = (pph1 + pph2) / 100;
        } else {
          pph = (pph_tarif_1 * pkp) / 100;
        }
        const sisa = pph - jml_dipungut;
        const json = [
          {
            table: {
              widths: ["25%", "50%", "25%"],
              body: [
                [
                  {
                    layout: "noBorders",
                    table: {
                      body: [
                        [
                          {
                            image: `data:image/png;base64,${imageData}`,
                            width: 60,
                          },
                        ],
                        [
                          {
                            text: "KEMENTERIAN KEUANGAN RI DIREKTORAT JENDERAL PAJAK",
                            bold: true,
                            fontSize: 7,
                          },
                        ],
                      ],
                    },
                    rowSpan: 2,
                    alignment: "center",
                  },
                  {
                    text: "BUKTI PEMOTONGAN PAJAK PENGHASILAN PASAL 21 BAGI PEGAWAI NEGERI SIPIL ATAU ANGGOTA TENTARA NASIONAL INDONESIA ATAU ANGGOTA POLISI REPUBLIK INDONESIA ATAU PEJABAT NEGARA ATAU PENSIUNANNYA",
                    bold: true,
                    fontSize: 9,
                    alignment: "center",
                  },
                  {
                    rowSpan: 2,
                    layout: "noBorders",
                    table: {
                      body: [
                        [
                          {
                            text: "FORMULIR 1721-A2",
                            bold: true,
                            fontSize: 10,
                          },
                        ],
                        [
                          {
                            text: "Lembar ke-1 : untuk Penerima Penghasilan",
                            fontSize: 6,
                          },
                        ],
                        [{ text: "Lembar ke-2 : untuk Pemotong", fontSize: 6 }],
                        [
                          {
                            text: "MASA PEROLEHAN PENGHASILAN 01 - 12 ",
                            bold: true,
                            fontSize: 8,
                          },
                        ],
                      ],
                    },
                    alignment: "center",
                  },
                ],
                [
                  {},
                  {
                    text: `Nomor: ${nomor ? nomor : "-"}`,
                    alignment: "center",
                  },
                  {},
                ],
                [
                  {
                    colSpan: 3,
                    columns: [
                      {
                        width: "75%",
                        layout: "noBorders",
                        table: {
                          widths: ["*"],
                          body: [
                            [
                              {
                                layout: "noBorders",
                                table: {
                                  widths: [100, "auto", "*"],
                                  body: [
                                    [
                                      "NAMA INSTANSI/ BADAN LAIN",
                                      ":",
                                      `${satker?.nmsatker ? satker.nmsatker.toUpperCase() : "-"}`,
                                    ],
                                    [
                                      "NAMA BENDAHARA",
                                      ":",
                                      `BENDAHARA PENGELUARAN ${
                                        satker?.nmsatker ? satker.nmsatker.toUpperCase() : "-"
                                      }`,
                                    ],
                                  ],
                                },
                              },
                            ],
                          ],
                        },
                      },
                      {
                        width: "25%",
                        layout: "noBorders",
                        table: {
                          body: [["NPWP BENDAHARA:"], [`${profil?.npwp_bendahara || "-"}`]],
                        },
                      },
                    ],
                    fontSize: 7,
                  },
                  {},
                  {},
                ],
              ],
            },
          },
          {
            text: "A. IDENTITAS PENERIMA PENGHASILAN YANG DIPOTONG",
            bold: true,
            fontSize: 9,
            margin: [0, 5],
          },
          {
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    columns: [
                      {
                        width: "50%",
                        layout: "noBorders",
                        table: {
                          widths: ["auto", 90, "auto", "*"],
                          body: [
                            ["1.", { text: "NPWP", alignment: "left" }, ":", `${npwp || "-"}`],
                            ["2.", { text: "NIP", alignment: "left" }, ":", `${nip || "-"}`],
                            [
                              "3.",
                              { text: "NAMA", alignment: "left" },
                              ":",
                              `${nama?.toUpperCase() || "-"}`,
                            ],
                            [
                              "4.",
                              { text: "PANGKAT/GOL", alignment: "left" },
                              ":",
                              `${golongan || "-"}`,
                            ],
                            [
                              "5.",
                              { text: "ALAMAT", alignment: "left" },
                              ":",
                              `${pegawai?.alamat.toUpperCase() || "-"}`,
                            ],
                          ],
                        },
                      },
                      {
                        width: "50%",
                        layout: "noBorders",
                        table: {
                          widths: ["auto", 90, "auto", "*"],
                          body: [
                            [
                              "6.",
                              { text: "JENIS KELAMIN", alignment: "left" },
                              ":",
                              `${
                                nip?.substring(14, 15) == "1"
                                  ? "LAKI-LAKI"
                                  : nip?.substring(14, 15) == "2"
                                    ? "PEREMPUAN"
                                    : "-"
                              }`,
                            ],
                            ["7.", { text: "NIK", alignment: "left" }, ":", `${nik || "-"}`],
                            [
                              "8.",
                              {
                                text: "STATUS/ JUMLAH TANGGUNGAN KELUARGA",
                                alignment: "left",
                              },
                              ":",
                              `${
                                pegawai?.kdkawin.substring(1, 2) === "1"
                                  ? "K"
                                  : pegawai?.kdkawin.substring(1, 2) === "0"
                                    ? "TK"
                                    : "-"
                              }/${pegawai?.kdkawin.substring(2, 4) || "-"}`,
                            ],
                            [
                              "9.",
                              { text: "NAMA JABATAN", alignment: "left" },
                              ":",
                              `${jabatan?.toUpperCase() || "-"}`,
                            ],
                          ],
                        },
                      },
                    ],
                    columnGap: 5,
                  },
                ],
              ],
            },
            fontSize: 7,
            aligment: "left",
          },
          {
            text: "B. RINCIAN PENGHASILAN DAN PENGHITUNGAN PPh PASAL 21",
            bold: true,
            fontSize: 9,
            margin: [0, 5],
          },
          {
            table: {
              widths: ["auto", "*", 80],
              body: [
                [
                  {
                    text: "URAIAN",
                    bold: true,
                    alignment: "center",
                    colSpan: 2,
                  },
                  {},
                  { text: "JUMLAH (Rp)", bold: true, alignment: "center" },
                ],
                [
                  {
                    text: "KODE OBJEK PAJAK : 21-100-01",
                    bold: true,
                    colSpan: 2,
                  },
                  {},
                  { text: "", bold: true },
                ],
                [
                  { text: "PENGHASILAN BRUTO :", bold: true, colSpan: 2 },
                  {},
                  { text: "", bold: true },
                ],
                [
                  { text: "1", alignment: "center" },
                  {
                    text: "GAJI POKOK/ PENSIUN",
                  },
                  {
                    text: `${gapok.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "2", alignment: "center" },
                  {
                    text: "TUNJANGAN ISTRI",
                  },
                  {
                    text: `${tistri.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "3", alignment: "center" },
                  {
                    text: "TUNJANGAN ANAK",
                  },
                  {
                    text: `${tanak.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "4", alignment: "center" },
                  {
                    text: "JUMLAH GAJI DAN TUNJANGAN KELUARGA (1+2+3)",
                  },
                  {
                    text: `${kelg.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "5", alignment: "center" },
                  {
                    text: "TUNJANGAN PERBAIKAN PENGHASILAN",
                  },
                  {
                    text: `${tumum.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "6", alignment: "center" },
                  {
                    text: "TUNJANGAN STRUKTURAL/ FUNGSIONAL",
                  },
                  {
                    text: `${tunj.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "7", alignment: "center" },
                  {
                    text: "TUNJANGAN BERAS",
                  },
                  {
                    text: `${tberas.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "8", alignment: "center" },
                  {
                    text: "TUNJANGAN KHUSUS",
                  },
                  {
                    text: `${bulat.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "9", alignment: "center" },
                  {
                    text: "TUNJANGAN LAIN-LAIN",
                  },
                  {
                    text: `${tpapua.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "10", alignment: "center" },
                  {
                    text: "PENGHASILAN TETAP DAN TERATUR LAINNYA YANG PEMBAYARANNYA TERPISAH DARI PEMBAYARAN GAJI",
                  },
                  {
                    text: `${jml_tukin.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "11", alignment: "center" },
                  {
                    text: "JUMLAH PENGHASILAN BRUTO (4 s/d 10)",
                  },
                  {
                    text: `${bruto.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [{ text: "PENGURANGAN :", bold: true, colSpan: 2 }, {}, { text: "", bold: true }],
                [
                  { text: "12", alignment: "center" },
                  {
                    text: "BIAYA JABATAN/ BIAYA PENSIUN",
                  },
                  {
                    text: `${total_biaya_jabatan.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "13", alignment: "center" },
                  {
                    text: "IURAN PENSIUN ATAU IURAN THT",
                  },
                  {
                    text: `${jml_iuran_pensiun.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "14", alignment: "center" },
                  {
                    text: "JUMLAH PENGURANGAN (12 + 13)",
                  },
                  {
                    text: `${pengurangan.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  {
                    text: "PENGHITUNGAN PPh PASAL 21 :",
                    bold: true,
                    colSpan: 2,
                  },
                  {},
                  { text: "", bold: true },
                ],
                [
                  { text: "15", alignment: "center" },
                  {
                    text: "JUMLAH PENGHASILAN NETTO (11 - 14)",
                  },
                  {
                    text: `${netto.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "16", alignment: "center" },
                  {
                    text: "JUMLAH PENGHASILAN MASA SEBELUMNYA",
                  },
                  {
                    text: `${(0).toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "17", alignment: "center" },
                  {
                    text: "JUMLAH PENGHASILAN NETTO UNTUK PENGHITUNGAN PPh PASAL 21 (SETAHUN/ DISETAHUNKAN)",
                  },
                  {
                    text: `${disetahun.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "18", alignment: "center" },
                  {
                    text: "PENGHASILAN TIDAK KENA PAJAK (PTKP)",
                  },
                  {
                    text: `${ptkp.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "19", alignment: "center" },
                  {
                    text: "PENGHASILAN KENA PAJAK SETAHUN/ DISETAHUNKAN (17 - 18)",
                  },
                  {
                    text: `${pkp.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "20", alignment: "center" },
                  {
                    text: "PPh PASAL 21 ATAS PENGHASILAN KENA PAJAK SETAHUN/ DISETAHUNKAN",
                  },
                  {
                    text: `${pph.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "21", alignment: "center" },
                  {
                    text: "PPh PASAL 21 YANG TELAH DIPOTONG MASA SEBELUMNYA",
                  },
                  {
                    text: `${(0).toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "22", alignment: "center" },
                  {
                    text: "PPh PASAL 21 TERUTANG",
                  },
                  {
                    text: `${pph.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "23", alignment: "center" },
                  {
                    text: "PPh PASAL 21 YANG TELAH DIPOTONG DAN DILUNASI",
                  },
                  {
                    text: `${pph.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "", alignment: "center" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "23A.",
                      },
                      {
                        width: "*",
                        text: "ATAS GAJI DAN TUNJANGAN",
                      },
                    ],
                    columnGap: 5,
                  },
                  {
                    text: `${jml_dipungut.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
                [
                  { text: "", alignment: "center" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "23B.",
                      },
                      {
                        width: "*",
                        text: "ATAS PENGHASILAN TIDAK TETAP DAN TERATUR LAINNYA YANG PEMBAYARANNYA TERPISAH DARI GAJI",
                      },
                    ],
                    columnGap: 5,
                  },
                  {
                    text: `${sisa.toLocaleString("id-ID")}`,
                    alignment: "right",
                  },
                ],
              ],
            },
            fontSize: 8,
          },
          {
            text: "C. TANDATANGAN BENDAHARA",
            bold: true,
            fontSize: 9,
            margin: [0, 5],
          },
          {
            table: {
              widths: ["*", 130],
              heights: 100,
              body: [
                [
                  {
                    columns: [
                      {
                        width: "70%",
                        layout: "noBorders",
                        table: {
                          widths: ["auto", "auto", "auto", "*"],
                          body: [
                            ["1.", "NPWP", ":", `${profil?.npwp_bendahara || "-"}`],
                            ["2.", "NAMA", ":", `${profil?.nama_bendahara.toUpperCase() || "-"}`],
                            ["3.", "NIP", ":", `${profil?.nip_bendahara || "-"}`],
                          ],
                        },
                      },
                      {
                        width: "30%",
                        layout: "noBorders",
                        table: {
                          widths: ["auto", "*"],
                          body: [
                            ["4. ", "TANGGAL & TTD"],
                            ["", `${tanggal || "-"}`],
                          ],
                        },
                      },
                    ],
                    fontSize: 9,
                  },
                  {
                    layout: "noBorders",
                    table: {
                      widths: ["*"],
                      body: [
                        [
                          {
                            text: "$",
                            margin: [0, 40, 0, 40],
                            alignment: "center",
                          },
                        ],
                        [
                          {
                            text: "Ditandatangani secara elektronik",
                            fontSize: 7,
                            alignment: "left",
                          },
                        ],
                      ],
                    },
                  },
                ],
              ],
            },
          },
        ] as Content[];
        const pdf = await generatePdf({ json });
        resolve(pdf);
      } catch (error: unknown) {
        if (error instanceof Error) {
          reject(error.message);
        } else {
          reject("Unknown error");
        }
      }
    });
  }

  static async Form1721VII({
    pegawai,
    profil,
    makan,
    lembur,
    lains,
    nama,
    nip,
    nomor,
    tanggal,
  }: {
    pegawai: DataSptPegawai;
    satker: DataSatker;
    profil: DataProfil;
    makan: DataMakan | null;
    lembur: DataLembur | null;
    lains: DataLain[] | [];
    nama: string;
    nip: string;
    nomor?: string;
    tanggal?: string;
  }): Promise<String> {
    return new Promise(async (resolve, reject) => {
      try {
        const imageData = fs
          .readFileSync(path.join(__dirname, "../../assets/logoKemenkeu.png"))
          .toString("base64");
        let total_bruto =
          (makan?.bruto || 0) +
          (lembur?.bruto || 0) +
          lains?.reduce((a: any, b: any) => a + b.bruto, 0);
        let total_pph =
          (makan?.pph || 0) + (lembur?.pph || 0) + lains?.reduce((a: any, b: any) => a + b.pph, 0);
        const columns = lains?.map((lain: any, i: number) => [
          {
            columns: [
              {
                width: 10,
                text: `${i + 3}.`,
              },
              {
                width: "*",
                stack: [`21-499-99`, `Objek PPh Pasal 21 Final Lainnya (${lain.jenis})`],
              },
            ],
          },
          {
            text: `${lain.bruto.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            })}`,
            alignment: "right",
          },
          {
            text: `${
              pegawai.kdgol.substring(0, 1) === "4"
                ? "15%"
                : pegawai.kdgol.substring(0, 1) === "3"
                  ? "5%"
                  : "0%"
            }`,
            alignment: "right",
          },
          {
            text: `${lain.pph.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            })}`,
            alignment: "right",
          },
        ]);
        const json = [
          {
            table: {
              widths: ["25%", "50%", "25%"],
              body: [
                [
                  {
                    layout: "noBorders",
                    table: {
                      body: [
                        [
                          {
                            image: `data:image/png;base64,${imageData}`,
                            width: 60,
                          },
                        ],
                        [
                          {
                            text: "KEMENTERIAN KEUANGAN RI DIREKTORAT JENDERAL PAJAK",
                            bold: true,
                            fontSize: 7,
                          },
                        ],
                      ],
                    },
                    rowSpan: 2,
                    alignment: "center",
                  },
                  {
                    text: "BUKTI PEMOTONGAN PAJAK PENGHASILAN PASAL 21 (FINAL)",
                    bold: true,
                    fontSize: 9,
                    alignment: "center",
                  },
                  {
                    rowSpan: 2,
                    layout: "noBorders",
                    table: {
                      body: [
                        [
                          {
                            text: "FORMULIR 1721-VII",
                            bold: true,
                            fontSize: 10,
                          },
                        ],
                        [
                          {
                            text: "Lembar ke-1 : untuk Penerima Penghasilan",
                            fontSize: 6,
                          },
                        ],
                        [{ text: "Lembar ke-2 : untuk Pemotong", fontSize: 6 }],
                      ],
                    },
                    alignment: "center",
                  },
                ],
                [
                  {},
                  {
                    text: `Nomor: ${nomor ? nomor : "-"}`,
                    alignment: "center",
                  },
                  {},
                ],
              ],
            },
          },
          {
            text: "A. IDENTITAS PENERIMA PENGHASILAN YANG DIPOTONG",
            bold: true,
            fontSize: 9,
            margin: [0, 5],
          },
          {
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    columns: [
                      {
                        width: "50%",
                        layout: "noBorders",
                        table: {
                          widths: ["auto", 90, "auto", "*"],
                          body: [
                            ["1.", { text: "NIP", alignment: "left" }, ":", `${nip || "-"}`],
                            [
                              "2.",
                              { text: "NAMA", alignment: "left" },
                              ":",
                              `${nama?.toUpperCase() || "-"}`,
                            ],
                            [
                              "3.",
                              { text: "ALAMAT", alignment: "left" },
                              ":",
                              `${pegawai?.alamat.toUpperCase() || "-"}`,
                            ],
                          ],
                        },
                      },
                      {
                        width: "50%",
                        layout: "noBorders",
                        table: {
                          widths: ["auto", 90, "auto", "*"],
                          body: [
                            [
                              "4.",
                              { text: "JENIS KELAMIN", alignment: "left" },
                              ":",
                              `${
                                nip?.substring(14, 15) == "1"
                                  ? "LAKI-LAKI"
                                  : nip?.substring(14, 15) == "2"
                                    ? "PEREMPUAN"
                                    : "-"
                              }`,
                            ],
                          ],
                        },
                      },
                    ],
                    columnGap: 5,
                  },
                ],
              ],
            },
            fontSize: 7,
            aligment: "left",
          },
          {
            text: "B. PPh PASAL 21 YANG DIPOTONG",
            bold: true,
            fontSize: 9,
            margin: [0, 5],
          },
          {
            table: {
              widths: ["*", "auto", "auto", "auto"],
              body: [
                [
                  "KODE OBJEK PAJAK",
                  "JUMLAH PENGHASILAN BRUTO (Rp) ",
                  "TARIF (%)",
                  "PPh DIPOTONG (Rp)",
                ],
                [
                  { text: "(1)", alignment: "center" },
                  { text: "(2)", alignment: "center" },
                  { text: "(3)", alignment: "center" },
                  { text: "(4)", alignment: "center" },
                ],
                [
                  {
                    columns: [
                      {
                        width: 10,
                        text: "1.",
                      },
                      {
                        width: "*",
                        stack: [`21-499-99`, `Objek PPh Pasal 21 Final Lainnya (Uang Makan)`],
                      },
                    ],
                  },
                  {
                    text: `${
                      makan
                        ? makan.bruto.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })
                        : (0).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })
                    }`,
                    alignment: "right",
                  },
                  {
                    text: `${
                      pegawai.kdgol.substring(0, 1) === "4"
                        ? "15%"
                        : pegawai.kdgol.substring(0, 1) === "3"
                          ? "5%"
                          : "0%"
                    }`,
                    alignment: "right",
                  },
                  {
                    text: `${
                      makan
                        ? makan.pph.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })
                        : (0).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })
                    }`,
                    alignment: "right",
                  },
                ],
                [
                  {
                    columns: [
                      {
                        width: 10,
                        text: "2.",
                      },
                      {
                        width: "*",
                        stack: [`21-499-99`, `Objek PPh Pasal 21 Final Lainnya (Uang Lembur)`],
                      },
                    ],
                  },
                  {
                    text: `${
                      lembur
                        ? lembur.bruto.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })
                        : (0).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })
                    }`,
                    alignment: "right",
                  },
                  {
                    text: `${
                      pegawai.kdgol.substring(0, 1) === "4"
                        ? "15%"
                        : pegawai.kdgol.substring(0, 1) === "3"
                          ? "5%"
                          : "0%"
                    }`,
                    alignment: "right",
                  },
                  {
                    text: `${
                      lembur
                        ? lembur.pph.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })
                        : (0).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })
                    }`,
                    alignment: "right",
                  },
                ],
                ...columns,
                [
                  { text: "Jumlah", bold: true, alignment: "center" },
                  {
                    text: `${total_bruto.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    })}`,
                    alignment: "right",
                  },
                  "",
                  {
                    text: `${total_pph.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    })}`,
                    alignment: "right",
                  },
                ],
              ],
            },
            fontSize: 8,
          },
          {
            text: "C. TANDATANGAN BENDAHARA",
            bold: true,
            fontSize: 9,
            margin: [0, 5],
          },
          {
            table: {
              widths: ["*", 130],
              heights: 100,
              body: [
                [
                  {
                    columns: [
                      {
                        width: "70%",
                        layout: "noBorders",
                        table: {
                          widths: ["auto", "auto", "auto", "*"],
                          body: [
                            ["1.", "NPWP", ":", `${profil?.npwp_bendahara || "-"}`],
                            ["2.", "NAMA", ":", `${profil?.nama_bendahara.toUpperCase() || "-"}`],
                            ["3.", "NIP", ":", `${profil?.nip_bendahara || "-"}`],
                          ],
                        },
                      },
                      {
                        width: "30%",
                        layout: "noBorders",
                        table: {
                          widths: ["auto", "*"],
                          body: [
                            ["4. ", "TANGGAL & TTD"],
                            ["", `${tanggal || "-"}`],
                          ],
                        },
                      },
                    ],
                    fontSize: 9,
                  },
                  {
                    layout: "noBorders",
                    table: {
                      widths: ["*"],
                      body: [
                        [
                          {
                            text: "$",
                            margin: [0, 40, 0, 40],
                            alignment: "center",
                          },
                        ],
                        [
                          {
                            text: "Ditandatangani secara elektronik",
                            fontSize: 7,
                            alignment: "left",
                          },
                        ],
                      ],
                    },
                  },
                ],
              ],
            },
          },
        ] as Content[];
        const pdf = await generatePdf({ json });
        resolve(pdf);
      } catch (error: unknown) {
        if (error instanceof Error) {
          reject(error.message);
        } else {
          reject("Unknown error");
        }
      }
    });
  }

  static async DaftarGaji({
    satker,
    gaji,
    profil,
    bulan,
    viewGaji,
    tahun,
    nama,
    nip,
    nomor,
    npwp,
  }: {
    satker: DataSatker;
    gaji: DataGaji | null;
    profil: DataProfil;
    bulan: RefBulan;
    viewGaji: ViewGaji | null;
    tahun: string;
    nama: string;
    nip: string;
    jabatan: string;
    nomor?: string;
    npwp?: string;
  }): Promise<String> {
    return new Promise(async (resolve, reject) => {
      try {
        const body = [
          {
            text: "KEMENTERIAN KEUANGAN RI",
          },
          {
            text: "DAFTAR GAJI",
            alignment: "center",
          },
          {
            text: `Nomor ${nomor ? nomor : "-"}`,
            alignment: "center",
            margin: [0, 0, 0, 10],
          },
          {
            text: `PEMBAYARAN : GAJI BULAN  ${bulan.bulan.toUpperCase() || "-"} ${tahun || "-"}`,
          },
          {
            alignment: "left",
            table: {
              widths: [
                "auto", //1
                "*", // 2
                "auto", //3
                "auto", //4
                "auto", //5
                "auto", //6
                "auto", //7
                "auto", //8
                "auto", //9
                "auto", //10
                "auto", //11
                "auto", //12
                "auto", //13
                "auto", //14
                "auto", //15
              ],
              body: [
                [
                  {
                    text: "NO",
                    rowSpan: 2,
                  }, //1
                  {
                    layout: "noBorders",
                    fontSize: 7,
                    table: {
                      body: [["NAMA"], ["TANGGAL LAHIR"], ["NIP"], ["GOLONGAN"], ["NPWP"]],
                    },
                    rowSpan: 2,
                  }, //2
                  {
                    text: "STA. KAWIN JML/ANAK JIWA",
                    rowSpan: 2,
                  }, //3
                  {
                    text: "P E N G H A S I L A N",
                    colSpan: 6,
                    alignment: "center",
                  }, //4
                  {}, //5
                  {}, //6
                  {}, //7
                  {}, //8
                  {}, //9
                  { text: "P O T O N G A N", colSpan: 6, alignment: "center" }, //10
                  {}, //11
                  {}, //12
                  {}, //13
                  {}, //14
                  {}, //15
                ],
                [
                  {}, //1
                  {}, //2
                  {}, //3
                  {
                    layout: "noBorders",
                    fontSize: 7,
                    table: {
                      body: [["GAJI POKOK"], ["TUNJ.KELG"], ["A. ISTRI/SUAMI"], ["B. ANAK"]],
                    },
                  }, //4
                  {
                    layout: "noBorders",
                    fontSize: 7,
                    table: {
                      body: [["TUN. UMUM"], ["TAMB. UMUM"], ["TUNJ. PAPUA"], ["TERPENCIL"]],
                    },
                  }, //5
                  {
                    layout: "noBorders",
                    fontSize: 7,
                    table: {
                      body: [
                        ["TUNJ. JABATAN"],
                        ["A. STRUKTURAL"],
                        ["B. FUNGSIONAL"],
                        ["C. LAIN-LAIN"],
                        ["D. PEMBULATAN"],
                      ],
                    },
                  }, //6
                  { text: "TUNJ. BERAS" }, //7
                  { text: "TUNJ. KHUSUS PAJAK" }, //8
                  { text: "JUMLAH PENGH. KOTOR" }, //9
                  { text: "POT. BERAS" }, //10
                  {
                    layout: "noBorders",
                    fontSize: 7,
                    table: {
                      body: [["IWP"], ["BPJS"], ["BPJS Kel. Lainnya"]],
                    },
                  }, //11
                  {
                    text: "PAJAK PENGHASILAN",
                  }, //12
                  {
                    layout: "noBorders",
                    fontSize: 7,
                    table: {
                      body: [
                        ["SEWA RMH"],
                        ["TUNGGAKAN"],
                        ["UTANG LEBIH"],
                        ["POT. LAIN"],
                        ["TAPERUM"],
                      ],
                    },
                  }, //13
                  { text: "JUMLAH POTONGAN" }, //14
                  {
                    text: "JUMLAH BERSIH YANG  DIBAYARKAN",
                  }, //15
                ],
                [
                  { text: "1", alignment: "center" },
                  { text: "2", alignment: "center" },
                  { text: "3", alignment: "center" },
                  { text: "4", alignment: "center" },
                  { text: "5", alignment: "center" },
                  { text: "6", alignment: "center" },
                  { text: "7", alignment: "center" },
                  { text: "8", alignment: "center" },
                  { text: "9", alignment: "center" },
                  { text: "10", alignment: "center" },
                  { text: "11", alignment: "center" },
                  { text: "12", alignment: "center" },
                  { text: "13", alignment: "center" },
                  { text: "14", alignment: "center" },
                  { text: "15", alignment: "center" },
                ],
                [
                  {
                    text: "---------- data sebelum ----------",
                    alignment: "center",
                    colSpan: 15,
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                ],
                //   Start Data Penghasilan
                [
                  {}, //1
                  {
                    layout: "noBorders",
                    fontSize: 7,
                    table: {
                      body: [
                        [{ text: nama ? nama.toUpperCase() : " " }],
                        [
                          {
                            text: `LHR. ${
                              nip
                                ? new Date(
                                    nip.slice(0, 4) + "-" + nip.slice(4, 6) + "-" + nip.slice(6, 8)
                                  ).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : " "
                            }`,
                          },
                        ],
                        [{ text: `NIP${nip || " "}` }],
                        [
                          {
                            text: `GOL. ${gaji ? gaji.kdgapok.slice(0, 2) : " "}`,
                          },
                        ],
                        [{ text: npwp || " " }],
                      ],
                    },
                  }, //2
                  { text: gaji ? gaji.kdkawin : " " }, //3
                  {
                    layout: "noBorders",
                    fontSize: 7,
                    table: {
                      widths: ["*"],
                      body: [
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.gapok.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                        [" "],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.tistri.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.tanak.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                      ],
                    },
                  }, //4
                  {
                    layout: "noBorders",
                    fontSize: 7,
                    table: {
                      widths: ["*"],
                      body: [
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.tumum.toLocaleString("id-ID") : " ",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.ttambumum.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.tpapua.toLocaleString("id-ID") : " ",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.tpencil.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                      ],
                    },
                  }, //5
                  {
                    layout: "noBorders",
                    fontSize: 7,
                    table: {
                      widths: ["*"],
                      body: [
                        [" "],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.tstruktur.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.tfungsi.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.tlain.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.bulat.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                      ],
                    },
                  }, //6
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: gaji ? gaji.tberas.toLocaleString("id-ID") : "-",
                        alignment: "right",
                      },
                    ],
                  }, //7
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: gaji ? gaji.tpajak.toLocaleString("id-ID") : "-",
                        alignment: "right",
                      },
                    ],
                  }, //8
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: viewGaji ? viewGaji.bruto.toLocaleString("id-ID") : "-",
                        alignment: "right",
                      },
                    ],
                  }, //9
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: gaji ? gaji.pberas.toLocaleString("id-ID") : "-",
                        alignment: "right",
                      },
                    ],
                  }, //10
                  {
                    layout: "noBorders",
                    fontSize: 7,
                    table: {
                      widths: ["*"],
                      body: [
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.pberas.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.bpjs.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.bpjs2.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                      ],
                    },
                  }, //11
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: gaji ? gaji.pph.toLocaleString("id-ID") : "-",
                        alignment: "right",
                      },
                    ],
                  }, //12
                  {
                    layout: "noBorders",
                    fontSize: 7,
                    table: {
                      widths: ["*"],
                      body: [
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.sewarmh.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.tunggakan.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.utanglebih.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.potlain.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                        [
                          {
                            columns: [
                              {
                                width: "auto",
                                text: "Rp",
                              },
                              {
                                width: "*",
                                text: gaji ? gaji.taperum.toLocaleString("id-ID") : "-",
                                alignment: "right",
                              },
                            ],
                          },
                        ],
                      ],
                    },
                  }, //13
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: viewGaji ? viewGaji.potongan.toLocaleString("id-ID") : "-",
                        alignment: "right",
                      },
                    ],
                  }, //14
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: viewGaji ? viewGaji.netto.toLocaleString("id-ID") : "-",
                        alignment: "right",
                      },
                    ],
                  }, //15
                ],
                //   End Data Penghasilan
                [
                  {
                    text: "---------- data sesudah ----------",
                    alignment: "center",
                    colSpan: 15,
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {},
                ],
              ],
            },
            fontSize: 7,
          },
        ] as Content[];
        const tte = await this.Tte({
          kota: `${satker?.kota ? satker.kota : "-"}`,
          tanggal: `${new Date().toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}`,
          jabatan: `${profil?.jab_ttd_skp || " "}`,
          nama: `${profil?.nama_ttd_skp || " "}`,
        });

        const pdf = await generatePdf({
          json: [...body, ...tte],
          orientation: "landscape",
        });

        resolve(pdf);
      } catch (error: unknown) {
        if (error instanceof Error) {
          reject(error.message);
        } else {
          reject("Unknown error");
        }
      }
    });
  }

  static async KP4({
    keluargas,
    gaji,
    nip,
    nama,
    tempatLahir,
    tanggalLahir,
    jabatan,
    namaSatker,
    golongan,
    profil,
    satker,
  }: {
    keluargas: Keluarga[];
    gaji: DataGaji;
    nip: string;
    nama: string;
    tempatLahir: string;
    tanggalLahir: string;
    jabatan: string;
    namaSatker: string;
    golongan: string;
    profil: DataProfil;
    satker: DataSatker;
  }): Promise<String> {
    return new Promise(async (resolve, reject) => {
      try {
        const json = [
          {
            text: "SURAT KETERANGAN",
            alignment: "center",
            bold: true,
            fontSize: 14,
          },
          {
            text: "UNTUK MENDAPATKAN TUNJANGAN KELUARGA",
            alignment: "center",
            bold: true,
            fontSize: 14,
            margin: [0, 10, 0, 10],
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 18 * (72 / 2.54),
                y2: 0,
                lineWidth: 1,
              },
            ],
            margin: [0, 10, 0, 10],
          },
          {
            text: "Saya yang bertanda tangan dibawah ini,",
            margin: [0, 10, 0, 10],
          },
          {
            table: {
              widths: ["auto", "auto", "auto", "*"],
              body: [
                [
                  { text: "1.", alignment: "center" },
                  { text: "Nama Lengkap", alignment: "left" },
                  { text: ":", alignment: "center" },
                  { text: nama?.toUpperCase(), alignment: "left" },
                ],
                [
                  { text: "2.", alignment: "center" },
                  { text: "NIP", alignment: "left" },
                  { text: ":", alignment: "center" },
                  { text: nip?.toUpperCase(), alignment: "left" },
                ],
                [
                  { text: "3.", alignment: "center" },
                  { text: "Tempat, Tanggal Lahir", alignment: "left" },
                  { text: ":", alignment: "center" },
                  {
                    text: `${tempatLahir?.toUpperCase()}, ${new Date(tanggalLahir)
                      .toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                      .toUpperCase()}`,
                    alignment: "left",
                  },
                ],
                [
                  { text: "4.", alignment: "center" },
                  { text: "Jenis Kelamin", alignment: "left" },
                  { text: ":", alignment: "center" },
                  {
                    text: `${nip.substring(14, 15) == "1" ? "LAKI-LAKI" : "PEREMPUAN"}`,
                    alignment: "left",
                  },
                ],
                [
                  { text: "5.", alignment: "center" },
                  { text: "Status", alignment: "left" },
                  { text: ":", alignment: "center" },
                  {
                    text: `${gaji.kdkawin} / ${
                      gaji.kdkawin.substring(1, 2) == "1" ? "KAWIN" : "TIDAK KAWIN"
                    } ${gaji.kdkawin.substring(2, 4)} ANAK`,
                    alignment: "left",
                  },
                ],
                [
                  { text: "6.", alignment: "center" },
                  { text: "Jabatan", alignment: "left" },
                  { text: ":", alignment: "center" },
                  { text: jabatan?.toUpperCase(), alignment: "left" },
                ],
                [
                  { text: "7.", alignment: "center" },
                  { text: "Pangkat/Gol", alignment: "left" },
                  { text: ":", alignment: "center" },
                  {
                    text: `${golongan?.toUpperCase()}`,
                    alignment: "left",
                  },
                ],
                [
                  { text: "8.", alignment: "center" },
                  { text: "Nama Instansi", alignment: "left" },
                  { text: ":", alignment: "center" },
                  { text: namaSatker?.toUpperCase(), alignment: "left" },
                ],
                [
                  { text: "9.", alignment: "center" },
                  { text: "Masa Kerja Golongan", alignment: "left" },
                  { text: ":", alignment: "center" },
                  { text: gaji.kdgapok?.toUpperCase(), alignment: "left" },
                ],
                [
                  { text: "10.", alignment: "center" },
                  { text: "Digaji Sebesar", alignment: "left" },
                  { text: ":", alignment: "center" },
                  {
                    text: gaji.gapok.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }),
                    alignment: "left",
                  },
                ],
              ],
            },
            layout: "noBorders",
          },
          {
            text: "Menerangkan dengan sesungguhnya:",
            margin: [0, 10, 0, 10],
          },
          {
            table: {
              widths: ["auto", "*"],
              body: [
                [
                  { text: "a.", alignment: "center" },
                  {
                    text: "Disamping jabatan utama tersebut, bekerja pula sebagai: dengan mendapat penghasilan sebesar Rp 0,-",
                    alignment: "left",
                  },
                ],
                [
                  { text: "b.", alignment: "center" },
                  {
                    text: "Mempunyai pensiun/ pensiun janda",
                    alignment: "left",
                  },
                ],
                [
                  { text: "c.", alignment: "center" },
                  {
                    text: "Mempunyai susunan keluarga sebagai berikut:",
                    alignment: "left",
                  },
                ],
                [
                  {},
                  {
                    table: {
                      widths: ["auto", "*", "auto", "auto", "auto", "auto"],
                      body: [
                        [
                          { text: "No.", alignment: "center" },
                          { text: "Nama", alignment: "center" },
                          { text: "Tanggal Lahir", alignment: "center" },
                          { text: "Hubungan", alignment: "center" },
                          { text: "Pekerjaan", alignment: "center" },
                          { text: "Status", alignment: "center" },
                        ],
                        ...keluargas
                          .filter(
                            (k) =>
                              k.IdrefHubungan == 4 ||
                              k.IdrefHubungan == 7 ||
                              k.IdrefHubungan == 1 ||
                              k.IdrefHubungan == 2 ||
                              k.IdrefHubungan == 3 ||
                              k.IdrefHubungan == 12
                          )
                          .map((item: any, index: number) => [
                            {
                              text: `${index + 1}.`,
                              alignment: "center",
                            },
                            {
                              text: item.Nama?.toUpperCase(),
                              alignment: "left",
                            },
                            {
                              text: new Date(item.TanggalLahir)
                                .toLocaleDateString("id-ID", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                                .toUpperCase(),
                              alignment: "center",
                            },
                            {
                              text: item.Hubungan?.toUpperCase(),
                              alignment: "center",
                            },
                            {
                              text: item.Pekerjaan?.toUpperCase(),
                              alignment: "center",
                            },
                            {
                              text: item.StatusTanggungan?.toUpperCase(),
                              alignment: "center",
                            },
                          ]),
                        [{ text: "", alignment: "center", colSpan: 6 }, {}, {}, {}, {}, {}],
                      ],
                    },
                    fontSize: 9,
                  },
                ],
              ],
            },
            layout: "noBorders",
          },
          {
            text: `Keterangan ini saya buat dengan sesungguhnya dan apabila keterangan ini ternyata tidak benar (palsu) saya bersedia dituntut pengadilan berdasarkan undang-undang yang berlaku dan bersedia mengembalikan semua penghasilan yang telah saya terima yang seharusnya bukan menjadi hak saya.`,
            lineHeight: 1,
          },
          {
            table: {
              widths: [150, "*", 150],
              heights: ["auto", "auto", "auto", 70, "auto", "auto"],
              body: [
                [
                  {},
                  {},
                  `${satker?.kota ? satker.kota : "-"}, ${new Date().toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })}`,
                ],
                [`Mengetahui`, {}, `Yang Menerangkan`],
                [`${profil.jab_ttd_kp4}`, {}, {}],
                [
                  {
                    text: "$",
                    characterSpacing: 2,
                    margin: [35, 35],
                  },
                  {},
                  {
                    text: "#",
                    characterSpacing: 2,
                    margin: [35, 35],
                  },
                ],
                [
                  { text: "Ditandatangani secara elektronik", fontSize: 7 },
                  {},
                  { text: "Ditandatangani secara elektronik", fontSize: 7 },
                ],
                [profil.nama_ttd_kp4, {}, nama],
              ],
            },
            margin: [0, 10, 20, 0],
            layout: "noBorders",
          },
        ] as Content;
        const pdf = await generatePdf({ json });
        resolve(pdf);
      } catch (error: unknown) {
        if (error instanceof Error) {
          reject(error.message);
        } else {
          reject("Unknown error");
        }
      }
    });
  }

  static async Skp({
    satker,
    gaji,
    kurang,
    makan,
    lembur,
    profil,
    tukin,
    bulan,
    tahun,
    nama,
    nip,
    jabatan,
    organisasi,
    nomor,
  }: {
    satker: DataSatker;
    gaji: DataGaji | null;
    kurang: DataKurang | null;
    makan: DataMakan | null;
    lembur: DataLembur | null;
    profil: DataProfil;
    tukin: DataTukin | null;
    bulan: RefBulan;
    tahun: string;
    nama: string;
    nip: string;
    jabatan: string;
    organisasi: string;
    nomor?: string;
  }): Promise<String> {
    return new Promise(async (resolve, reject) => {
      try {
        let gapok = 0;
        let tistri = 0;
        let tanak = 0;
        let tumum = 0;
        let tjabatan = 0;
        let bulat = 0;
        let tberas = 0;
        let tpajak = 0;
        let tlain = 0;
        let iwp = 0;
        let pph = 0;
        let bpjs = 0;
        let bpjs2 = 0;
        let lainnya = 0;
        let taperum = 0;
        if (kurang) {
          gapok += kurang.gapok;
          tistri += kurang.tistri;
          tanak += kurang.tanak;
          tumum += kurang.tumum + kurang.ttambumum;
          tjabatan += kurang.tstruktur + kurang.tfungsi;
          bulat += kurang.bulat;
          tberas += kurang.tberas;
          tpajak += kurang.tpajak;
          tlain += kurang.tpapua + kurang.tpencil + kurang.tlain;
          iwp += kurang.iwp;
          pph += kurang.pph;
          bpjs += kurang.bpjs;
          bpjs2 += kurang.bpjs2;
          lainnya += kurang.tunggakan + kurang.utanglebih + kurang.potlain + kurang.sewarmh;
          taperum += kurang.taperum;
        }
        if (gaji) {
          gapok += gaji.gapok;
          tistri += gaji.tistri;
          tanak += gaji.tanak;
          tumum += gaji.tumum + gaji.ttambumum;
          tjabatan += gaji.tstruktur + gaji.tfungsi;
          bulat += gaji.bulat;
          tberas += gaji.tberas;
          tpajak += gaji.tpajak;
          tlain += gaji.tpapua + gaji.tpencil + gaji.tlain;
          iwp += gaji.iwp;
          pph += gaji.pph;
          bpjs += gaji.bpjs;
          bpjs2 += gaji.bpjs2;
          lainnya += gaji.tunggakan + gaji.utanglebih + gaji.potlain + gaji.sewarmh;
          taperum += gaji.taperum;
        }

        let bruto1 = gapok + tistri + tanak + tumum + tjabatan + bulat + tberas + tpajak + tlain;
        let potongan1 = iwp + pph + bpjs + bpjs2 + lainnya + taperum;
        let netto1 = bruto1 - potongan1;

        let tunjangan = 0;
        let absenr = 0;
        let tkpph = 0;
        let potpph = 0;

        if (tukin) {
          tunjangan = tukin.tjpokok + tukin.tjtamb;
          absenr = tukin.abspotr;
          tkpph = tukin.tkpph;
          potpph = tukin.potpph;
        }
        let bruto2 = tunjangan + tkpph - absenr;
        let potongan2 = potpph;
        let netto2 = bruto2 - potongan2;

        let netto3 = 0;
        let netto4 = 0;

        if (makan) {
          netto3 = makan.netto;
        } else {
          netto3 = 0;
        }
        if (lembur) {
          netto4 = lembur.netto;
        } else {
          netto4 = 0;
        }
        const header = await this.Header({
          eselon2: `${satker?.header1.toUpperCase() || ""}`,
          eselon3: `${satker?.header2.toUpperCase() || ""}`,
          alamat: `${satker?.subheader1.toUpperCase() || ""} ${
            satker?.subheader2.toUpperCase() || ""
          } ${satker?.subheader3.toUpperCase() || ""}`,
        });
        const body = [
          {
            text: "SURAT KETERANGAN PENGHASILAN",
            margin: [0, 10, 0, 0],
            alignment: "center",
          },
          {
            text: `NOMOR ${nomor ? nomor : "-"}`,
            margin: [0, 0, 0, 10],
            alignment: "center",
          },
          {
            text: `Yang bertandatangan dibawah ini, ${
              profil.jab_ttd_skp ? profil.jab_ttd_skp : "-"
            }, ${satker.nmsatker ? satker.nmsatker : "-"} menerangkan bahwa:`,
          },
          {
            table: {
              widths: ["auto", "auto", "*"],
              body: [
                [
                  { text: "Nama", alignment: "left" },
                  { text: ":", alignment: "center" },
                  { text: `${nama ? nama : "-"}`, alignment: "left" },
                ],
                [
                  { text: "NIP", alignment: "left" },
                  { text: ":", alignment: "center" },
                  { text: `${nip ? nip : "-"}`, alignment: "left" },
                ],
                [
                  { text: "Jabatan", alignment: "left" },
                  { text: ":", alignment: "center" },
                  {
                    text: `${jabatan ? jabatan : "-"}, ${organisasi && organisasi}`,
                    alignment: "left",
                  },
                ],
              ],
            },
            layout: "noBorders",
          },
          {
            text: [
              { text: "Mempunyai penghasilan bulan " },
              { text: `${bulan.bulan + " " + tahun} `, bold: true },
              { text: "sebagai berikut:" },
            ],
            margin: [0, 10, 0, 0],
          },
          {
            table: {
              widths: [
                "auto",
                "auto",
                "*",
                (18 * (72 / 2.54)) / 6,
                (18 * (72 / 2.54)) / 6,
                (18 * (72 / 2.54)) / 6,
              ],
              body: [
                ["I.", { text: "Gaji Induk", colSpan: 5 }, {}, {}, {}, {}],
                [
                  {},
                  { text: "1.", alignment: "center" },
                  { text: "Gaji Pokok" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${gapok.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "2.", alignment: "center" },
                  { text: "Tunjangan Suami/Istri" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${tistri.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "3.", alignment: "center" },
                  { text: "Tunjangan Anak" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${tanak.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "4.", alignment: "center" },
                  { text: "Tunjangan Umum" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${tumum.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "5.", alignment: "center" },
                  { text: "Tunjangan Str/Fung" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${tjabatan.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "6.", alignment: "center" },
                  { text: "Pembulatan" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${bulat.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "7.", alignment: "center" },
                  { text: "Tunjangan Beras" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${tberas.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "8.", alignment: "center" },
                  { text: "Tunjangan Pajak & Lainnya" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${(tpajak + tlain).toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "Jumlah Kotor", colSpan: 2 },
                  {},
                  {},
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${bruto1.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                ],
                [{}, { text: "Dengan potongan sebagai berikut:", colSpan: 2 }, {}, {}, {}, {}],
                [
                  {},
                  { text: "1.", alignment: "center" },
                  { text: "Iuran Wajib Pegawai" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${iwp.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "2.", alignment: "center" },
                  { text: "Pajak Penghasilan" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${pph.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "3.", alignment: "center" },
                  { text: "BPJS" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${bpjs.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "4.", alignment: "center" },
                  { text: "BPJS Kel. Lainnya" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${bpjs2.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "5.", alignment: "center" },
                  { text: "Sewa Rmh & Taperum" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${(lainnya + taperum).toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "Jumlah Potongan", colSpan: 2 },
                  {},
                  {},
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${potongan1.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                ],
                [
                  {},
                  { text: "Jumlah Bersih", colSpan: 2 },
                  {},
                  {},
                  {},
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${netto1.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                ],
                ["II.", { text: "Tunjangan Kinerja", colSpan: 5 }, {}, {}, {}, {}],
                [
                  {},
                  { text: "1.", alignment: "center" },
                  { text: "Tunj. Pokok & Tunj. Tamb" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${tunjangan.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "2.", alignment: "center" },
                  { text: "Tunj. Pajak" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${tkpph.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "3.", alignment: "center" },
                  { text: "Potongan Absen" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${absenr.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "Jumlah Kotor", colSpan: 2 },
                  {},
                  {},
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${bruto2.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                ],
                [{}, { text: "Dengan potongan sebagai berikut:", colSpan: 2 }, {}, {}, {}, {}],
                [
                  {},
                  { text: "1.", alignment: "center" },
                  { text: "Pajak Penghasilan" },
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${potpph.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                  {},
                ],
                [
                  {},
                  { text: "Jumlah Potongan", colSpan: 2 },
                  {},
                  {},
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${potongan2.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                  {},
                ],
                [
                  {},
                  { text: "Jumlah Bersih", colSpan: 2 },
                  {},
                  {},
                  {},
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${netto2.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                ],
                [
                  "III.",
                  { text: "Uang Makan", colSpan: 4 },
                  {},
                  {},
                  {},
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${netto3.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                ],
                [
                  "IV.",
                  { text: "Uang Lembur", colSpan: 4 },
                  {},
                  {},
                  {},
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${netto4.toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                ],
                [
                  { text: "Total Penghasilan", colSpan: 5 },
                  {},
                  {},
                  {},
                  {},
                  {
                    columns: [
                      {
                        width: "auto",
                        text: "Rp",
                      },
                      {
                        width: "*",
                        text: `${(netto1 + netto2 + netto3 + netto4).toLocaleString("id-ID")}`,
                        alignment: "right",
                      },
                    ],
                  },
                ],
                [
                  {
                    text: `(${numberToWords(netto1 + netto2 + netto3 + netto4)} rupiah)`,
                    colSpan: 6,
                    alignment: "right",
                    fontSize: 7,
                  },
                  {},
                  {},
                  {},
                  {},
                  {},
                ],
              ],
            },
            margin: [0, 10, 0, 0],
            layout: "noBorders",
            lineHeight: 0.7,
          },
        ] as Content[];
        const tte = await this.Tte({
          kota: `${satker?.kota ? satker.kota : "-"}`,
          tanggal: `${new Date().toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          })}`,
          jabatan: `${profil.jab_ttd_skp}`,
          nama: `${profil.nama_ttd_skp}`,
        });

        const pdf = await generatePdf({
          json: [...header, ...body, ...tte],
          margin: { top: 1, right: 1.5, bottom: 1, left: 2 },
        });
        resolve(pdf);
      } catch (error: unknown) {
        if (error instanceof Error) {
          reject(error.message);
        } else {
          reject("Unknown error");
        }
      }
    });
  }
}
