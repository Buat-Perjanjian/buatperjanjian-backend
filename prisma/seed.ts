import { PrismaClient, ContractType } from '../generated/prisma/client.js';

const prisma = new PrismaClient({});

const templates = [
  {
    name: 'Perjanjian Kerja Waktu Tertentu (PKWT)',
    contract_type: ContractType.PKWT,
    template_html: `<h1 style="text-align:center;">PERJANJIAN KERJA WAKTU TERTENTU</h1>
<p style="text-align:center;">Nomor: {{nomor_kontrak}}</p>
<br/>
<p>Pada hari ini {{tanggal}}, bertempat di {{tempat}}, yang bertanda tangan di bawah ini:</p>

<p><strong>PIHAK PERTAMA (Pemberi Kerja):</strong></p>
<table>
<tr><td>Nama Perusahaan</td><td>: {{nama_perusahaan}}</td></tr>
<tr><td>Alamat</td><td>: {{alamat_perusahaan}}</td></tr>
<tr><td>Diwakili oleh</td><td>: {{nama_perwakilan}}</td></tr>
<tr><td>Jabatan</td><td>: {{jabatan_perwakilan}}</td></tr>
</table>

<p><strong>PIHAK KEDUA (Pekerja):</strong></p>
<table>
<tr><td>Nama</td><td>: {{nama_karyawan}}</td></tr>
<tr><td>Tempat/Tgl Lahir</td><td>: {{ttl_karyawan}}</td></tr>
<tr><td>Alamat</td><td>: {{alamat_karyawan}}</td></tr>
<tr><td>No. KTP</td><td>: {{no_ktp}}</td></tr>
</table>

<p>Kedua belah pihak sepakat untuk mengadakan Perjanjian Kerja Waktu Tertentu (PKWT) dengan ketentuan sebagai berikut:</p>

<h2>Pasal 1 - Ruang Lingkup Pekerjaan</h2>
<p>PIHAK PERTAMA mempekerjakan PIHAK KEDUA sebagai <strong>{{jabatan}}</strong> di departemen <strong>{{departemen}}</strong> dengan tugas dan tanggung jawab sebagaimana tercantum dalam deskripsi pekerjaan yang menjadi bagian tidak terpisahkan dari perjanjian ini.</p>

<h2>Pasal 2 - Jangka Waktu</h2>
<p>Perjanjian ini berlaku selama <strong>{{durasi_kontrak}}</strong> terhitung mulai tanggal <strong>{{tanggal_mulai}}</strong> sampai dengan tanggal <strong>{{tanggal_selesai}}</strong>.</p>

<h2>Pasal 3 - Masa Percobaan</h2>
<p>Sesuai dengan ketentuan Undang-Undang Ketenagakerjaan, PKWT tidak mensyaratkan masa percobaan. Apabila disyaratkan masa percobaan, maka masa percobaan tersebut batal demi hukum.</p>

<h2>Pasal 4 - Waktu Kerja</h2>
<p>PIHAK KEDUA bersedia bekerja dengan waktu kerja sebagai berikut:</p>
<p>{{jam_kerja}}</p>

<h2>Pasal 5 - Kompensasi</h2>
<p>PIHAK PERTAMA akan memberikan kompensasi kepada PIHAK KEDUA berupa:</p>
<ul>
<li>Gaji Pokok: Rp {{gaji_pokok}} per bulan</li>
<li>Tunjangan: {{tunjangan}}</li>
</ul>
<p>Gaji dibayarkan setiap tanggal {{tanggal_gajian}} setiap bulannya.</p>

<h2>Pasal 6 - Hak dan Kewajiban</h2>
<p>Hak dan kewajiban masing-masing pihak diatur sesuai dengan peraturan perusahaan dan perundang-undangan yang berlaku.</p>

<h2>Pasal 7 - Pemutusan Hubungan Kerja</h2>
<p>Perjanjian ini berakhir apabila jangka waktu perjanjian telah habis. Pemutusan hubungan kerja sebelum berakhirnya jangka waktu perjanjian diatur sesuai ketentuan perundang-undangan yang berlaku.</p>

<h2>Pasal 8 - Penyelesaian Perselisihan</h2>
<p>Segala perselisihan yang timbul akan diselesaikan secara musyawarah untuk mufakat. Apabila tidak tercapai kesepakatan, akan diselesaikan melalui mekanisme penyelesaian perselisihan hubungan industrial sesuai peraturan perundang-undangan.</p>

<p>Demikian perjanjian ini dibuat dalam rangkap 2 (dua) yang masing-masing mempunyai kekuatan hukum yang sama.</p>

<br/>
<table style="width:100%">
<tr>
<td style="text-align:center;width:50%"><strong>PIHAK PERTAMA</strong><br/><br/><br/><br/>{{nama_perwakilan}}</td>
<td style="text-align:center;width:50%"><strong>PIHAK KEDUA</strong><br/><br/><br/><br/>{{nama_karyawan}}</td>
</tr>
</table>`,
    template_schema: {
      steps: [
        {
          title: 'Informasi Kontrak',
          fields: [
            { name: 'nomor_kontrak', label: 'Nomor Kontrak', type: 'text', required: true },
            { name: 'tanggal', label: 'Tanggal Perjanjian', type: 'date', required: true },
            { name: 'tempat', label: 'Tempat Perjanjian', type: 'text', required: true },
          ],
        },
        {
          title: 'Informasi Perusahaan',
          fields: [
            { name: 'nama_perusahaan', label: 'Nama Perusahaan', type: 'text', required: true },
            { name: 'alamat_perusahaan', label: 'Alamat Perusahaan', type: 'textarea', required: true },
            { name: 'nama_perwakilan', label: 'Nama Perwakilan', type: 'text', required: true },
            { name: 'jabatan_perwakilan', label: 'Jabatan Perwakilan', type: 'text', required: true },
          ],
        },
        {
          title: 'Informasi Karyawan',
          fields: [
            { name: 'nama_karyawan', label: 'Nama Karyawan', type: 'text', required: true },
            { name: 'ttl_karyawan', label: 'Tempat/Tanggal Lahir', type: 'text', required: true },
            { name: 'alamat_karyawan', label: 'Alamat Karyawan', type: 'textarea', required: true },
            { name: 'no_ktp', label: 'Nomor KTP', type: 'text', required: true },
          ],
        },
        {
          title: 'Detail Pekerjaan',
          fields: [
            { name: 'jabatan', label: 'Jabatan', type: 'text', required: true },
            { name: 'departemen', label: 'Departemen', type: 'text', required: true },
            { name: 'durasi_kontrak', label: 'Durasi Kontrak', type: 'text', required: true },
            { name: 'tanggal_mulai', label: 'Tanggal Mulai', type: 'date', required: true },
            { name: 'tanggal_selesai', label: 'Tanggal Selesai', type: 'date', required: true },
            { name: 'jam_kerja', label: 'Jam Kerja', type: 'textarea', required: true },
          ],
        },
        {
          title: 'Kompensasi',
          fields: [
            { name: 'gaji_pokok', label: 'Gaji Pokok (Rp)', type: 'number', required: true },
            { name: 'tunjangan', label: 'Tunjangan', type: 'textarea', required: false },
            { name: 'tanggal_gajian', label: 'Tanggal Gajian', type: 'number', required: true },
          ],
        },
      ],
    },
  },
  {
    name: 'Perjanjian Kerja Waktu Tidak Tertentu (PKWTT)',
    contract_type: ContractType.PKWTT,
    template_html: `<h1 style="text-align:center;">PERJANJIAN KERJA WAKTU TIDAK TERTENTU</h1>
<p style="text-align:center;">Nomor: {{nomor_kontrak}}</p>
<br/>
<p>Pada hari ini {{tanggal}}, bertempat di {{tempat}}, yang bertanda tangan di bawah ini:</p>

<p><strong>PIHAK PERTAMA (Pemberi Kerja):</strong></p>
<table>
<tr><td>Nama Perusahaan</td><td>: {{nama_perusahaan}}</td></tr>
<tr><td>Alamat</td><td>: {{alamat_perusahaan}}</td></tr>
<tr><td>Diwakili oleh</td><td>: {{nama_perwakilan}}</td></tr>
<tr><td>Jabatan</td><td>: {{jabatan_perwakilan}}</td></tr>
</table>

<p><strong>PIHAK KEDUA (Pekerja):</strong></p>
<table>
<tr><td>Nama</td><td>: {{nama_karyawan}}</td></tr>
<tr><td>Tempat/Tgl Lahir</td><td>: {{ttl_karyawan}}</td></tr>
<tr><td>Alamat</td><td>: {{alamat_karyawan}}</td></tr>
<tr><td>No. KTP</td><td>: {{no_ktp}}</td></tr>
</table>

<p>Kedua belah pihak sepakat untuk mengadakan Perjanjian Kerja Waktu Tidak Tertentu (PKWTT) dengan ketentuan sebagai berikut:</p>

<h2>Pasal 1 - Ruang Lingkup Pekerjaan</h2>
<p>PIHAK PERTAMA mempekerjakan PIHAK KEDUA sebagai <strong>{{jabatan}}</strong> di departemen <strong>{{departemen}}</strong>.</p>

<h2>Pasal 2 - Masa Percobaan</h2>
<p>PIHAK KEDUA wajib menjalani masa percobaan selama <strong>{{masa_percobaan}}</strong> terhitung sejak tanggal <strong>{{tanggal_mulai}}</strong>. Selama masa percobaan, masing-masing pihak dapat mengakhiri perjanjian ini tanpa syarat apapun.</p>

<h2>Pasal 3 - Waktu Kerja</h2>
<p>{{jam_kerja}}</p>

<h2>Pasal 4 - Kompensasi</h2>
<ul>
<li>Gaji Pokok: Rp {{gaji_pokok}} per bulan</li>
<li>Tunjangan: {{tunjangan}}</li>
</ul>
<p>Gaji dibayarkan setiap tanggal {{tanggal_gajian}} setiap bulannya.</p>

<h2>Pasal 5 - Cuti</h2>
<p>PIHAK KEDUA berhak atas cuti tahunan selama <strong>{{jumlah_cuti}}</strong> hari kerja setelah bekerja selama 12 bulan berturut-turut.</p>

<h2>Pasal 6 - Pemutusan Hubungan Kerja</h2>
<p>Pemutusan hubungan kerja dilaksanakan sesuai dengan ketentuan perundang-undangan yang berlaku dengan pemberitahuan tertulis sekurang-kurangnya 30 hari sebelumnya.</p>

<h2>Pasal 7 - Penyelesaian Perselisihan</h2>
<p>Segala perselisihan diselesaikan secara musyawarah. Apabila tidak tercapai kesepakatan, diselesaikan melalui mekanisme penyelesaian perselisihan hubungan industrial.</p>

<p>Demikian perjanjian ini dibuat dalam rangkap 2 (dua) yang masing-masing mempunyai kekuatan hukum yang sama.</p>

<br/>
<table style="width:100%">
<tr>
<td style="text-align:center;width:50%"><strong>PIHAK PERTAMA</strong><br/><br/><br/><br/>{{nama_perwakilan}}</td>
<td style="text-align:center;width:50%"><strong>PIHAK KEDUA</strong><br/><br/><br/><br/>{{nama_karyawan}}</td>
</tr>
</table>`,
    template_schema: {
      steps: [
        {
          title: 'Informasi Kontrak',
          fields: [
            { name: 'nomor_kontrak', label: 'Nomor Kontrak', type: 'text', required: true },
            { name: 'tanggal', label: 'Tanggal Perjanjian', type: 'date', required: true },
            { name: 'tempat', label: 'Tempat Perjanjian', type: 'text', required: true },
          ],
        },
        {
          title: 'Informasi Perusahaan',
          fields: [
            { name: 'nama_perusahaan', label: 'Nama Perusahaan', type: 'text', required: true },
            { name: 'alamat_perusahaan', label: 'Alamat Perusahaan', type: 'textarea', required: true },
            { name: 'nama_perwakilan', label: 'Nama Perwakilan', type: 'text', required: true },
            { name: 'jabatan_perwakilan', label: 'Jabatan Perwakilan', type: 'text', required: true },
          ],
        },
        {
          title: 'Informasi Karyawan',
          fields: [
            { name: 'nama_karyawan', label: 'Nama Karyawan', type: 'text', required: true },
            { name: 'ttl_karyawan', label: 'Tempat/Tanggal Lahir', type: 'text', required: true },
            { name: 'alamat_karyawan', label: 'Alamat Karyawan', type: 'textarea', required: true },
            { name: 'no_ktp', label: 'Nomor KTP', type: 'text', required: true },
          ],
        },
        {
          title: 'Detail Pekerjaan',
          fields: [
            { name: 'jabatan', label: 'Jabatan', type: 'text', required: true },
            { name: 'departemen', label: 'Departemen', type: 'text', required: true },
            { name: 'tanggal_mulai', label: 'Tanggal Mulai Kerja', type: 'date', required: true },
            { name: 'masa_percobaan', label: 'Masa Percobaan (misal: 3 bulan)', type: 'text', required: true },
            { name: 'jam_kerja', label: 'Jam Kerja', type: 'textarea', required: true },
          ],
        },
        {
          title: 'Kompensasi & Cuti',
          fields: [
            { name: 'gaji_pokok', label: 'Gaji Pokok (Rp)', type: 'number', required: true },
            { name: 'tunjangan', label: 'Tunjangan', type: 'textarea', required: false },
            { name: 'tanggal_gajian', label: 'Tanggal Gajian', type: 'number', required: true },
            { name: 'jumlah_cuti', label: 'Jumlah Cuti Tahunan (hari)', type: 'number', required: true },
          ],
        },
      ],
    },
  },
  {
    name: 'Perjanjian Kerja Freelance',
    contract_type: ContractType.Freelance,
    template_html: `<h1 style="text-align:center;">PERJANJIAN KERJA LEPAS (FREELANCE)</h1>
<p style="text-align:center;">Nomor: {{nomor_kontrak}}</p>
<br/>
<p>Pada hari ini {{tanggal}}, bertempat di {{tempat}}, yang bertanda tangan di bawah ini:</p>

<p><strong>PIHAK PERTAMA (Pemberi Kerja):</strong></p>
<table>
<tr><td>Nama</td><td>: {{nama_pemberi_kerja}}</td></tr>
<tr><td>Perusahaan</td><td>: {{nama_perusahaan}}</td></tr>
<tr><td>Alamat</td><td>: {{alamat_pemberi_kerja}}</td></tr>
</table>

<p><strong>PIHAK KEDUA (Pekerja Lepas):</strong></p>
<table>
<tr><td>Nama</td><td>: {{nama_freelancer}}</td></tr>
<tr><td>Alamat</td><td>: {{alamat_freelancer}}</td></tr>
<tr><td>No. KTP</td><td>: {{no_ktp}}</td></tr>
</table>

<p>Kedua belah pihak sepakat untuk mengadakan Perjanjian Kerja Lepas dengan ketentuan sebagai berikut:</p>

<h2>Pasal 1 - Lingkup Pekerjaan</h2>
<p>PIHAK KEDUA setuju untuk melaksanakan pekerjaan berupa: <strong>{{deskripsi_pekerjaan}}</strong></p>
<p>Dengan deliverables sebagai berikut:</p>
<p>{{deliverables}}</p>

<h2>Pasal 2 - Jangka Waktu</h2>
<p>Pekerjaan dimulai pada tanggal <strong>{{tanggal_mulai}}</strong> dan harus diselesaikan selambat-lambatnya pada tanggal <strong>{{tanggal_selesai}}</strong>.</p>

<h2>Pasal 3 - Kompensasi</h2>
<p>PIHAK PERTAMA akan membayar PIHAK KEDUA sebesar <strong>Rp {{nilai_kontrak}}</strong> dengan skema pembayaran sebagai berikut:</p>
<p>{{skema_pembayaran}}</p>

<h2>Pasal 4 - Hak Kekayaan Intelektual</h2>
<p>Seluruh hasil pekerjaan yang dibuat oleh PIHAK KEDUA dalam rangka pelaksanaan perjanjian ini menjadi milik PIHAK PERTAMA sepenuhnya setelah pembayaran lunas diterima.</p>

<h2>Pasal 5 - Kerahasiaan</h2>
<p>PIHAK KEDUA wajib menjaga kerahasiaan seluruh informasi yang diperoleh selama pelaksanaan pekerjaan dan tidak akan mengungkapkan kepada pihak ketiga manapun.</p>

<h2>Pasal 6 - Pemutusan Perjanjian</h2>
<p>Masing-masing pihak dapat mengakhiri perjanjian ini dengan pemberitahuan tertulis <strong>{{notice_period}}</strong> sebelumnya. Pekerjaan yang telah diselesaikan tetap wajib dibayar secara proporsional.</p>

<h2>Pasal 7 - Penyelesaian Sengketa</h2>
<p>Segala sengketa diselesaikan secara musyawarah. Apabila tidak tercapai kesepakatan, akan diselesaikan melalui Pengadilan Negeri {{kota_pengadilan}}.</p>

<p>Demikian perjanjian ini dibuat dan ditandatangani oleh kedua belah pihak dalam keadaan sadar tanpa paksaan.</p>

<br/>
<table style="width:100%">
<tr>
<td style="text-align:center;width:50%"><strong>PIHAK PERTAMA</strong><br/><br/><br/><br/>{{nama_pemberi_kerja}}</td>
<td style="text-align:center;width:50%"><strong>PIHAK KEDUA</strong><br/><br/><br/><br/>{{nama_freelancer}}</td>
</tr>
</table>`,
    template_schema: {
      steps: [
        {
          title: 'Informasi Kontrak',
          fields: [
            { name: 'nomor_kontrak', label: 'Nomor Kontrak', type: 'text', required: true },
            { name: 'tanggal', label: 'Tanggal Perjanjian', type: 'date', required: true },
            { name: 'tempat', label: 'Tempat Perjanjian', type: 'text', required: true },
          ],
        },
        {
          title: 'Informasi Pemberi Kerja',
          fields: [
            { name: 'nama_pemberi_kerja', label: 'Nama Pemberi Kerja', type: 'text', required: true },
            { name: 'nama_perusahaan', label: 'Nama Perusahaan', type: 'text', required: true },
            { name: 'alamat_pemberi_kerja', label: 'Alamat', type: 'textarea', required: true },
          ],
        },
        {
          title: 'Informasi Freelancer',
          fields: [
            { name: 'nama_freelancer', label: 'Nama Freelancer', type: 'text', required: true },
            { name: 'alamat_freelancer', label: 'Alamat Freelancer', type: 'textarea', required: true },
            { name: 'no_ktp', label: 'Nomor KTP', type: 'text', required: true },
          ],
        },
        {
          title: 'Detail Pekerjaan',
          fields: [
            { name: 'deskripsi_pekerjaan', label: 'Deskripsi Pekerjaan', type: 'textarea', required: true },
            { name: 'deliverables', label: 'Deliverables', type: 'textarea', required: true },
            { name: 'tanggal_mulai', label: 'Tanggal Mulai', type: 'date', required: true },
            { name: 'tanggal_selesai', label: 'Tanggal Selesai', type: 'date', required: true },
          ],
        },
        {
          title: 'Pembayaran & Ketentuan',
          fields: [
            { name: 'nilai_kontrak', label: 'Nilai Kontrak (Rp)', type: 'number', required: true },
            { name: 'skema_pembayaran', label: 'Skema Pembayaran', type: 'textarea', required: true },
            { name: 'notice_period', label: 'Periode Pemberitahuan Pembatalan', type: 'text', required: true },
            { name: 'kota_pengadilan', label: 'Kota Pengadilan', type: 'text', required: true },
          ],
        },
      ],
    },
  },
  {
    name: 'Perjanjian Kerahasiaan (NDA)',
    contract_type: ContractType.NDA,
    template_html: `<h1 style="text-align:center;">PERJANJIAN KERAHASIAAN</h1>
<p style="text-align:center;">(Non-Disclosure Agreement)</p>
<p style="text-align:center;">Nomor: {{nomor_kontrak}}</p>
<br/>
<p>Pada hari ini {{tanggal}}, bertempat di {{tempat}}, yang bertanda tangan di bawah ini:</p>

<p><strong>PIHAK PERTAMA (Pengungkap Informasi):</strong></p>
<table>
<tr><td>Nama</td><td>: {{nama_pihak_pertama}}</td></tr>
<tr><td>Perusahaan</td><td>: {{perusahaan_pihak_pertama}}</td></tr>
<tr><td>Alamat</td><td>: {{alamat_pihak_pertama}}</td></tr>
</table>

<p><strong>PIHAK KEDUA (Penerima Informasi):</strong></p>
<table>
<tr><td>Nama</td><td>: {{nama_pihak_kedua}}</td></tr>
<tr><td>Perusahaan</td><td>: {{perusahaan_pihak_kedua}}</td></tr>
<tr><td>Alamat</td><td>: {{alamat_pihak_kedua}}</td></tr>
</table>

<p>Kedua belah pihak sepakat untuk mengikatkan diri dalam Perjanjian Kerahasiaan ini dengan ketentuan sebagai berikut:</p>

<h2>Pasal 1 - Definisi Informasi Rahasia</h2>
<p>Informasi Rahasia mencakup seluruh informasi yang diungkapkan oleh PIHAK PERTAMA kepada PIHAK KEDUA, baik secara lisan, tertulis, maupun elektronik, termasuk namun tidak terbatas pada:</p>
<p>{{definisi_informasi_rahasia}}</p>

<h2>Pasal 2 - Kewajiban Kerahasiaan</h2>
<p>PIHAK KEDUA berkewajiban untuk:</p>
<ol>
<li>Menjaga kerahasiaan seluruh Informasi Rahasia;</li>
<li>Tidak mengungkapkan Informasi Rahasia kepada pihak ketiga tanpa persetujuan tertulis dari PIHAK PERTAMA;</li>
<li>Menggunakan Informasi Rahasia hanya untuk tujuan {{tujuan_penggunaan}};</li>
<li>Mengambil langkah-langkah yang wajar untuk melindungi kerahasiaan informasi.</li>
</ol>

<h2>Pasal 3 - Pengecualian</h2>
<p>Kewajiban kerahasiaan tidak berlaku untuk informasi yang: (a) telah menjadi milik umum bukan karena pelanggaran perjanjian ini; (b) telah dimiliki PIHAK KEDUA sebelum pengungkapan; (c) diperoleh secara sah dari pihak ketiga; (d) diwajibkan diungkapkan oleh hukum atau perintah pengadilan.</p>

<h2>Pasal 4 - Jangka Waktu</h2>
<p>Perjanjian ini berlaku selama <strong>{{durasi_perjanjian}}</strong> terhitung sejak tanggal penandatanganan. Kewajiban kerahasiaan tetap berlaku selama <strong>{{durasi_kerahasiaan}}</strong> setelah berakhirnya perjanjian ini.</p>

<h2>Pasal 5 - Pengembalian Informasi</h2>
<p>Setelah berakhirnya perjanjian ini, PIHAK KEDUA wajib mengembalikan atau memusnahkan seluruh salinan Informasi Rahasia dalam waktu {{waktu_pengembalian}} hari kerja.</p>

<h2>Pasal 6 - Ganti Rugi</h2>
<p>PIHAK KEDUA bertanggung jawab atas segala kerugian yang timbul akibat pelanggaran perjanjian ini dan wajib memberikan ganti rugi kepada PIHAK PERTAMA.</p>

<h2>Pasal 7 - Hukum yang Berlaku</h2>
<p>Perjanjian ini tunduk pada hukum Negara Republik Indonesia. Segala sengketa diselesaikan melalui Pengadilan Negeri {{kota_pengadilan}}.</p>

<p>Demikian perjanjian ini dibuat dan ditandatangani dalam keadaan sadar dan tanpa paksaan dari pihak manapun.</p>

<br/>
<table style="width:100%">
<tr>
<td style="text-align:center;width:50%"><strong>PIHAK PERTAMA</strong><br/><br/><br/><br/>{{nama_pihak_pertama}}</td>
<td style="text-align:center;width:50%"><strong>PIHAK KEDUA</strong><br/><br/><br/><br/>{{nama_pihak_kedua}}</td>
</tr>
</table>`,
    template_schema: {
      steps: [
        {
          title: 'Informasi Kontrak',
          fields: [
            { name: 'nomor_kontrak', label: 'Nomor Kontrak', type: 'text', required: true },
            { name: 'tanggal', label: 'Tanggal Perjanjian', type: 'date', required: true },
            { name: 'tempat', label: 'Tempat Perjanjian', type: 'text', required: true },
          ],
        },
        {
          title: 'Pihak Pertama (Pengungkap)',
          fields: [
            { name: 'nama_pihak_pertama', label: 'Nama', type: 'text', required: true },
            { name: 'perusahaan_pihak_pertama', label: 'Perusahaan', type: 'text', required: true },
            { name: 'alamat_pihak_pertama', label: 'Alamat', type: 'textarea', required: true },
          ],
        },
        {
          title: 'Pihak Kedua (Penerima)',
          fields: [
            { name: 'nama_pihak_kedua', label: 'Nama', type: 'text', required: true },
            { name: 'perusahaan_pihak_kedua', label: 'Perusahaan', type: 'text', required: true },
            { name: 'alamat_pihak_kedua', label: 'Alamat', type: 'textarea', required: true },
          ],
        },
        {
          title: 'Detail Kerahasiaan',
          fields: [
            { name: 'definisi_informasi_rahasia', label: 'Definisi Informasi Rahasia', type: 'textarea', required: true },
            { name: 'tujuan_penggunaan', label: 'Tujuan Penggunaan Informasi', type: 'textarea', required: true },
          ],
        },
        {
          title: 'Jangka Waktu & Ketentuan',
          fields: [
            { name: 'durasi_perjanjian', label: 'Durasi Perjanjian', type: 'text', required: true },
            { name: 'durasi_kerahasiaan', label: 'Durasi Kewajiban Kerahasiaan Setelah Berakhir', type: 'text', required: true },
            { name: 'waktu_pengembalian', label: 'Waktu Pengembalian Informasi (hari kerja)', type: 'number', required: true },
            { name: 'kota_pengadilan', label: 'Kota Pengadilan', type: 'text', required: true },
          ],
        },
      ],
    },
  },
];

