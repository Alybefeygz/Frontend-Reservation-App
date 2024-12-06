
const toggleSidebar = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('overlay');
const content = document.getElementById('content');
const navbar = document.querySelector('.navbar'); // Navbar'ı seç

let currentId = 1;
let editingRow = null; // Düzenleme için kullanılan değişken
let reservationsList = []; // Verilerin saklanacağı liste

const rowsPerPage = 5;
let currentPage = 1;

toggleSidebar.addEventListener('click', () => {
        sidebar.classList.toggle('open'); // Sidebar'ı aç/kapa
        overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none'; // Overlay'i aç/kapa
        
        // İçeriği ve navbar'ı sağa kaydır
        const marginValue = sidebar.classList.contains('open') ? '250px' : '0';
        content.style.marginLeft = marginValue;
        navbar.style.marginLeft = marginValue; // Navbar'ı da kaydır

        // Toggle butonunu gizle/göster
        toggleSidebar.style.display = sidebar.classList.contains('open') ? 'none' : 'block';
});

closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.style.display = 'none'; // Overlay'i gizle
        content.style.marginLeft = '0'; // İçeriği geri kaydır
        navbar.style.marginLeft = '0'; // Navbar'ı geri kaydır
        
        // Toggle butonunu gizle/göster
        toggleSidebar.style.display = 'block'; // Toggle butonunu göster
});

overlay.addEventListener('click', () => {
        sidebar.classList.remove('open'); // Sidebar'ı kapat
        overlay.style.display = 'none'; // Overlay'i gizle
        content.style.marginLeft = '0'; // İçeriği geri kaydır
        navbar.style.marginLeft = '0'; // Navbar'ı geri kaydır
        
        // Toggle butonunu gizle/göster
        toggleSidebar.style.display = 'block'; // Toggle butonunu göster
});

// Kaydet butonuna tıklandığında çalışacak fonksiyon
document.getElementById('btnReservationSave').addEventListener('click', function () {
    // Giriş alanlarından verileri al
    const reservationData = {
        id: currentId,
        customerName: document.getElementById('costumerName').value,
        fromWhere: document.getElementById('fromWhere').value,
        where: document.getElementById('where').value,
        transport: document.getElementById('transport').value,
        date: document.getElementById('date').value,
        clock: document.getElementById('clock').value,
        topAmount: document.getElementById('topAmount').value,
        idNo: document.getElementById('idNo').value,
        flightCode: document.getElementById('flightCode').value,
        driver: document.getElementById('driver').value,
        driverType: document.getElementById('driverType').value,
        remainAmount: document.getElementById('remainAmount').value,
        status: "Onaylanmadı" // Varsayılan durum
    };

    // Eğer düzenleme modundaysak
    if (editingRow) {
        const rowIndex = reservationsList.findIndex(res => res.id == editingRow.children[0].textContent);
        reservationData.id = reservationsList[rowIndex].id; // ID'yi koru
        reservationsList[rowIndex] = reservationData; // Listeyi güncelle

        // Satırı güncelle
        updateTableRow(editingRow, reservationData);
        editingRow = null; // Düzenleme işlemini sonlandır
    } else {
        reservationsList.push(reservationData); // Listeye yeni veri ekle

        // Yeni satır oluştur
        const newRow = document.createElement('tr');
        updateTableRow(newRow, reservationData);

        // Tablonun body kısmının sonuna yeni satırı ekle
        const tableBody = document.getElementById('tableBody');
        tableBody.insertBefore(newRow, tableBody.firstChild); // Yeni satırı en başa ekleyin

        // ID sayacını bir artır
        currentId++;
    }

    // Giriş alanlarını temizle
    clearInputs();

    // Collapse alanını kapat
    const collapseElement = document.getElementById('collapseExample');
    const collapseInstance = bootstrap.Collapse.getInstance(collapseElement);
    if (collapseInstance) {
        collapseInstance.hide(); // Collapse'ı kapat
    } else {
        bootstrap.Collapse.getOrCreateInstance(collapseElement).hide(); // Collapse'ı kapat
    }

    // Tabloyu güncelle
    displayTable(currentPage);
});

