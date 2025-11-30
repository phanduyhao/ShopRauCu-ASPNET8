// T?ng gi?m s? l??ng s?n ph?m

$(document).ready(function () {
    $('.form-add-to-cart').each(function () {
        var formAddToCart = $(this).attr('id');
        var numberInput = $('#' + formAddToCart + ' .numberInput');
        var decreaseButton = $('#' + formAddToCart + ' .decreaseButton');
        var increaseButton = $('#' + formAddToCart + ' .increaseButton');

        decreaseButton.on('click', function () {
            var currentValue = parseInt(numberInput.val(), 10);
            if (currentValue > 0) {
                numberInput.val(currentValue - 1);
            }
        });
        increaseButton.on('click', function () {
            var currentValue = parseInt(numberInput.val(), 10);
            numberInput.val(currentValue + 1);
        })
    })

});

// Thêm vào gi? hàng
$(document).ready(function () {
    // $('.product-infor-main').each(function() {
    //     var productMain = $(this).attr('id');
    //     var addToCart = $('#' + productMain + ' .add-to-cart');
    //     var checkAuth = $('.check-auth').text();

    //     addToCart.on('click', function(e) {
    //         e.preventDefault();
    //         if(checkAuth == 1){
    //             const Amount = $(this).data('quantity');
    //             if(Amount > 0){
    //                 var productId = $(this).data('product-id');
    //                 var userId = $(this).data('user-id');
    //                 var thumbProduct = $('#' + productMain + ' .thumb-product').attr("src");
    //                 var nameProduct = $('#' + productMain + ' .title-product').text();
    //                 var priceProduct = $('#' + productMain + ' .okPrice-product').text();
    //                 var quantity = $('#' + productMain + ' .quantity').val();
    //                 priceProduct =  parseFloat(priceProduct.replace(/,/g, ''))
    //                 var subtotal = parseInt(quantity) * priceProduct;

    //                     // G?i yêu c?u Ajax
    //                 if(quantity > 0){
    //                     $.ajax({
    //                         headers: {
    //                             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    //                         },
    //                         url: '/addToCart',
    //                         type: 'POST',
    //                         data: {
    //                             product_id: productId,
    //                             user_id: userId,
    //                             thumb: thumbProduct,
    //                             name: nameProduct,
    //                             price: priceProduct,
    //                             quantity: quantity,
    //                             subtotal: subtotal
    //                         },
    //                         success: function(response) {
    //                             toastr.success(response.message, 'Thông báo');
    //                             window.location.reload();
    //                         },
    //                         error: function(error) {
    //                             toastr.error('L?i thêm gi? hàng !');
    //                         }
    //                     });
    //                 }else{
    //                     toastr.error('Vui lòng nh?p s? l??ng s?n ph?m !');
    //                 }
    //             }else{
    //                 toastr.error('S?n ph?m ?ã h?t hàng !');
    //             }
    //         }else{
    //             window.location.href = '/login';
    //         }
    //     });
    // });
    $('.add-to-cart').on('click', function (e) {
        e.preventDefault();
        var checkAuth = $('.check-auth').text();
        if (checkAuth == 1) {
            const Amount = $(this).data('quantity');
            if (Amount > 0) {
                var productId = $(this).data('product-id');
                var userId = $(this).data('user-id');
                var thumbProduct = $(' .thumb-product').attr("src");
                var nameProduct = $(' .title-product-detail').text();
                var priceProduct = $(' .okPrice-product').text();
                var quantity = $(' .quantity').val();
                var types = $('input[name="types"]:checked').val(); // L?y giá tr? size

                priceProduct = parseFloat(priceProduct.replace(/,/g, ''))
                var subtotal = parseInt(quantity) * priceProduct;
                // G?i yêu c?u Ajax
                if (quantity > 0) {
                    $.ajax({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        url: '/addToCart',
                        type: 'POST',
                        data: {
                            product_id: productId,
                            user_id: userId,
                            thumb: thumbProduct,
                            name: nameProduct,
                            price: priceProduct,
                            quantity: quantity,
                            subtotal: subtotal,
                            types: types,  // G?i giá tr? size

                        },
                        success: function (response) {
                            toastr.success(response.message, 'Thông báo');
                            window.location.href = '/carts';
                        },
                        error: function (error) {
                            toastr.error('L?i thêm gi? hàng !');
                        }
                    });
                } else {
                    toastr.error('Vui lòng nh?p s? l??ng s?n ph?m !');
                }
            } else {
                toastr.error('S?n ph?m ?ã h?t hàng !');
            }
        } else {
            window.location.href = '/login';
        }
    });
});