const clauses = [
  {
    title: 'Kerahasiaan (Confidentiality)',
    description: 'Klausul yang mengatur kewajiban para pihak untuk menjaga kerahasiaan informasi.',
    clause_text: `Para Pihak sepakat untuk menjaga kerahasiaan seluruh informasi yang diperoleh sehubungan dengan pelaksanaan Perjanjian ini. Informasi rahasia mencakup namun tidak terbatas pada data keuangan, strategi bisnis, informasi pelanggan, dan rahasia dagang. Kewajiban kerahasiaan ini berlaku selama jangka waktu Perjanjian dan 2 (dua) tahun setelah berakhirnya Perjanjian ini. Pelanggaran atas ketentuan kerahasiaan ini dapat mengakibatkan tuntutan ganti rugi dan/atau pemutusan Perjanjian secara sepihak.`,
    contract_type: null,
  },
  {
    title: 'Non-Kompetisi (Non-Compete)',
    description: 'Klausul yang membatasi pihak untuk tidak bersaing secara langsung selama dan setelah perjanjian.',
    clause_text: `PIHAK KEDUA setuju bahwa selama masa berlakunya Perjanjian ini dan selama 1 (satu) tahun setelah berakhirnya Perjanjian, PIHAK KEDUA tidak akan, baik secara langsung maupun tidak langsung: (a) bekerja pada atau memberikan jasa kepada perusahaan pesaing dalam industri yang sama; (b) mendirikan usaha yang bersaing secara langsung dengan PIHAK PERTAMA; (c) mengajak atau membujuk karyawan PIHAK PERTAMA untuk meninggalkan pekerjaannya. Pelanggaran atas klausul ini akan dikenakan denda sebesar yang disepakati dalam Perjanjian.`,
    contract_type: ContractType.PKWT,
  },
  {
    title: 'Pemutusan Hubungan Kerja (Termination)',
    description: 'Klausul yang mengatur mekanisme dan konsekuensi pemutusan hubungan kerja.',
    clause_text: `Pemutusan hubungan kerja dapat dilakukan dengan ketentuan sebagai berikut: (1) Perjanjian berakhir secara otomatis apabila jangka waktu yang diperjanjikan telah habis; (2) Salah satu pihak dapat mengakhiri Perjanjian sebelum waktunya dengan pemberitahuan tertulis sekurang-kurangnya 30 (tiga puluh) hari sebelumnya; (3) Pemutusan hubungan kerja karena pelanggaran berat dapat dilakukan tanpa pemberitahuan terlebih dahulu sesuai ketentuan perundang-undangan; (4) Dalam hal pemutusan hubungan kerja, PIHAK PERTAMA wajib membayar hak-hak PIHAK KEDUA sesuai ketentuan Undang-Undang Ketenagakerjaan yang berlaku.`,
    contract_type: ContractType.PKWT,
  },
  {
    title: 'Penyelesaian Sengketa (Dispute Resolution)',
    description: 'Klausul yang mengatur mekanisme penyelesaian perselisihan antara para pihak.',
    clause_text: `Apabila terjadi perselisihan dalam pelaksanaan Perjanjian ini, Para Pihak sepakat untuk menyelesaikannya dengan cara sebagai berikut: (1) Musyawarah untuk mufakat dalam waktu 30 (tiga puluh) hari kalender sejak salah satu pihak menyampaikan pemberitahuan tertulis mengenai adanya perselisihan; (2) Apabila musyawarah tidak mencapai kesepakatan, Para Pihak sepakat untuk menyelesaikan melalui mediasi di hadapan mediator yang disepakati bersama; (3) Apabila mediasi tidak berhasil, perselisihan akan diselesaikan melalui Pengadilan Hubungan Industrial yang berwenang sesuai domisili PIHAK PERTAMA.`,
    contract_type: null,
  },
  {
    title: 'Force Majeure',
    description: 'Klausul yang mengatur keadaan kahar atau keadaan memaksa di luar kendali para pihak.',
    clause_text: `Para Pihak dibebaskan dari tanggung jawab atas keterlambatan atau kegagalan dalam melaksanakan kewajiban berdasarkan Perjanjian ini yang disebabkan oleh keadaan kahar (force majeure), termasuk namun tidak terbatas pada: bencana alam, peperangan, huru-hara, epidemi/pandemi, kebakaran, banjir, gempa bumi, pemogokan massal, kebijakan pemerintah yang secara langsung mempengaruhi pelaksanaan Perjanjian. Pihak yang mengalami force majeure wajib memberitahukan secara tertulis kepada pihak lainnya dalam waktu 7 (tujuh) hari kalender sejak terjadinya force majeure disertai bukti-bukti yang sah. Apabila force majeure berlangsung lebih dari 90 (sembilan puluh) hari, masing-masing pihak berhak mengakhiri Perjanjian ini tanpa kewajiban ganti rugi.`,
    contract_type: null,
  },
  {
    title: 'Hak Kekayaan Intelektual (Intellectual Property)',
    description: 'Klausul yang mengatur kepemilikan dan penggunaan hak kekayaan intelektual.',
    clause_text: `Seluruh hak kekayaan intelektual yang dihasilkan oleh PIHAK KEDUA dalam rangka pelaksanaan Perjanjian ini, termasuk namun tidak terbatas pada hak cipta, paten, merek dagang, desain industri, rahasia dagang, dan karya intelektual lainnya, menjadi milik sepenuhnya PIHAK PERTAMA. PIHAK KEDUA dengan ini menyerahkan seluruh hak, kepemilikan, dan kepentingan atas hasil karya tersebut kepada PIHAK PERTAMA. PIHAK KEDUA tidak berhak menggunakan, memperbanyak, atau mendistribusikan hasil karya tersebut tanpa persetujuan tertulis dari PIHAK PERTAMA.`,
    contract_type: ContractType.Freelance,
  },
  {
    title: 'Ganti Rugi (Indemnification)',
    description: 'Klausul yang mengatur kewajiban ganti rugi apabila terjadi pelanggaran perjanjian.',
    clause_text: `Masing-masing Pihak setuju untuk memberikan ganti rugi, membela, dan membebaskan Pihak lainnya dari dan terhadap segala klaim, tuntutan, kerugian, biaya, dan pengeluaran (termasuk biaya pengacara yang wajar) yang timbul dari atau sehubungan dengan: (a) pelanggaran terhadap ketentuan Perjanjian ini; (b) kelalaian atau kesalahan yang disengaja dalam pelaksanaan kewajiban; (c) pelanggaran terhadap hak kekayaan intelektual pihak ketiga; (d) pelanggaran terhadap peraturan perundang-undangan yang berlaku. Kewajiban ganti rugi ini tetap berlaku meskipun Perjanjian telah berakhir.`,
    contract_type: null,
  },
  {
    title: 'Jam Kerja (Working Hours)',
    description: 'Klausul yang mengatur waktu kerja, lembur, dan hari istirahat karyawan.',
    clause_text: `PIHAK KEDUA bersedia untuk bekerja dengan ketentuan waktu kerja sebagai berikut: (1) Waktu kerja normal adalah 8 (delapan) jam sehari dan 40 (empat puluh) jam seminggu untuk 5 (lima) hari kerja, atau 7 (tujuh) jam sehari dan 40 (empat puluh) jam seminggu untuk 6 (enam) hari kerja; (2) Apabila PIHAK PERTAMA memerlukan PIHAK KEDUA untuk bekerja melebihi waktu kerja normal, maka PIHAK KEDUA berhak atas upah lembur sesuai ketentuan perundang-undangan yang berlaku; (3) PIHAK KEDUA berhak atas istirahat mingguan selama 1 (satu) hari untuk 6 hari kerja atau 2 (dua) hari untuk 5 hari kerja dalam seminggu; (4) PIHAK KEDUA berhak atas hari libur resmi nasional yang ditetapkan oleh Pemerintah.`,
    contract_type: ContractType.PKWTT,
  },
];

async function main() {
  console.log('Seeding document templates...');
  await prisma.documentTemplate.deleteMany();
  for (const t of templates) {
    await prisma.documentTemplate.create({ data: t });
  }
  console.log(`Seeded ${templates.length} templates.`);

  console.log('Seeding clauses library...');
  await prisma.clausesLibrary.deleteMany();
  for (const c of clauses) {
    await prisma.clausesLibrary.create({ data: c });
  }
  console.log(`Seeded ${clauses.length} clauses.`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