// Satırı güncelleyen yardımcı fonksiyon
function updateTableRow(row, data) {
        row.innerHTML = `
            <td>${data.id}</td>
            <td>${data.customerName}</td>
            <td>${data.fromWhere}</td>
            <td>${data.where}</td>
            <td>${data.transport}</td>
            <td>${data.date}</td>
            <td>${data.clock}</td>
            <td>${data.topAmount}</td>
            <td>${data.idNo}</td>
            <td>${data.flightCode}</td>
            <td>${data.driver}</td>
            <td>${data.driverType}</td>
            <td>${data.remainAmount}</td>
            <td>
                <select class="form-select" onchange="updateStatus(this, ${data.id})">
                    <option value="Onaylandı" ${data.status === 'Onaylandı' ? 'selected' : ''}>Onaylandı</option>
                    <option value="Onaylanmadı" ${data.status === 'Onaylanmadı' ? 'selected' : ''}>Onaylanmadı</option>
                </select>
            </td>
            <td>
                <a href="javascript:void(0);" onclick="editRow(this)"><i class="fa-solid fa-pen-to-square text-primary"></i></a>
                <a href="javascript:void(0);" onclick="deleteRow(this)"><i class="fa-solid fa-trash text-danger"></i></a>
                <a href="javascript:void(0);" onclick="whatsappContact(this)"><i class="fa-brands fa-whatsapp text-success"></i></a>
            </td>
        `;
}

// Satırı silmek için fonksiyon
function deleteRow(button) {
        const row = button.closest('tr'); // Butonun bulunduğu satırı al
        if (row) {
            const id = row.children[0].textContent;
            // Listeden sil
            reservationsList = reservationsList.filter(res => res.id != id);
            row.parentNode.removeChild(row); // Satırı sil
            displayTable(currentPage); // Tabloyu güncelle
        }
}

// Satırı düzenlemek için fonksiyon
function editRow(button) {
        const row = button.closest('tr'); // Butonun bulunduğu satırı al
        editingRow = row; // Düzenlemek için satırı ayarla
        const id = row.children[0].textContent;
        const reservationData = reservationsList.find(res => res.id == id); // Listeden veriyi al

        // Değerleri giriş alanlarına yerleştir
        document.getElementById('costumerName').value = reservationData.customerName;
        document.getElementById('fromWhere').value = reservationData.fromWhere;
        document.getElementById('where').value = reservationData.where;
        document.getElementById('transport').value = reservationData.transport;
        document.getElementById('date').value = reservationData.date;
        document.getElementById('clock').value = reservationData.clock;
        document.getElementById('topAmount').value = reservationData.topAmount;
        document.getElementById('idNo').value = reservationData.idNo;
        document.getElementById('flightCode').value = reservationData.flightCode;
        document.getElementById('driver').value = reservationData.driver;
        document.getElementById('driverType').value = reservationData.driverType;
        document.getElementById('remainAmount').value = reservationData.remainAmount;

        // Collapse alanını aç
        const collapseElement = document.getElementById('collapseExample');
        const collapseInstance = bootstrap.Collapse.getInstance(collapseElement);
        if (!collapseInstance) {
            bootstrap.Collapse.getOrCreateInstance(collapseElement).show(); // Collapse'ı aç
        } else {
            collapseInstance.show(); // Collapse'ı aç
        }
}

// Giriş alanlarını temizle
function clearInputs() {
        document.getElementById('costumerName').value = '';
        document.getElementById('fromWhere').value = '';
        document.getElementById('where').value = '';
        document.getElementById('transport').value = '';
        document.getElementById('date').value = '';
        document.getElementById('clock').value = '';
        document.getElementById('topAmount').value = '';
        document.getElementById('idNo').value = '';
        document.getElementById('flightCode').value = '';
        document.getElementById('driver').value = '';
        document.getElementById('driverType').value = '';
        document.getElementById('remainAmount').value = '';
}

