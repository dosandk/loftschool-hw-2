var app = {
    initialize: function () {
        var self = this;

        console.log('application was initialized');
        self.addEventsListeners();
        self.orderFormValidationInit();
        self.jCarouselInit();
    },
    addEventsListeners: function () {
        var self = this;

        self.scrollTopEvent();
    }
};

app.orderFormValidationInit = function () {
    var self = this;

    $('#call-order-form').validate({
        rules: {
            userName: 'required',
            userPhoneNumber: 'required',
            userMessage: 'required'
        },
        messages: {
            userName: 'введите имя',
            userPhoneNumber: 'ваш телефон',
            userMessage: 'введите сообщение'
        },
        errorPlacement: function(error, element){
            error.appendTo(element.next('.error-wrapper'));
        },
        submitHandler: function(form) {

            console.log($(form).serialize());

            $.ajax({
                url: '../php-core/order-form.php',
                type: 'POST',
                data: $(form).serialize()
            })
                .done(function(data) {
                    $(form)[0].reset();
                    console.log(data);
                }).fail(function(error) {
                    //console.log('fail');
                }).always(function() {
                    //console.log('always');
                });
        }
    });
};

app.scrollTopEvent = function() {
    var self = this,
        delay = 400;

    $('#scroll-top-btn').on('click', function() {
        if ($(document).scrollTop() > 0) {
            $('html, body').animate({scrollTop: 0}, delay);
        }
    })
};

app.jCarouselInit = function() {
    $('.jcarousel').jcarousel({
        wrap: 'circular'
    });

    $('.jcarousel-control-prev').jcarouselControl({
        target: '-=1'
    });

    $('.jcarousel-control-next').jcarouselControl({
        target: '+=1'
    });
};