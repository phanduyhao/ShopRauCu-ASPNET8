// Gán sự kiện click cho checkbox
// Dropdown
$(document).ready(function () {
    $('.nav-item.dropdown-user').hover(function () {
        $(this).find('.dropdown-menu').first().stop(true, true).delay(250).slideDown();
    }, function () {
        $(this).find('.dropdown-menu').first().stop(true, true).delay(100).slideUp();
    });

    $('.nav-item.dropdown-user').on('click', function () {
        $(this).find('.dropdown-menu').first().stop(true, true).delay(250).slideDown();
    });
});


// // Thêm ảnh
function previewImages(event, productId) {
    var files = event.target.files;
    var previewContainer = $('#image-preview-' + productId);
    previewContainer.empty();

    if (files.length === 0) return;

    // Lưu files vào biến để xử lý xóa sau
    var dt = new DataTransfer();

    Array.from(files).forEach((file, index) => {
        if (!file.type.startsWith('image/')) return;

        var reader = new FileReader();

        reader.onload = function (e) {
            // Tạo wrapper cho ảnh + nút xóa
            var wrapper = $('<div>', {
                class: 'preview-wrapper',
                css: {
                    position: 'relative',
                    display: 'inline-block',
                    marginRight: '10px',
                    marginBottom: '10px'
                }
            });

            var img = $('<img>', {
                src: e.target.result,
                class: 'preview-img',
                css: {
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                }
            });

            var btnRemove = $('<button>', {
                type: 'button',
                class: 'btn-remove-img',
                html: '&times;',
                css: {
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    lineHeight: '16px',
                    textAlign: 'center',
                    padding: '0'
                }
            });

            btnRemove.on('click', function () {
                // Xóa ảnh trong preview
                wrapper.remove();

                // Cập nhật lại files trong input (bỏ file tương ứng)
                var input = $('#file-input-' + productId)[0];
                var curFiles = input.files;
                var newDT = new DataTransfer();

                for (let i = 0; i < curFiles.length; i++) {
                    if (i !== index) { // giữ lại tất cả file trừ file bị xóa
                        newDT.items.add(curFiles[i]);
                    }
                }

                input.files = newDT.files;
            });

            wrapper.append(img).append(btnRemove);
            previewContainer.append(wrapper);
        }

        reader.readAsDataURL(file);
    });
}


// Thêm xóa active giữa các mục Sidebar
$(document).ready(function () {
    var currentPath = window.location.href;
    $('.menu-item a').each(function () {
        var menuItemPath = $(this).attr('href');
        if (menuItemPath == currentPath) {
            $('.menu-item').removeClass('active');
            $('.menu-item.open').removeClass('active open');
            $(this).closest('.menu-item').addClass('active');
            $(this)
                .closest('.menu-sub')
                .closest('.menu-item')
                .addClass('active open');
        }
    });
});

// tạo Alias tự động
$(document).ready(function () {
    $('#title-store').on('input', function () {
        var title = $(this).val();
        var slug = slugify(title);
        $('#slug-store').val(slug);
    });
    $('.form-edit').each(function () {
        var title = $(this).find('.form-control.title')
        var slug = $(this).find('.form-control.slug')
        title.on('input', function () {
            var title_val = $(this).val();
            var slug_val = slugify(title_val);
            slug.val(slug_val); // Sửa chỗ này
        });
    });

    function slugify(text) {
        var unaccentedText = text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        return unaccentedText
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
});

// Xóa dữ liệu 
$(document).ready(function () {
    $('.btnDeleteAsk').on('click', function () {
        const id = $(this).data('id');
        const url = $(this).data('url');
        // Xóa vĩnh viễn
        $('.delete-forever').click(function () {
            $.ajax({
                url: url,
                type: 'DELETE',
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                success: function (data) {
                    console.log(data);
                    $('#deleteModal').modal('hide'); // Ẩn modal sau khi xóa thành công
                    $('.modal-backdrop.fade.show').addClass('d-none');
                    $(`tr[data-id="${id}"]`).remove(); // Xóa hàng trong bảng
                    window.location.reload()
                },
                error: function (error) {
                    alert('Bạn không có quyền thực hiện hành động này!')
                }
            });
        });
    });
});

