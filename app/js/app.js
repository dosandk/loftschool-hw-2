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
    var self = this,
        $callOrderForm = $('#call-order-form');

    $callOrderForm.validate({
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
        success: function(label) {
            console.error(1);
        },
        submitHandler: function(form) {
            $.ajax({
                url: '../php-core/order-form.php',
                type: 'POST',
                data: $(form).serialize()
            })
                .done(function(data) {
                    $(form)[0].reset();
                    console.log(data);
                }).fail(function(error) {
                    console.log(error);
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

app.initialize();