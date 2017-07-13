/**
 * Created by danyun.lu on 2017/7/12.
 */

(function($){

    //定义相关变量
    var $image = $('#cropper-image');
    var $upload = $('#cropper-upload-img');
    var $button = $('#crop-button');
    var $result = $('#cropper-result');
    var $closeBtn = $("#cropper-close-btn");
    var $cropperPopup = $("#cropper-popup");
    var $columnDownload = $("#column-download");
    var croppable = false;
    var URL = window.URL || window.webkitURL;
    var blobURL,imgBlob;

    //base64转图片blob
    function convertBase64UrlToBlob(urlData){

        var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte

        //处理异常,将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(bytes.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }

        return new Blob( [ab] , {type : 'image/png'});
    }
    //下载blob
    function downFile(blob, fileName,e) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
        } else {
            if(document.getElementById("cropper-load-img")){
                var el = document.getElementById("cropper-load-img");
                el.parentNode.removeChild(el);
            }
            var link = document.createElement('a');
            link.id="cropper-load-img";
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
        }
    }

    //上传图片后的操作
    $upload.change(function(e){
        $cropperPopup.show();
        var files = this.files;
        var file;

        if (!$image.data('cropper')) {
            return;
        }

        if (files && files.length) {
            file = files[0];

            if (/^image\/\w+$/.test(file.type)) {
                blobURL = URL.createObjectURL(file);
                $image.one('built.cropper', function () {

                    // Revoke when load complete
                    URL.revokeObjectURL(blobURL);
                }).cropper('reset').cropper('replace', blobURL);
                $upload.val('');
            } else {
                window.alert('请选择一张图片!');
            }
        }
    });

    //初始化
    $image.cropper({
        aspectRatio: 16 / 9,
        viewMode: 1,
        built: function () {
            croppable = true;
        }
    });

    //准备对图片进行裁剪
    $button.on('click', function () {
        var img = new Image;
        var croppedCanvas;
        $cropperPopup.hide();

        if (!croppable) {
            return;
        }

        // Crop
        croppedCanvas = $image.cropper('getCroppedCanvas');
        // Show
        $image.crossOrigin = "anonymous" ;
        $result.html('<img src="' + croppedCanvas.toDataURL() + '">');

        //最终生成的文件；
        imgBlob = convertBase64UrlToBlob(croppedCanvas.toDataURL());

        //下载文件
        $columnDownload.off("click").bind("click",function(){
            downFile(imgBlob,"444");
        });

    });
    //关闭弹窗
    $closeBtn.on("click",function(){
        $cropperPopup.hide();
    })
})(jQuery);