// WhatsApp ile iletişim kurma (örnek olarak eklenmiştir, kullanmıyorsanız kaldırabilirsiniz)
function whatsappContact(button) {
        // İletişim için WhatsApp bağlantısı veya işlemleri burada yapılabilir
}

function displayTable(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = reservationsList.slice(start, end); // reservationsList kullanılmalı

        const tableBody = document.querySelector("#tableBody");
        tableBody.innerHTML = "";

        paginatedData.forEach(row => {
            const tr = document.createElement("tr");
            updateTableRow(tr, row);
            tableBody.appendChild(tr);
        });

        updatePagination();
}

function updatePagination() {
        const totalRows = reservationsList.length; // reservationsList kullanılmalı
        const totalPages = Math.ceil(totalRows / rowsPerPage);

        // Pagination 1
        document.getElementById("totalRows1").textContent = totalRows;
        document.getElementById("totalPages1").textContent = totalPages;
        document.getElementById("gotoPageInput1").value = currentPage;

        // Pagination 2
        document.getElementById("totalRows2").textContent = totalRows;
        document.getElementById("totalPages2").textContent = totalPages;
        document.getElementById("gotoPageInput2").value = currentPage;
}

function updateStatus(select, id) {
        const selectedValue = select.value;
        const rowIndex = reservationsList.findIndex(res => res.id == id);
        if (rowIndex !== -1) {
            reservationsList[rowIndex].status = selectedValue; // Durumu güncelle
        }
}

// Sayfa değiştirme fonksiyonları
function nextPage() {
        const totalPages = Math.ceil(reservationsList.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayTable(currentPage);
        }
}

function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            displayTable(currentPage);
        }
}

function gotoPage() {
        const pageInput = document.getElementById("gotoPageInput1").value || document.getElementById("gotoPageInput2").value;
        const page = parseInt(pageInput, 10);
        const totalPages = Math.ceil(reservationsList.length / rowsPerPage);
        if (page > 0 && page <= totalPages) {
            currentPage = page;
            displayTable(currentPage);
        }
}

// Pagination butonlarına tıklama olayları
document.getElementById('firstPage1').addEventListener('click', function(event) {
        event.preventDefault();
        currentPage = 1; // İlk sayfaya git
        displayTable(currentPage);
});

document.getElementById('prevPage1').addEventListener('click', function(event) {
        event.preventDefault();
        prevPage(); // Önceki sayfaya git
});

document.getElementById('nextPage1').addEventListener('click', function(event) {
        event.preventDefault();
        nextPage(); // Sonraki sayfaya git
});

document.getElementById('lastPage1').addEventListener('click', function(event) {
        event.preventDefault();
        currentPage = Math.ceil(reservationsList.length / rowsPerPage); // Son sayfaya git
        displayTable(currentPage);
});

document.getElementById('gotoPageForm1').addEventListener('submit', function(event) {
        event.preventDefault();
        gotoPage(); // Goto sayfa işlemi
});

// Pagination 2 için de aynı işlemleri tekrarlayın
document.getElementById('firstPage2').addEventListener('click', function(event) {
        event.preventDefault();
        currentPage = 1; // İlk sayfaya git
        displayTable(currentPage);
});

document.getElementById('prevPage2').addEventListener('click', function(event) {
        event.preventDefault();
        prevPage(); // Önceki sayfaya git
});

document.getElementById('nextPage2').addEventListener('click', function(event) {
        event.preventDefault();
        nextPage(); // Sonraki sayfaya git
});

document.getElementById('lastPage2').addEventListener('click', function(event) {
        event.preventDefault();
        currentPage = Math.ceil(reservationsList.length / rowsPerPage); // Son sayfaya git
        displayTable(currentPage);
});

document.getElementById('gotoPageForm2').addEventListener('submit', function(event) {
        event.preventDefault();
        gotoPage(); // Goto sayfa işlemi
});

// Filtrele butonuna tıklama olayı
document.querySelector('.btn.btn-primary').addEventListener('click', function() {
        const filterDate = document.getElementById('dateSelect').value;
        if (filterDate) {
            displayFilteredTable(filterDate); // Filtrelenmiş tabloyu göster
        } else {
            displayTable(currentPage); // Tarih girilmediyse tüm verileri göster
        }
});

