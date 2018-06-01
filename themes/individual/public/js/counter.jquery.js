(function($) { 
    $.fn.counter = function(options) {
        const settings = $.extend({
            num: 1,
            min: 0,
            max: 1000,
            step: 1,
            onChange: () => {}
        }, options );

        this.each(function() {
            const $this = $(this)
            const $num = $this.find(".num");
            let num = settings.num;

            $num.text(num)
            
            $this.on('click', ".icon--plus", e => {
                num = num + 1 > settings.max ? settings.max : num + settings.step;

                $num.text(num);
                settings.onChange(num)
            })
            $this.on('click', ".icon--minus", e => {
                num = num - 1 < settings.min ? settings.min : num - settings.step;
                $num.text(num);
                settings.onChange(num)
            })
        });
 
        return this;
 
    };
 
}(jQuery));