 "use strict";
    $(document).ready(function() {
      /*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
        // Khai báo đối tượng chứa dữ liệu lọc
        var gUserResObj = {
            users : [],
            filterUsers : function(paramFilter){
                var vResultArray = [];
                vResultArray = gUserResObj.users.filter(function(paramUser){
                return  (paramUser.trangThai === paramFilter.trangThai || paramFilter.trangThai === "") && 
                        (paramUser.loaiPizza === paramFilter.loaiPizza  || paramFilter.loaiPizza === "");
                })
                return vResultArray;
            }
            }
        // Khai báo biến toàn cục chứa loại pizza
        var gPizzaType = [
            {
                pizzaCode: "Seafood",
                pizzaName: "Hải sản",
            },
            {
                pizzaCode: "Hawaii",
                pizzaName: "Hawaii", 
            },
            {
                pizzaCode: "Bacon",
                pizzaName: "Thịt hun khói",
            }
        ]
        // Khai báo biến toàn cục chứa trạng thái đơn hàng
        var gStatus = [
            {
                statusCode: "open",
                statusName: "Open"
            },
            {
                statusCode: "cancel",
                statusName: "Đã hủy"
            },
            {
                statusCode: "confirmed",
                statusName: "Đã xác nhận"
            }
        ]
        // Khai báo biến toàn cục chứa combo
        var gCombo = [
            {
                kichCo: "S",
                duongKinh: "20",
                suon: "2",
                salad: "200",
                soLuongNuoc: "2",
                thanhTien: "150000",
            },
            {
                kichCo: "M",
                duongKinh: "25",
                suon: "4",
                salad: "300",
                soLuongNuoc: "3",
                thanhTien: "200000",
            },
            {
                kichCo: "L",
                duongKinh: "30",
                suon: "8",
                salad: "500",
                soLuongNuoc: "4",
                thanhTien: "250000",
            },
        ]
        const gUSER_COL = ["orderId", "kichCo", "loaiPizza", "soLuongNuoc", "thanhTien", "hoTen", "soDienThoai", "trangThai", "chitiet"]
        const gCOLUMN_ID = 0;
        const gCOLUMN_KICH_CO = 1;
        const gCOLUMN_LOAI_PIZZA = 2;
        const gCOLUMN_SO_LUONG_NUOC = 3;
        const gCOLUMN_THANH_TIEN = 4 ;
        const gCOLUMN_HO_TEN = 5;
        const gCOLUMN_SO_DIEN_THOAI = 6;
        const gCOLUMN_TRANG_THAI = 7;
        const gCOLUMN_CHI_TIET = 8;
        
        var gId = [];
        var gOrderId = []
        // định nghĩa table  - chưa có data
        var gUserTable = $("#user-table").DataTable( {
        // Khai báo các cột của datatable
        "columns" : [
            { "data" : gUSER_COL[gCOLUMN_ID] },
            { "data" : gUSER_COL[gCOLUMN_KICH_CO] },
            { "data" : gUSER_COL[gCOLUMN_LOAI_PIZZA] },
            { "data" : gUSER_COL[gCOLUMN_SO_LUONG_NUOC] },
            { "data" : gUSER_COL[gCOLUMN_THANH_TIEN] },
            { "data" : gUSER_COL[gCOLUMN_HO_TEN] },
            { "data" : gUSER_COL[gCOLUMN_SO_DIEN_THOAI] },
            { "data" : gUSER_COL[gCOLUMN_TRANG_THAI] },
            { "data" : gUSER_COL[gCOLUMN_CHI_TIET] }
        ],
        // Ghi đè nội dung của cột action, chuyển thành button chi tiết
        "columnDefs": [ 
        {
            "targets": gCOLUMN_CHI_TIET,
            "defaultContent": "<button class='info-user btn btn-info'>Chi tiết</button>"
        }]
        });
      /*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */
        onPageLoading();
        // Thêm sự kiện khi ấn nút "chi tiết"
        $("#user-table").on("click", ".info-user", function(){
            onBtnChiTietClick(this);
        });
        // Thêm sự kiện khi ấn nút "Lọc"
        $("#btn-filter").on("click", function(){
            onBtnFilterClick();
        });
        // Thêm sự kiện khi ấn nút Thêm mới
        $("#btn-add-new").on("click", function(){
            onBtnAddNewClick();
        });
        // Thêm sự kiện khi change select
        $("#combo-select").change(function(){
            onChangeComboSelect()
        });
        // Hàm xử lý khi ấn nút Create New
        $("#btn-create").on("click", function(){
            onCreateNewClick();
        });
        // Thêm sự kiện khi ấn nút Camcel ở tạo mới đơn hàng
        $("#btn-cancel-modal").on("click", function(){
            onBtnCloseClick();
        })
        // Thêm sự kiện khi ấn nút "Confirm"
        $("#user-modal").on("click", "#btn-confirm", function(){
            onBtnConfirmClick();
        });
        // Thêm sự kiện khi ấn nút "Cancel"
        $("#user-modal").on("click", "#btn-cancel", function(){
            onBtnCancelClick();
        });
        // Thêm sự kiện khi ấn nút "Delete"
        $("#user-modal").on("click", "#btn-delete", function(){
            onBtnDeleteClick();
        });
        // thêm sự kiện khi ấn nút "Đóng"
        $("#btn-close").on("click",function(){
            onBtnCloseClick();
        });
      /*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */  
        // Hàm xử lý khi load trang
        // Load data vào 2 ô select
        // Gọi Api lấy dữ liệu và lưu vào 1 biến toàn cục
        // Ghi dữ liệu lấy về vào bảng
        function onPageLoading(){
            // Load data vào ô trạng thái Order
            loadDataToOrderStatus();
            // Load data vào ô Loại Pizza
            loadDataToPizzaStatusSelect();
            $.ajax({
                url: "http://42.115.221.44:8080/devcamp-pizza365/orders",
                type: "GET",
                dataType: 'json',
                success: function(responseObject){
                    gUserResObj.users = responseObject;
                    // Ghi dữ liệu vào bảng
                    loadDataToTable(responseObject);
                },
                error: function(error){
                    console.assert(error.responseText);
                }
            });
        };
        // Hàm xử lý khi ấn nút chi tiết 
        // Lấy được thông tin của dòng và ghi ra console
        function onBtnChiTietClick(paramDataTable){
            console.log("Nút Chi tiết được ấn");
            //Xác định thẻ tr là cha của nút được chọn
            var vRowSelected = $(paramDataTable).parents('tr');
            //Lấy datatable row
            var vDatatableRow = gUserTable.row(vRowSelected); 
            // Hiển thị forrm chi tiết
             $("#user-modal").modal('show');
            gId = vDatatableRow.data().id
            gOrderId = vDatatableRow.data().orderId
            // console.log(gId);
            // console.log(gOrderId)
            // Gọi Api lấy thông tin
            callApiGetDataToModal(gOrderId);
        }
        // Hàm xử lý khi ấn nút "Lọc"
        // Lấy được data cần lọc
        // Tiến hành lọc và hiển thị kết quả vào bảng
        function onBtnFilterClick(){
            console.log("Nút Lọc được ấn");
            // Khai báo đối tượng chứa dữ liệu
            var vFilterUser = {
                "trangThai": "",
                "loaiPizza": ""
            };
            // Thu thập dữ liệu
            getDataInfor(vFilterUser);
            console.log(vFilterUser);
            // Kiểm tra dữ liệu
            // Tiến hành lọc dữ liệu
            var vResultFilter = gUserResObj.filterUsers(vFilterUser);
            // Hiển thị dữ liệu
            loadDataToTable(vResultFilter);
            console.log(vResultFilter)
        }
        // Hàm xử lý sự kiện khi ấn nút thêm mới
        // Load thông tin vào các select của modal
        // Thu thập thông tin, gọi Api tạo order mới
        function onBtnAddNewClick(){
            $("#user-order-modal").modal("show");
            // Load data vào combo select
            loadDataToComboSelect();  
            // Load data vào pizzaType ở Modal
            loadDataToModalPizzaType(); 
            // Gọi Api lấy dữ liệu đồ uống
            $.ajax({
                url: "http://42.115.221.44:8080/devcamp-pizza365/drinks",
                type: "GET",
                dataType: 'json',
                success: function(responseObject){
                    // console.log(responseObject)
                    // Load data vào DrinkSelect
                    loadDataToDrinkSelect(responseObject)
                },
                error: function(error){
                    console.assert(error.responseText);
                }
            });
        }
        // Hàm xử lý khi chọn combo
        // Lấy thông tin của combo dựa trên combo đã chọn
        // load lên modal
        function onChangeComboSelect(){
            var vCombo = $("#combo-select").val();
            var vComboB = getComboDataByComboSize(vCombo);
            if (vComboB == null){
                $("#duong-kinh").val("");
                $("#suon-nuong").val("");
                $("#salad").val("");
                $("#so-luong-nuoc").val("");
                $("#thanh-tien").val("");
            }
            else{
                loadDataToCreateNewModal(vComboB);
            }

        }
        // Hàm xử lý khi ấn nút CreateNew
        // Thu thập thông tin trên modal
        // Gọi Api tạo Order mới
        function onCreateNewClick(){
            // Khai báo đối tượng chứa dữ liệu
            var vObjectRequest = {
                kichCo: "",
                duongKinh: "",
                suon: "",
                salad: "",
                loaiPizza: "",
                idVourcher: "",
                idLoaiNuocUong: "",
                soLuongNuoc: "",
                hoTen: "",
                thanhTien: "",
                email: "",
                soDienThoai: "",
                diaChi: "",
                loiNhan: ""
            }    
            // Thu thập dữ liệu
            getDataCreateNewOrder(vObjectRequest);
            // Kiểm tra dữ liệu
            var vIsValidate = validateCreateData(vObjectRequest);
            // Nếu dữ liệu nhập vào hợp lệ
            if (vIsValidate){
                // Check Voucher
                checkVoucherData(vObjectRequest.idVourcher);
                // Gọi API tạo đơn hàng
                callApiCreateOrder(vObjectRequest);
                // Hiển thị thông báo 
                $("#reset-modal").modal('show');
                }
        }
        // Hàm xử lý khi ấn nút "Confirm"
        // Gọi Api lấy thông tin order
        // Update trạng thái đơn hàng thành comfirm
        function onBtnConfirmClick(){
            // Khai báo đối tượng chứa dữ liệu
            var vOrderStatus = {
                status: ""
            };
            console.log("Nút Confirm được ấn")
            console.log(gId)
            // Thu thập thông tin cập nhật đơn hàng
            getDataUpdateOrder(vOrderStatus);
            console.log(vOrderStatus.status);
            // kiểm tra dữ liệu
            if (vOrderStatus.status == "confirmed"){
                callApiConfirmData(gId);
                // Hiển thị thông báo 
                $("#reset-modal").modal('show');
            }
            if (vOrderStatus.status == "cancel"){
                callApiCancelData(gId);
                // Hiển thị thông báo 
                $("#reset-modal").modal('show');
            }
            if (vOrderStatus.status == "open"){
                callApiOpenData(gId);
                // Hiển thị thông báo 
                $("#reset-modal").modal('show');
            }; 
        }
        // Hàm xử lý khi ấn nút "Cancel"
        function onBtnCancelClick(){
            console.log("Nút Cancel được ấn")
            $("#user-modal").modal('hide');
        };
        // Hàm xử lý khi ấn nút "Delete"
        // Gọi Api xóa đơn hàng đang chọn
        function onBtnDeleteClick(){
            callApiDeleteOrder(gId);
            // Hiển thị thông báo 
            $("#reset-modal").modal('show');
        }
        // Sự kiện ấn nút Close
        function onBtnCloseClick(){
            location.reload() // reset lại trang
        }
        /*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình*/
        // Hàm load data vào ô status select
        function loadDataToOrderStatus(){
            var vSelectData = $("#order-select");
            for(var bI = 0; bI < gStatus.length; bI ++) { 
            var bCarOption = $("<option/>", {
                text: gStatus[bI].statusName,
                value: gStatus[bI].statusCode
            }).appendTo(vSelectData);
            }
        }
        // Hàm Load data vào ô Loại Pizza
        function loadDataToPizzaStatusSelect(){
            var vSelectData = $("#pizza-select");
            for(var bI = 0; bI < gPizzaType.length; bI ++) { 
            var bCarOption = $("<option/>", {
                text: gPizzaType[bI].pizzaName,
                value: gPizzaType[bI].pizzaCode
            }).appendTo(vSelectData);
            }
        }
        // Hàm load data vào combo select
        function loadDataToComboSelect(){
            var vSelectData = $("#combo-select");
            var bCarOption = $("<option/>", {
                text: "=== ALL ===",
                value: "0"
            }).appendTo(vSelectData);
            for(var bI = 0; bI < gCombo.length; bI ++) { 
            var bCarOption = $("<option/>", {
                text: gCombo[bI].kichCo,
                value: gCombo[bI].kichCo
            }).appendTo(vSelectData);
            }
        }
        // Load data vào pizzaType ở Modal
        function loadDataToModalPizzaType() {
            var vSelectData = $("#modal-pizza-type");
            var bCarOption = $("<option/>", {
                text: "=== ALL ===",
                value: "0"
            }).appendTo(vSelectData);
            for(var bI = 0; bI < gCombo.length; bI ++) { 
            var bCarOption = $("<option/>", {
                text: gPizzaType[bI].pizzaName,
                value: gCombo[bI].pizzaCode
            }).appendTo(vSelectData);
            }
        }
        // Hàm lấy thông tin combo dựa vào size
        function getComboDataByComboSize(paramComboSize) {
            var vIsFound = false;
            var vComboIndex = 0;
            var vComboObj = null;
            while (vIsFound == false && vComboIndex < gCombo.length){
                if (gCombo[vComboIndex].kichCo === paramComboSize){
                    vIsFound = true;
                    vComboObj = gCombo[vComboIndex];
                }
                else{
                    vComboIndex ++;
                }
            }
            return vComboObj;
    
        }
        // Hàm load data lên modal
        function loadDataToCreateNewModal(paramComboSelect){
            $("#duong-kinh").val(paramComboSelect.duongKinh);
            $("#suon-nuong").val(paramComboSelect.suon);
            $("#salad").val(paramComboSelect.salad);
            $("#so-luong-nuoc").val(paramComboSelect.soLuongNuoc);
            $("#thanh-tien").val(paramComboSelect.thanhTien);
        }
        // Hàm load data vào DrinkSelect
        function loadDataToDrinkSelect(parmaDrinkData){
            var vSelectData = $("#loai-do-uong");
            var bCarOption = $("<option/>", {
                text: "Chọn đồ uống",
                value: ""
            }).appendTo(vSelectData);
            for(var bI = 0; bI < parmaDrinkData.length; bI ++) { 
            var bCarOption = $("<option/>", {
                text: parmaDrinkData[bI].tenNuocUong,
                value: parmaDrinkData[bI].maNuocUong
            }).appendTo(vSelectData);
            }
        }
        // Hàm thu thập dữ liệu để tạo đơn hàng mới
        function getDataCreateNewOrder(paramNewOrderData){
            paramNewOrderData.kichCo = $("#combo-select").val();
            paramNewOrderData.duongKinh = $("#duong-kinh").val();
            paramNewOrderData.suon = $("#suon-nuong").val();
            paramNewOrderData.salad = $("#salad").val();
            paramNewOrderData.loaiPizza = $("#modal-pizza-type").val();
            paramNewOrderData.idVourcher = $("#voucherid").val();
            if (paramNewOrderData.idVourcher == ""){
                paramNewOrderData.idVourcher = 0
            }
            paramNewOrderData.idLoaiNuocUong = $("#loai-do-uong").val();
            paramNewOrderData.soLuongNuoc = $("#so-luong-nuoc").val();
            paramNewOrderData.hoTen = $("#ipn-ho-ten").val();
            paramNewOrderData.thanhTien = $("#thanh-tien").val();
            paramNewOrderData.email = $("#modal-email").val();
            paramNewOrderData.soDienThoai = $("#phone-number").val();
            paramNewOrderData.diaChi = $("#address").val();
            paramNewOrderData.loiNhan = $("#message").val();
        }
        // Hàm kiểm tra dữ liệu cho tạo đơn hàng mới
        function validateCreateData(paramNewOrderData){
            if (paramNewOrderData.kichCo == "0"){
                alert("Chưa chọn combo!!!");
                return false;
            }
            if (paramNewOrderData.loaiPizza == "0"){
                alert("Chưa chọn loại pizza!!!");
                return false;
            }
            if (paramNewOrderData.idLoaiNuocUong == ""){
                alert("Chưa chọn loại đồ uống");
                return false;
            }
            if (paramNewOrderData.hoTen == ""){
                alert("Chưa nhập họ tên!!!");
                return false;
            }
            if (paramNewOrderData.email !== "" && !validateEmail(paramNewOrderData.email)){
                alert("Email không hợp lệ!!!");
                return false;
            }
            if (paramNewOrderData.soDienThoai == ""){
                alert("Chưa nhập số điện thoại!!!");
                return false;
            }
            if (paramNewOrderData.diaChi == ""){
                alert("Chưa nhập địa chỉ!!!");
                return false;
            }
            if (isNaN(paramNewOrderData.soDienThoai)){
                alert("Số điện thoại phải là số!!!");
                return false;
            }
            if (paramNewOrderData.idVourcher !== "" && isNaN(paramNewOrderData.idVourcher)){
                alert("voucher phải là số");
                return false;
            }
            return true;

        }
        // Hàm kiểm tra email
        function validateEmail(paramEmail) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(paramEmail).toLowerCase());
        }
        // Hàm kiểm tra Voucher
        function checkVoucherData(paramVoucherId){
            $.ajax({
                url: "http://42.115.221.44:8080/devcamp-voucher-api/voucher_detail/" + paramVoucherId,
                type: "GET",
                dataType: 'json',
                success: function(responseObject){
                   alert("Mã giảm giá: " + responseObject.maVoucher + " - Phần trăm giảm giá: " + responseObject.phanTramGiamGia)
                },
                error: function(error){
                    console.assert(error.responseText);
                }
            }); 
        }
        // Gọi API tạo đơn hàng
        function callApiCreateOrder(paramNewOrderData){
            $.ajax({
                url: "http://42.115.221.44:8080/devcamp-pizza365/orders",
                type: 'POST',
                data: JSON.stringify(paramNewOrderData),
                contentType: "application/json", 
                success: function (res) {
                console.log(res);
                },
                error: function (ajaxContext) {
                alert(ajaxContext.responseText)
                }
            });
        }
        // Hàm thu thập dữ liệu Update đơn hàng
        function getDataUpdateOrder(parramOrderStatus){
            parramOrderStatus.status = $("#trang-thai").val();
        }
        // Hàm hiển thị dữ liệu vào bảng
        function loadDataToTable(paramTableData){
            //Xóa toàn bộ dữ liệu đang có của bảng
            gUserTable.clear();
            //Cập nhật data cho bảng 
            gUserTable.rows.add(paramTableData);
            //Cập nhật lại giao diện hiển thị bảng
            gUserTable.draw();
        }
        // Hàm thu thập dữ liệu Filter
        function getDataInfor(paramFilterUser){
            paramFilterUser.trangThai = $("#order-select").val();
            paramFilterUser.loaiPizza = $("#pizza-select").val();
        }
        // Hàm gọi Api lấy dữ liệu cho Modal
        function callApiGetDataToModal(paramOrderId){
            $.ajax({
                url: "http://42.115.221.44:8080/devcamp-pizza365/orders/" + paramOrderId,
                type: "GET",
                dataType: 'json',
                success: function(responseObject){
                    console.log(responseObject)
                    // Ghi dữ liệu modal
                    resuiDataToModal(responseObject)
                },
                error: function(error){
                    console.assert(error.responseText);
                }
            });
        }
        // Hàm hiển thị dữ liệu vào Modal
        function resuiDataToModal(paramModalData){
            $("#ipn-order-id").val(paramModalData.orderId)
            $("#ipn-combo").val(paramModalData.kichCo)
            $("#ipn-duong-kinh").val(paramModalData.duongKinh + "cm")
            $("#ipn-suon-nuong").val(paramModalData.suon)
            $("#ipn-drink").val(paramModalData.idLoaiNuocUong)
            $("#ipn-so-luong-drink").val(paramModalData.soLuongNuoc)
            $("#ipn-voucherid").val(paramModalData.idVourcher)
            $("#ipn-pizza-type").val(paramModalData.loaiPizza)
            $("#ipn-salad").val(paramModalData.salad + "g")
            $("#ipn-thanh-tien").val(paramModalData.thanhTien)
            $("#ipn-giam-gia").val(paramModalData.giamGia)
            $("#ipn-name").val(paramModalData.hoTen)
            $("#ipn-email").val(paramModalData.email)
            $("#ipn-address").val(paramModalData.diaChi)
            $("#ipn-phone").val(paramModalData.soDienThoai)
            $("#ipn-message").val(paramModalData.loiNhan)
            $("#trang-thai").val(paramModalData.trangThai)
            $("#ipn-tao-don").val(paramModalData.ngayTao)
            $("#ipn-cap-nhat").val(paramModalData.ngayCapNhat)
        }
        // Hàm gọi Api Update Confirm data
        function callApiConfirmData(paramId){
            var vObjectRequest = {
            trangThai: "confirmed"
            }
            $.ajax({
                url: "http://42.115.221.44:8080/devcamp-pizza365/orders/" + paramId,
                type: 'PUT',
                data: JSON.stringify(vObjectRequest),
                contentType: "application/json", 
                success: function (res) {
                console.log(res);
                },
                error: function (ajaxContext) {
                alert(ajaxContext.responseText)
                }
            });
        }
        // Hàm gọi Api Update Cancel data
        function callApiCancelData(paramId){
            var vObjectRequest = {
            trangThai: "cancel"
            }
            $.ajax({
                url: "http://42.115.221.44:8080/devcamp-pizza365/orders/" + paramId,
                type: 'PUT',
                data: JSON.stringify(vObjectRequest),
                contentType: "application/json", 
                success: function (res) {
                console.log(res);
                },
                error: function (ajaxContext) {
                alert(ajaxContext.responseText)
                }
            });
        }
        // Hàm gọi Api Update Cancel data
        function callApiOpenData(paramId){
            var vObjectRequest = {
            trangThai: "open"
            }
            $.ajax({
                url: "http://42.115.221.44:8080/devcamp-pizza365/orders/" + paramId,
                type: 'PUT',
                data: JSON.stringify(vObjectRequest),
                contentType: "application/json", 
                success: function (res) {
                console.log(res);
                },
                error: function (ajaxContext) {
                alert(ajaxContext.responseText)
                }
            });
        }
        // Hàm gọi Api Delete Order
        function callApiDeleteOrder(paramId){
            $.ajax({
                url: "http://42.115.221.44:8080/devcamp-pizza365/orders/" + paramId,
                type: 'DELETE',
                data: JSON,
                contentType: "application/json", 
                success: function (res) {
                console.log(res);
                },
                error: function (ajaxContext) {
                alert(ajaxContext.responseText)
                }
            }); 
        }
    });
 