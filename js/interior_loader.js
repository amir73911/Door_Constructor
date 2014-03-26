function loadInteriorLoader() {

    // Оповещение по умолчанию
    var errMessage = 0;

    // Кнопка выбора файлов
    var defaultUploadBtn = $('#uploadbtn');

    // Массив для всех изображений
    var dataArray = [];

    // Область информер о загруженных изображениях - скрыта
    $('.uploaded_interior').hide();

    defaultUploadBtn.on('change', function() {
        // Заполняем массив выбранными изображениями
        var files = [];
        files = $(this)[0].files;
        // Передаем массив с файлами в функцию загрузки на предпросмотр
        loadInView(files);
    });

    // Функция загрузки изображений на предросмотр
    function loadInView(files) {
        // Показываем обасть предпросмотра
        $('.uploaded_interior').removeAttr("style").show();

        // Для каждого файла
        $.each(files, function(index, file) {

            // Несколько оповещений при попытке загрузить не изображение
            if (!files[index].type.match('image.*')) {

                if(errMessage == 0) {
                    $('#drop-files p').html('Эй! только изображения!');
                    ++errMessage
                }
                else if(errMessage == 1) {
                    $('#drop-files p').html('Стоп! Загружаются только изображения!');
                    ++errMessage
                }
                else if(errMessage == 2) {
                    $('#drop-files p').html("Не умеешь читать? Только изображения!");
                    ++errMessage
                }
                else if(errMessage == 3) {
                    $('#drop-files p').html("Хорошо! Продолжай в том же духе");
                    errMessage = 0;
                }
                return false;
            }

            // Создаем новый экземпляра FileReader
            var fileReader = new FileReader();
            // Инициируем функцию FileReader
            fileReader.onload = (function(file) {
                return function(e) {
                    // Помещаем URI изображения в массив
                    dataArray.push({name : file.name, value : this.result});

                    addImage((dataArray.length-1));
                };

            })(files[index]);
            // Производим чтение картинки по URI
            fileReader.readAsDataURL(file);
        });
        return false;
    }

    // Процедура добавления эскизов на страницу
    function addImage(ind) {
        // Если индекс отрицательный значит выводим весь массив изображений
        if (ind < 0 ) {
            start = 0; end = dataArray.length;
        } else {
            // иначе только определенное изображение
            start = ind; end = ind+1;
        }
        // Цикл для каждого элемента массива
        for (i = start; i < end; i++) {
            // размещаем загруженные изображения
            $('.uploaded_interior').css({'background': 'url('+dataArray[i].value+')'});
        }
        return false;
    }

}
