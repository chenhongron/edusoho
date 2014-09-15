define(function(require, exports, module) {

    var Notify = require('common/bootstrap-notify');
    var Uploader = require('upload');
    var UploadPanel = require('edusoho.uploadpanel');

    exports.run = function() {

        var $form = $("#cloud-setting-form");
        var uploader = new Uploader({
            trigger: '#cloud-video-watermark-upload',
            name: 'watermark',
            action: $('#cloud-video-watermark-upload').data('url'),
            data: {'_csrf_token': $('meta[name=csrf-token]').attr('content') },
            accept: 'image/*',
            error: function(file) {
                Notify.danger('上传云视频水印失败，请重试！');
            },
            success: function(response) {
                response = $.parseJSON(response);
                $("#cloud-video-watermark-container").html('<img src="' + response.url + '">');
                $form.find('[name=video_watermark_image]').val(response.path);
                $("#cloud-video-watermark-remove").show();
                Notify.success('上传云视频水印成功！');
            }
        });


        $("#cloud-video-watermark-remove").on('click', function(){
            if (!confirm('确认要删除云视频水印吗？')) return false;
            var $btn = $(this);
            $.post($btn.data('url'), function(){
                $("#cloud-video-watermark-container").html('');
                $form.find('[name=video_watermark_image]').val('');
                $btn.hide();
                Notify.success('删除云视频水印成功！');
            }).error(function(){
                Notify.danger('删除云视频水印失败！');
            });
        });

        var uploadPanel = new UploadPanel({
            element: "#upload-panel"
        });

        uploadPanel.on("preUpload", function(uploader, file) {
            var data = {};
            var self=this;
            if (this.qualitySwitcher) {
                data.videoQuality = this.qualitySwitcher.get('videoQuality');
                data.audioQuality = this.qualitySwitcher.get('audioQuality');
                if (this.element.data('hlsEncrypted')) {
                    data.convertor = 'HLSEncryptedVideo';
                } else {
                    data.convertor = 'HLSVideo';
                }
            }

            $.ajax({
                url: this.element.data('paramsUrl'),
                async: false,
                dataType: 'json',
                data: data, 
                cache: false,
                success: function(response, status, jqXHR) {
                    uploader.setUploadURL(response.url);
                    uploader.setPostParams(response.postParams);
                },
                error: function(jqXHR, status, error) {
                    Notify.danger('请求上传授权码失败！');
                }
            });
        })
    }

})