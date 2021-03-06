/**
 * Created by https://trungquandev.com's author on 25/02/2018.
 */

const socket=io(); //khoi tao bien toan cuc socket

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function nineScrollRight(divId) {
  $('.right .chat[data-chat = '+divId+']').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $('.right .chat[data-chat = '+divId+']').scrollTop($('.right .chat[data-chat = '+divId+']')[0].scrollHeight);
}

function enableEmojioneArea(divId) {
  $('#write-chat-'+divId).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function(editor, event) {
        $('#write-chat-'+divId).val(this.getText());
      },
      click:function(){
        textWithEmoji(divId); 
        //bật chức năng người dùng gõ trò chuyện
        typingOn(divId);
      },
      blur:function(){
        typingOff(divId);
      }
    },
  });
  $('.icon-chat').bind('click', function(event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('#loader').css('display', 'none');
}

function spinLoading() {
  $('#loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function() {
      spinLoading();
    })
    .ajaxStop(function() {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function() {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function() {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(".main-content").click(function() {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images").unbind("click").on("click",function(){
    let href=$(this).attr("href");
    let modalImageId= href.replace("#","");
    //Lấy mã html của modal hình ảnh trước khi bị biến đổi grid
    let originImageModal=$('#'+modalImageId).find("div.modal-body").html();

    let countRows = Math.ceil($(href).find('div.all-images>img').length / layoutNumber);
  let layoutStr = new Array(countRows).fill(layoutNumber).join("");
  $(href).find('div.all-images').photosetGrid({
    highresLinks: true,
    rel: 'withhearts-gallery',
    gutter: '2px',
    layout: layoutStr,
    onComplete: function() {
      $(href).find('.all-images').css({
        'visibility': 'visible'
      });
      $(href).find('.all-images a').colorbox({
        photo: true,
        scalePhotos: true,
        maxHeight: '90%',
        maxWidth: '90%'
      });
    }
  });

  // trả lại HTML hình ảnh ban đầu khi tắt modal hình ảnh
  $('#'+modalImageId).on("hidden.bs.modal",function(){
  $(this).find("div.modal-body").html(originImageModal);
  })

  });
  
}

function addFriendsToGroup() {
  $('ul#group-chat-friends').find('div.add-user').bind('click', function() {
    let uid = $(this).data('uid');
    $(this).remove();
    let html = $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').html();

    let promise = new Promise(function(resolve, reject) {
      $('ul#friends-added').append(html);
      $('#groupChatModal .list-user-added').show();
      resolve(true);
    });
    promise.then(function(success) {
      $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').remove();
    });
  });
}

function cancelCreateGroup() {
  $('#cancel-group-chat').bind('click', function() {
    $('#groupChatModal .list-user-added').hide();
    if ($('ul#friends-added>li').length) {
      $('ul#friends-added>li').each(function(index) {
        $(this).remove();
      });
    }
  });
}

function flashMasterNotify(){
  let notify= $(".master-success-message").text();
  if(notify.length)
  {
    alertify.notify(notify,"success",7);
  }
}

//đổi type trò chuyện nhóm-cá nhân-all//
function changeTypeChat(){
  $("#select-type-chat").bind("change",function(){
    let optionSelected= $("option:selected", this);
    optionSelected.tab("show");
    if($(this).val()=== "user-chat"){
      $(".create-group-chat").hide();
    }else{
      $(".create-group-chat").show();
    }
  }); 
}

//khi chọn 1 tên liên lạc bên trái 
function chanceScreenChat(){
  $(".room-chat").unbind("click").on("click",function(){
    $(".person").removeClass("active");
    $(this).find("li").addClass("active"); 
    $(this).tab("show");
    // cau hinh thanh cuon ben box chat
    let divId= $(this).find("li").data("chat");
    nineScrollRight(divId);

     // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
    enableEmojioneArea(divId);
    // nạp gửi tin nhăn hình ảnh
    imageChat(divId);
    // nạp lắng nghe cuộc gọi video
    videoChat(divId);
  });
}
 function convertEmoji(){
  $(".convert-emoji").each(function() {
            var original = $(this).html();
            // use .shortnameToImage if only converting shortnames (for slightly better performance)
            var converted = emojione.toImage(original);
            $(this).html(converted);
        });
 }


$(document).ready(function() {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notificationsfsda
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();


  // Icon loading khi chạy ajax
  ajaxLoading();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
  addFriendsToGroup();

  // Action hủy việc tạo nhóm trò chuyện
  cancelCreateGroup();

  //thong bao dang nhap
  flashMasterNotify();

  //thay đổi kiểu trò chuyện
  changeTypeChat();

  //thay doi man hinh chat
  chanceScreenChat();

  //click vao phan tu dau tien khi load trang
  $("ul.people").find("a")[0].click();
  
  //convert unicode to imoji
  convertEmoji();

  //
  $('#video-chat-group').bind("click",function(){
    alertify.notify("Tính năng sẽ sớm được ra mắt!","error",7);
  });
});
