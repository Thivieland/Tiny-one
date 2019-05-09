! function($) {
  $(function() {

    // HEADER

    var header = $('.header'),
      hHeader = header.outerHeight();
    $(window).on('scroll', function() {
      hHeader = header.outerHeight();
      if ($(this).scrollTop() == 0) {
        header.removeClass('fixed');
      } else {
        header.addClass('fixed');
      }
    });

    //MENU
    function toggleF() {
      $('.open-menu').toggleClass('active');
      $('.menu-mb').toggleClass('active');
      $('.box-mask').toggleClass('active');
    }
    $('.open-menu, .box-mask, .btn-close').on('click', function() {
      toggleF();
    });

    //ANCHOR
    $('.anchor').on('click', function(e) {
      e.preventDefault();
      var target = $(this.hash);
      console.log(target.offset().top);
      $("html, body").animate({
        scrollTop: target.offset().top
      }, 1000, 'swing');
      if ($(this).parents('.menu-mb').length) {
        toggleF();
      }
    });

    // BANNER

    $('.main-banner').slick({
      dots: true,
      arrows: false,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 6000,
    });

  })
}(jQuery);