// Filtre Kaldır butonuna tıklama olayı
document.querySelector('.btn.btn-outline-danger').addEventListener('click', function() {
        document.getElementById('dateSelect').value = ""; // Tarih alanını temizle
        displayTable(currentPage); // Tüm verileri göster
});

// Filtrelenmiş tabloyu gösteren fonksiyon
function displayFilteredTable(filterDate) {
        const filteredData = reservationsList.filter(reservation => reservation.date === filterDate); // Tarihe göre filtrele
        const tableBody = document.querySelector("#tableBody");
        tableBody.innerHTML = ""; // Önceki içerikleri temizle

        filteredData.forEach(row => {
            const tr = document.createElement("tr");
            updateTableRow(tr, row); // Satırı güncelle
            tableBody.appendChild(tr);
        });

        updatePagination(); // Sayfalama bilgilerini güncelle
}

// Tüm verileri gösteren fonksiyon
function displayTable(page) {
        const tableBody = document.querySelector("#tableBody");
        tableBody.innerHTML = ""; // Önceki içerikleri temizle

        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const displayedData = reservationsList.slice(start, end); // Mevcut sayfada gösterilecek veriler

        displayedData.forEach(row => {
            const tr = document.createElement("tr");
            updateTableRow(tr, row); // Satırı güncelle
            tableBody.appendChild(tr);
        });

        updatePagination(); // Sayfalama bilgilerini güncelle
}

// Güncellenmiş pagination fonksiyonu
function updatePagination() {
        const totalRows = reservationsList.length; // Toplam öğe sayısını al
        const totalPages = Math.ceil(totalRows / rowsPerPage);

        // Pagination 1
        document.getElementById("totalRows1").textContent = totalRows;
        document.getElementById("totalPages1").textContent = totalPages;
        document.getElementById("gotoPageInput1").value = currentPage;

        // Pagination 2
        document.getElementById("totalRows2").textContent = totalRows;
        document.getElementById("totalPages2").textContent = totalPages;
        document.getElementById("gotoPageInput2").value = currentPage;
}

// Arama butonuna tıklama olayı
document.getElementById('searchBtn').addEventListener('click', function() {
        const searchValue = document.getElementById('searchBar').value.toLowerCase(); // Arama çubuğundaki değeri al
        const filteredData = reservationsList.filter(reservation => {
            return Object.values(reservation).some(value => 
                value.toString().toLowerCase().includes(searchValue) // Her bir alanı kontrol et
            );
        });

        // Filtrelenmiş tabloyu göster
        displayFilteredData(filteredData);
});

// Temizleme butonuna tıklama olayı
document.getElementById('searchTrashBtn').addEventListener('click', function() {
        document.getElementById('searchBar').value = ""; // Arama çubuğunu temizle
        displayTable(currentPage); // Tüm verileri göster
});

// Filtrelenmiş tabloyu gösteren fonksiyon
function displayFilteredData(filteredData) {
        const tableBody = document.querySelector("#tableBody");
        tableBody.innerHTML = ""; // Önceki içerikleri temizle

        filteredData.forEach(row => {
            const tr = document.createElement("tr");
            updateTableRow(tr, row); // Satırı güncelle
            tableBody.appendChild(tr);
        });

        updatePagination(); // Sayfalama bilgilerini güncelle
}


document.getElementById("rezervasyonToggle").addEventListener("click", function() {
        var menu = document.getElementById("rezervasyonMenu");
        if (menu.style.display === "none" || menu.style.display === "") {
            menu.style.display = "block"; // Menü gösteriliyor
            menu.style.height = "auto";
            menu.style.overflow = "hidden";
            menu.style.transition = "height 0.3s ease-out"; // Yumuşak geçiş
        } else {
            menu.style.display = "none"; // Menü kapanıyor
        }
    });

// İlk tablo görüntülendiğinde çağırın
displayTable(currentPage);

