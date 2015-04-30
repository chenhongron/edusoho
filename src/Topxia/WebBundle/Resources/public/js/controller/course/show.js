define(function(require, exports, module) {

    require('jquery.countdown');

    exports.run = function() {
        $('#teacher-carousel').carousel({
            interval: 0
        });
        $('#teacher-carousel').on('slide.bs.carousel', function(e) {
            var teacherId = $(e.relatedTarget).data('id');

            $('#teacher-detail').find('.teacher-item').removeClass('teacher-item-active');
            $('#teacher-detail').find('.teacher-item-' + teacherId).addClass('teacher-item-active');
        });

        var reviewTabInited = false;

        if (!reviewTabInited) {
            var $reviewTab = $("#course-review-pane-show");

            $.get($reviewTab.data('url'), function(html) {
                $reviewTab.html(html);
                reviewTabInited = true;
            });

            $reviewTab.on('click', '.pagination a', function(e) {
                e.preventDefault();
                $.get($(this).attr('href'), function(html) {
                    $reviewTab.html(html);
                });
            });
        }

        var $body = $(document.body);

        $body.scrollspy({
            target: '.course-nav-tabs',
            offset: 120
        });

        $(window).on('load', function() {
            $body.scrollspy('refresh');
        });

        $('#course-nav-tabs').affix({
            offset: {
                top: 300
            }
        });

        $(window).bind("scroll", function() {
            var vtop = $(document).scrollTop();
            if (vtop > 300) {
                $('li.pull-right').css("display", "inline");
            } else {
                $('li.pull-right').css("display", "none");
            }

        });



        $('#course-nav-tabs').on('click', '.btn-index', function(event) {
            event.preventDefault();
            var position = $($(this).data('anchor')).offset();
            var top = position.top - 50;
            $(document).scrollTop(top);
        });

        $("#favorite-btn").on('click', function() {
            var $btn = $(this);
            $.post($btn.data('url'), function() {
                $btn.hide();
                $("#unfavorite-btn").show();
            });
        });

        $("#unfavorite-btn").on('click', function() {
            var $btn = $(this);
            $.post($btn.data('url'), function() {
                $btn.hide();
                $("#favorite-btn").show();
            });
        });

        $(".cancel-refund").on('click', function() {
            if (!confirm('真的要取消退款吗？')) {
                return false;
            }

            $.post($(this).data('url'), function() {
                window.location.reload();
            });
        });

        $('.become-use-member-btn').on('click', function() {
            $.post($(this).data('url'), function(result) {
                if (result == true) {
                    window.location.reload();
                } else {
                    alert('加入学习失败，请联系管理员！');
                }
            }, 'json').error(function() {
                alert('加入学习失败，请联系管理员！');
            });
        });


        // fix for youku iframe player in firefox.
        $('#modal').on('shown.bs.modal', function() {
            $('#modal').removeClass('in');
        });

        var time = $('#discount-endtime-countdown').data('endtime');
        $('#discount-endtime-countdown').countdown(time, function(event) {
           var $this = $(this).html(event.strftime('剩余 '
             + '<span>%D</span> 天 '
             + '<span>%H</span> 时 '
             + '<span>%M</span> 分 '
             + '<span>%S</span> 秒'));
         }).on('finish.countdown', function() {
            $(this).html('活动时间到，正在刷新网页，请稍等...');
            setTimeout(function() {
                $.post(app.crontab, function(){
                    window.location.reload();
                });
            }, 2000);
         });

    };

});