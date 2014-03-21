$(function(){
    //doors_in_collection_to_center();
});

function doors_in_collection_to_center() {
    var _this = $('.doors_in_collection');
    var width = _this.width();
    _this.css('margin-left' , -width/2);

}