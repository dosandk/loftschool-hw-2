casper.
    start( 'http://vl-shevchuk.ru' ).
    then(function(){
        phantomcss.screenshot('.main-wrapper', 'main-wrapper');
    });

casper.run();