$(function() {

	//for ie8
    var alertFallback = false;
    if (typeof console === "undefined" || typeof console.log === "undefined") {
        console = {};
        if (alertFallback) {
            console.log = function(msg) {
                alert(msg);
            };
        } else {
            console.log = function() {};
        }
    }

    $.itexUp({
        elementID: 'up', //ID элемента
        showButtonHeight: 300, //Высота прокрутки в пикселя, когда появляется кнопка
        speed: 1000 //Скорость прокрутки в милисекундах
    });

    $('table').wrap('<div class="table-responsive">');
    
	$('.hrefpop').fancybox();
	
    $('.navN .firstpage').attr('title', 'На первую');
    $('.navN .lastpage').attr('title', 'На последнюю');
	$('.navN .nextpage').attr('title', 'На следущую');
	$('.navN .prevpage').attr('title', 'На предыдущую');

	// img alt fix
	$('img').each(function(){
		if (!$(this).attr('alt')) { $(this).attr('alt',""); }
    });
    
    (() => {
        const order = {
            size: 'S',
            count: 1,
            delivery: null,
            address: null,
            payment: null,
            name: '',
            phone: '',
            email: '',
            comment: ''
        }
        let step = 1;

        //product gallery
        $('.product-gallery-main').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '.product-gallery-nav'
        });
        $('.product-gallery-nav').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: '.product-gallery-main',
            dots: false,
            focusOnSelect: true,
            vertical: true
        });

        //form counter
        $('.counter').counter({
            min: 1,
            num: order.count,
            onChange: num => {
                order.count = num
            }
        })

        //order
        $('.order-size')
        .val(order.size)
        .change(e => {
            const value = e.target.value;
            order.size = value;
        })

        $('#btn-order').click( e => {
            $('.order-form').removeClass('hide')
        })

        updateOrderStep = () => {
            if (order.size && order.count) {
                step = 1;
            }

            if (order.delivery) {
                step = 2;
            }

            if (order.address) {
                step = 3;
            }

            if (order.payment) {
                step = 4;
            }

            for (let i = 1; i <= 4; i++) {
                if (i <= step) {
                    $(`.order-step--${i}`).removeClass('hide')
                } else {
                    $(`.order-step--${i}`).addClass('hide')
                }

                if (i == step) {
                    $(`.order-step--${i}`).addClass('active')
                } else {                    
                    $(`.order-step--${i}`).removeClass('active')
                }
            }
        }

        $('.order-form input[type=radio]').change( e => {
            const target = e.target;
            const value = target.value;
            const name = target.name;
            const comment = target.dataset.comment;

            order[name] = value;

            $('.radio .comment').remove()

            if (comment) {
                $(target).closest('.radio').append(`<div class="comment">${comment}</div>`)
            }

            updateOrderStep()
        })

        $('.order-form input[type=text], .order-form input[type=email], .order-form textarea').change( e => {
            const target = e.target;
            const value = target.value;
            const name = target.name;

            order[name] = value;
        })

        $('.order-form .order-form-change').click( e => {
            e.preventDefault()

            const step = parseInt(e.target.dataset.step);
            
            document.querySelector(`.order-step--${step}`).classList.add('active')
        })

        $('#btn-order-done').click( e => {
            if (
                order.size &&
                order.count &&
                order.delivery &&
                order.address &&
                order.payment &&
                order.name &&
                order.phone &&
                order.email
            ) {
                document.querySelector('#modal-order-done').classList.remove('hide')
                document.querySelector('body').classList.add('modal-open')
                console.log(order)
                //clear order form
            } else {
                alert('Не все заполнено')
            }
        })

        $('#btn-order-done-close').click( e => {
            document.querySelector('#modal-order-done').classList.add('hide')
            document.querySelector('body').classList.remove('modal-open')
        })
    })()
    
});