// C?p nh?t gi? hàng
$(document).ready(function () {
    $('#updateCartButton').on('click', function (e) {
        e.preventDefault();
        var cartUpdates = [];
        var isValid = true; // C? ki?m tra tính h?p l?

        $('.quantity').each(function () {
            var cartId = $(this).data('cart-id');
            var newQuantity = $(this).val();
            var title = $(this).closest('.single-item-list').find('.title-product h6').text(); // L?y tên s?n ph?m

            // Ki?m tra s? l??ng
            if (newQuantity < 1) {
                alert('S? l??ng c?a s?n ph?m "' + title + '" ph?i l?n h?n ho?c b?ng 1.');
                isValid = false;
                return false; // Thoát kh?i vòng l?p
            } else if (!Number.isInteger(Number(newQuantity))) {
                alert('S? l??ng c?a s?n ph?m "' + title + '" ph?i là s? nguyên!');
                isValid = false;
                return false; // Thoát kh?i vòng l?p
            }

            cartUpdates.push({ id: cartId, quantity: newQuantity });
        });

        // N?u có l?i, không th?c hi?n AJAX
        if (!isValid) {
            return;
        }

        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'POST',
            url: '/carts/updateQuantities',
            data: { cart_updates: cartUpdates },
            success: function (data) {
                if (data.success) {
                    location.reload();
                }
            },
            error: function (xhr) {
                var errors = xhr.responseJSON.errors;
                if (errors) {
                    errors.forEach(function (error) {
                        alert(error);
                    });
                } else {
                    console.log(xhr.responseText);
                }
            }
        });
    });


});

// Checkout - l?y Session
$(document).ready(function () {
    $('#buy-products').click(function (e) {
        e.preventDefault();

        var productInfos = [];
        var cartItems = $('.single-item-list');
        var hasError = false;

        cartItems.each(function () {
            var thumb = $(this).find('.thumb-product').attr('src');
            var title = $(this).find('.title-product').text();
            var slug = $(this).find('.title-product').attr('href');
            var price = $(this).find('.price-product').text();
            var quantity = parseInt($(this).find('.quantity').val());
            var subtotal = $(this).find('.subtotal').text();
            var types = $(this).find('.types').text();
            var cart_id = $(this).data('cart-id');

            if (quantity < 1 || !Number.isInteger(quantity)) {
                alert('S? l??ng c?a s?n ph?m "' + title + '" ph?i là s? nguyên ? 1.');
                hasError = true;
                return false;
            }

            productInfos.push({
                id: cart_id,
                thumb, title, slug, price, quantity, subtotal, types
            });
        });

        if (hasError) return;

        $.ajax({
            url: '/cart/check-stock',
            method: 'POST',
            data: {
                _token: $('meta[name="csrf-token"]').attr('content'),
                cart_updates: productInfos.map(p => ({ id: p.id, quantity: p.quantity }))
            },
            success: function (response) {
                sessionStorage.setItem('productInfos', JSON.stringify(productInfos));
                window.location.href = '/checkout';
            },
            error: function (xhr) {
                if (xhr.responseJSON && xhr.responseJSON.errors) {
                    alert(xhr.responseJSON.errors.join("\n"));
                } else {
                    alert('?ã x?y ra l?i ki?m tra t?n kho.');
                }
            }
        });
    });
});



