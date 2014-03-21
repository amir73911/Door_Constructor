$(function(){

    loadCollections();


});

function loadCollections() {
    $.getJSON('js/database/collections.json', function(json) {
        $.each(json, function (i, collection) {
            $(".collections .items")
                .append('<div class="item" id="collect-'+collection.code+'">' +
                            '<div class="collect_img"></div>'+
                            '<div class="collect_name">'+collection.name+'</div>'+
                        '</div>');
        });
    });

    $('.collections').on('click', '.item', function(){
        loadCollectionPreview(this.id);
        $('.variants').fadeOut();
    });
}

function loadCollectionPreview(collect_name) {
    var collect_name = collect_name.replace('collect-', '');

    var selected_door_data = [];

    $.getJSON('js/database/'+collect_name+'.json', function(json) {
        selected_door_data = json;
        $(".doors_in_collection").empty();
        $.each(json, function (i, door) {
            $(".doors_in_collection")
                .append('<div class="door" data-collection="'+collect_name+'" id="'+door.code+'">' +
                            '<div class="door_img"><i></i></div>'+
                            '<div class="door_name">'+door.name+'</div>'+
                        '</div>');
        });
    })
    .done(function() {
        $('.doors_in_collection').fadeIn();
    })
    .fail(function() {
        $('.doors_in_collection').fadeOut();
    });

    $('.doors_in_collection').on('click', '.door', function(){
        var door_name = this.id;
        var filteredData = [];
        filteredData = _.filter(selected_door_data, function(item) {
            return item.code == door_name;
        });
        if(filteredData[0].variant){loadDoorOptions(filteredData[0]);}
        $('.doors_in_collection').fadeOut();
    });

}

function loadDoorOptions(filteredData) {

    var door_data = filteredData;




    var woods_ids = _.uniq(_.pluck(door_data.variant, 'wood')); // доступные типы шпона для выбранной двери [1,2,3]
    var glass_ids = _.uniq(_.pluck(door_data.variant, 'glass')); // доступные типы остекления для выбранной двери [1,2,3]
    var form_ids = _.uniq(_.pluck(door_data.variant, 'form')); // доступные типы остекления для выбранной двери [1,2,3]

    var wood_tag = $('.options .wood .option_value');
    var glass_tag = $('.options .glass .option_value');
    var form_tag = $('.options .form .option_value');

    $.getJSON('js/database/wood.json', function(wood_json) {
        var woods = [];
        for (var i in woods_ids) {
            woods.push(_.filter(wood_json, function(item) {
                return item.id == woods_ids[i];
            }));
        }
        wood_tag.html(woods[0][0].name);

        $('.options .wood .variants').empty();
        $.each(woods, function (i, option) {
            $('.options .wood .variants')
                .append('<div class="variant_item" id="'+option[0].code+'" data-id="'+option[0].id+'">' +
                            '<div class="variant_img"></div>'+
                            '<div class="variant_value">'+option[0].name+'</div>'+
                        '</div>');
        });
        $('.options .wood .variants .variant_item').first().addClass('selected');
    });

    $.getJSON('js/database/glass.json', function(glass_json) {

        var glasses = [];
        for (var i in glass_ids) {
            glasses.push(_.filter(glass_json, function(item) {
                return item.id == glass_ids[i];
            }));
        }
        glass_tag.html(glasses[0][0].name); // первый параметр из всех

        $('.options .glass .variants').empty();
        $.each(glasses, function (i, option) {
            $('.options .glass .variants')
                .append('<div class="variant_item" id="'+option[0].code+'" data-id="'+option[0].id+'">' +
                            '<div class="variant_img"></div>'+
                            '<div class="variant_value">'+option[0].name+'</div>'+
                        '</div>');
        });
        $('.options .glass .variants .variant_item').first().addClass('selected');

    });

    $.getJSON('js/database/form.json', function(form_json) {
        var forms = [];
        for (var i in form_ids) {
            forms.push(_.filter(form_json, function(item) {
                return item.id == form_ids[i];
            }));
        }
        form_tag.html(forms[0][0].name);

        $('.options .form .variants').empty();
        $.each(forms, function (i, option) {
            $('.options .form .variants')
                .append('<div class="variant_item" id="'+option[0].code+'" data-id="'+option[0].id+'">' +
                            '<div class="variant_img"></div>'+
                            '<div class="variant_value">'+option[0].name+'</div>'+
                        '</div>');
        });
        $('.options .form .variants .variant_item').first().addClass('selected');
    });

    $('.option_value').on('click', function(){
        $('.variants').stop(1,1).fadeOut();
        $(this).siblings('.variants').stop(1,1).fadeToggle();
    });


    window.selected_door_code = door_data;
    $('.variants').on('click', '.variant_item', function(){
        $('.variants').fadeOut();
        var this_variant_item = $(this);
        var all_variant_items = $('.variant_item');
        var in_variant_items = $(this).parents('.variants').find('.variant_item');

        in_variant_items.removeClass('selected');
        this_variant_item.addClass('selected');

        var a = [];
        var b = {};
        $.each($('.variant_item.selected'), function () {
            a.push($(this).data('id'));
        });
        b = _.object(['wood', 'glass', 'form'], a);

        var filterData = _.where(selected_door_code.variant, b);
        loadDoorImage(filterData[0].path);

    });



    //var door_img_src = 'doors_collections/'+collect_name+'/'+door_data[0].code+'/';


    var img = new Image();
    img.src = door_data.variant[0].path;
    img.onload = function() {
        $('.constructor_container .door').css({
                'width': this.width,
                'height': this.height,
                'marginLeft': -this.width/2,
                'background': 'url("'+img.src+'")'
            }).fadeIn(300);
    };
}

function loadDoorImage(path) {
    var img = new Image();
    img.src = path;
    img.onload = function() {
        $('.constructor_container .door').css({
            'width': this.width,
            'height': this.height,
            'marginLeft': -this.width/2,
            'background': 'url("'+img.src+'")'
        }).fadeIn(200);
    };
}