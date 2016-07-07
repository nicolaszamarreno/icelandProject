$(document).ready(function(){
   $('.navbar__menu li').click(function(){
      var scrollAttri = $(this).data('scroll');
      $('html, body').animate( { scrollTop: $('.'+ scrollAttri).offset().top }, 750 );
   });  

   var beginHeadband = $('.headband__band').offset().top;
   var heightHeadband = $('.headband__band').height();
   var endHeadband = beginHeadband + heightHeadband;   

   $(window).scroll(function(){
      var posNavUp = $('.navbar').offset().top;
      var posNavDown = $('.navbar').width() + $('.navbar').offset().top;

      if(posNavDown > beginHeadband && posNavDown < endHeadband || posNavUp < endHeadband && posNavUp > beginHeadband){
        $('.navbar__menu').addClass('navbar__menu--active');
      }
      else {
        $('.navbar__menu').removeClass('navbar__menu--active');
      }
   });

});