// Hi?n th? các s?n ph?m ? session lên html
$(document).ready(function () {
    var giavanchuyen = $('.giavanchuyen').data('gia');
    var total = 0;
    // Ki?m tra xem có d? li?u trong sessionStorage hay không
    var productInfos = sessionStorage.getItem('productInfos');
    if (productInfos) {
        // Chuy?n d? li?u t? JSON v? ??i t??ng JavaScript
        productInfos = JSON.parse(productInfos);
        // L?p qua m?i ph?n t? trong m?ng và thêm vào b?ng
        productInfos.forEach(function (product, index) {
            var subtotal = parseFloat(product.subtotal.replace(/,/g, ''))
            total += subtotal;
            total += giavanchuyen;
            var row = '<div class="single-item-list text-center border-bottom py-2">' +
                '<div class="row align-items-center">' +
                '<div class="col-1">' + index + '</div>' +
                '<div class="col-md-1 col-12">' +
                '<img class="w-100" src="' + product.thumb + '" alt="' + product.title + '">' +
                '</div>' +
                '<div class="col-md-4 col-12">' +
                '<a href="' + product.slug + '"><h6 class="title text-start text-primary">' + product.title + '</h6></a>' +
                '</div>' +
                '<div class="col-md-2 col-12">' +
                '<span class="price">' + product.types + '</span>' +
                '</div>' +
                '<div class="col-md-2 col-12 product-infor form-add-to-cart" >' +
                '<p class="mb-0">' + product.quantity + '</p>' +
                '</div>' +
                '<div class="col-md-2 col-12">' +
                '<span class="subtotal">' + product.subtotal + '</span>' +
                '</div>' +
                '</div>' +
                '</div>'
                ;
            $('.infor-product-session').append(row);
        });
        $('.total').append(formatNumber(total) + ' VN?')
        $('#total-amount').val(total);
        var input_total = '<input type="text" name="total" hidden class="total-input" value="' + formatNumber(total) + ' VN?' + '">'
        var input_total2 = '<input type="text" name="total2" hidden class="total-input" value="' + total + '">'
        $('#total-price').append(input_total)
        $('#total-price2').append(input_total2);

        // Ki?m tra các tr??ng nh?p ??a ch? tr??c khi m? modal thanh toán
        $(".btn-thanhtoan").on("click", function (event) {
            event.preventDefault(); // Ch?n hành ??ng m?c ??nh ngay l?p t?c

            let isValid = true;
            $(".input-field").each(function () {
                if ($(this).val().trim() === "") {
                    isValid = false;
                    return false; // D?ng vòng l?p ngay khi có tr??ng tr?ng
                }
            });

            if (!isValid) {
                console.log("Nh?p ??y ?? thông tin ??a ch?");
            } else {
                $("#exampleModal").modal("show"); // Ch? hi?n th? modal n?u nh?p ??y ??
            }
        });

        // X? lý thanh toán VNPAY
        $("#vnpay-payment-btn").on("click", function (event) {
            event.preventDefault();
            let sdt = $(".input-sdt").val();
            let name = $(".input-name").val();
            let country = $(".input-country").val();
            let province = $(".input-province").val();
            let district = $(".input-district").val();
            let wards = $(".input-wards").val();
            let address = $(".input-address").val();
            let form = $('<form>', {
                action: "/checkout/Payment",
                method: "POST"
            });

            form.append($('<input>', { type: 'hidden', name: '_token', value: $('meta[name="csrf-token"]').attr("content") }));
            form.append($('<input>', { type: 'hidden', name: 'amount_money', value: total }));
            form.append($('<input>', { type: 'hidden', name: 'bank_code', value: $("select[name='bank_code']").val() }));
            form.append($('<input>', { type: 'hidden', name: 'sdt', value: sdt }));
            form.append($('<input>', { type: 'hidden', name: 'name', value: name }));
            form.append($('<input>', { type: 'hidden', name: 'Country', value: country }));
            form.append($('<input>', { type: 'hidden', name: 'province', value: province }));
            form.append($('<input>', { type: 'hidden', name: 'district', value: district }));
            form.append($('<input>', { type: 'hidden', name: 'wards', value: wards }));
            form.append($('<input>', { type: 'hidden', name: 'address', value: address }));

            $("body").append(form);
            form.submit();
        });
    }
});

function formatNumber(number) {
    // S? d?ng hàm toLocaleString ?? th?c hi?n ??nh d?ng s?
    return number.toLocaleString('en-US');
}

// L?y ??a ch? ?ã có
$('.address-exist').each(function () {
    var addressExist = $(this);
    addressExist.click(function () {
        var sdt = addressExist.find('.sdt').text();
        var name = addressExist.find('.name').text();
        var country = addressExist.find('.country').text();
        var district = addressExist.find('.district').text();
        var province = addressExist.find('.province').text();
        var wards = addressExist.find('.wards').text();
        var address = addressExist.find('.address').text();

        $('#form-process-checkout .input-sdt').val(sdt)
        $('#form-process-checkout .input-name').val(name)
        $('#form-process-checkout .input-country').val(country)
        $('#form-process-checkout .input-province').val(province)
        $('#form-process-checkout .input-district').val(district)
        $('#form-process-checkout .input-wards').val(wards)
        $('#form-process-checkout .input-address').val(address)
    })
})

// ??a ??a ch? vào session và thanh toán thành công
$('.btn-checkout').click(function () {
    var sdt = $('#form-process-checkout .input-sdt').val();
    var name = $('#form-process-checkout .input-name').val();
    var country = $('#form-process-checkout .input-country').val();
    var province = $('#form-process-checkout .input-province').val();
    var district = $('#form-process-checkout .input-district').val();
    var wards = $('#form-process-checkout .input-wards').val();
    var address = $('#form-process-checkout .input-address').val();
    var addressInfors = [];
    addressInfors.push({ sdt: sdt, name: name, country: country, province: province, district: district, wards: wards, address: address });
    sessionStorage.setItem('addressInfors', JSON.stringify(addressInfors));
})

// Hi?n th? ??a ch? lên HTML khi thanh toán thành công
$(document).ready(function () {
    // Ki?m tra xem có d? li?u trong sessionStorage hay không
    var addressInfors = sessionStorage.getItem('addressInfors');
    if (addressInfors) {
        // Chuy?n d? li?u t? JSON v? ??i t??ng JavaScript
        addressInfors = JSON.parse(addressInfors);
        // L?p qua m?i ph?n t? trong m?ng và thêm vào b?ng
        addressInfors.forEach(function (address, index) {
            var row = '<h6>' + address.sdt + ',' + address.name + address.address + address.wards + address.district + address.province + address.country + '</h6>';
            $('.infor-address-session').append(row);
        });
    }
});


(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        } 
    });
    
    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });



    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });

})(jQuery);

