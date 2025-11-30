// Click để xóa các thông báo đỏ của check dữ liệu
$('form .input-field').each(function () {
    $(this).click(function () {
        $(this).parent().find('.helper').remove();
        $(this).removeClass('input-error'); //
    })
})

// Prevent click events within the form from triggering the body click event
$('body form').on('click', function (e) {
    e.stopPropagation();
});

// Kiểm tra dữ liệu đầu vào đã nhập hay chưa ?
function validateForm(formID) {
    let checkValid = true;
    $(formID).find('.input-field').each(function () {
        let value = $(this).val();
        let fieldType = $(this).attr('type'); // Get input field type
        $(this).removeClass('input-error'); // Remove input-error class
        // Check if the field is an email input and validate the format
       
        if (value == null || value == '' || value == undefined) {
            let $input = $(this);
            checkValid = false;
            // Kiểm tra xem có thẻ span báo lỗi chưa
            if (!$input.next('.helper.text-danger').length) {
                // Thêm thẻ span báo lỗi
                let htmlAlert = `<span class="helper text-danger" style="z-index: 999;margin-top: 75px;">${$input.data('require')}</span>`;
                $input.parent().append(htmlAlert);
            }
            if (!$input.hasClass('input-error')) {
                $input.addClass('input-error');
            }
        }
    });
    return checkValid;
}

$('button[type="submit"]').on('click', function (e) {
    e.preventDefault();
    let form = $(this).closest('form');
    let formID = form.attr('id');
     if(validateForm(`#${formID}`)) {
         form.submit();
     }
});

