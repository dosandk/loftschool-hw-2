var app = {
    initialize: function () {
        var self = this;

        console.log('application was initialized');
        self.orderFormValidationInit();
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
                url: '',
                type: 'POST',
                data: $(form).serialize()
            })
                .done(function(data) {

                }).fail(function(error) {
                    //console.log('fail');
                }).always(function() {
                    //console.log('always');
                });
        }
    });
};