$(document).ready(function(){
   $('.navbar__menu li').click(function(){
      var scrollAttri = $(this).data('scroll');
      $('html, body').animate( { scrollTop: $('.'+ scrollAttri).offset().top }, 750 );
      if(scrollAttri == 'headband'){
         $('.navbar__menu li').css('color','#FFFFFF');
      }
      else {
         $('.navbar__menu li').css('color','#000000');
      }
   });  
});