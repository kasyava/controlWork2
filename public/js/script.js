
let baseURL;
let msgList;

$(() => {

    mytest =(event) => {


            event.preventDefault();
            alert('rrrr');


    };

    let  user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')): null;
    let header=null;

    baseURL = location.href;
    msgList = $('#msgList');
    let formLoginModal = $("#formLoginModal");
    let formRegistrationModal = $("#formRegistrationModal");
    let formAddModal = $("#formAddModal");


    let fullPost = $("#fullPost");


    fullPost.on('hidden.bs.modal', function() {
        $(this).html("");

    });


    $("#addPhoto").click((e)=>{
        e.preventDefault();
        formAddModal.modal('show');
    });

    formAddModal.on('hidden.bs.modal', function() {
        $(this).find("input,textarea,select").val('').end();

    });



    $("#showLoginForm").click((e)=>{
        e.preventDefault();
        formLoginModal.modal('show');
    });

    formLoginModal.on('hidden.bs.modal', function() {
        $(this).find("input,textarea,select").val('').end();

    });
    $("#showRegistrationForm").click((e)=>{
        e.preventDefault();
        formRegistrationModal.modal('show');
    });

    formRegistrationModal.on('hidden.bs.modal', function() {
        $(this).find("input,textarea,select").val('').end();

    });




    const getQuery = (url) =>{
        return $.ajax(
            {
                url: url,
                type: 'GET',
                processData: false,
                contentType: false
            }
        );
    };

    getQuery('news').then(result => printNews(result));

    const printNews = async (data) => {
        let container = msgList;
        container.empty();
        $('#wrapper').append(container);
        for(let i = 0; i < data.length; i++) {
            let div = $('<div id="mess" class="col">');

            let title = $(`<p name="title" id="title${data[i]._id}">`).text("Title: " + data[i].title);

            let date = $(`<p  name="date" id="date${data[i]._id}">`).text("Date: " + data[i].date);

            let readFullPost = $(`<a  href="" name="fullPost" id="fullPost${data[i]._id}">`).text("Read full post >>");


            let image = $('<img class="rounded float-left img-thumbnail">');
            if (data[i].image) {
                image.attr("src", baseURL + "/uploads/" + data[i].image);
            } else {
                image.attr("src", baseURL + "/uploads/noimage.jpeg");
            }

            let imgDiv = $('<div id="mess" class="message-image">');
            imgDiv.append(image);

            //let divName = $('<div class="message-author">').append(title);
            let divText = $('<div class="message-text">').append(title, date, readFullPost);


            if (user !== null && user.role === 'admin') {
                let delPost = $(`<a id="delPost${data[i]._id}" href="">`).text("DELETE NEWS");
                divText.append('<br>', '<hr>',delPost);

            }

            div.append(imgDiv, /*divName,*/ divText);
            container.append(div);

            $(`#delPost${data[i]._id}`).on('click', (e)=>{

                e.preventDefault();

                $.ajax({
                    headers: header,
                    url: baseURL + 'news/' + data[i]._id,
                    type: 'DELETE',
                    processData: false,
                    contentType: false
                })
                    .then(responce => {
                        console.log(responce);
                        getQuery('news').then(result => printNews(result));
                    });


            });

            $(`#fullPost${data[i]._id}`).on('click', (e)=>{
                console.log(e);
                e.preventDefault();

                $.ajax({
                    headers: header,
                    url: baseURL + 'news/' + data[i]._id,
                    type: 'GET',
                    processData: false,
                    contentType: false
                })
                    .then(responce => {

                        responce = responce[0];
                        console.log(responce);


                        let modalFade = $(`#fullPost`);
                        let modalDialog = $(`<div class="modal-dialog modal-lg">`);
                        let modalContent = $(`<div class="modal-content">`);
                        let modalHeader = $(`<div class="modal-header">`);

                        let titlePop = $(`<h3 class="modal-title" id="lineModalLabelPopUp">`);
                        titlePop.text(responce.title);
                        modalHeader.append(titlePop);
                        modalContent.append(modalHeader);

                        let div2 = $(`<div id= "messPopUp" class="modal-body">`);

                        let modalFooter = $(`<div class="modal-footer">`);


                        let date = $(`<p  name="date" id="popdate${responce._id}">`).text("Date: " + responce.date);
                        let content = $(`<p  name="content" id="popcontent">`).text(responce.content);



                        let image = $('<img class="rounded float-left img-thumbnail">');
                        if (responce.image) {
                            image.attr("src", baseURL + "/uploads/" + responce.image);
                        } else {
                            image.attr("src", baseURL + "/uploads/noimage.jpeg");
                        }

                        let imgDiv = $('<div id="mess" class="message-image">');
                        imgDiv.append(image);

                        //let divName = $('<div class="message-author">').append(title);
                        let divText = $('<div class="message-text">').append(content, date);


                        let allComments = $(`<div id="" style='display: inline-block'>`);
                        $.ajax({
                            headers: header,
                            url: baseURL + 'comments/?news_id=' + responce._id,
                            type: 'GET',
                            processData: false,
                            contentType: false
                        })
                            .then(comments =>{


                                        comments.forEach((element) => {
                                            let listComments = $(`<div id="comment${element._id}" style='display: block'>`);
                                            let comment = $(`<p  name="comment" id="popcomment${element._id}">`).html("Author: " + element.author + "<br>" +element.comment);


                                            listComments.append('<br>', comment);

                                            if (user !== null && user.role === 'admin') {
                                                let delComment = $(`<a href="" id="delComment${element._id}" >`).text("DELETE Comment");


                                                listComments.append(delComment);

                                            }


                                            $(`body`).on('click', `#delComment${element._id}`, (e) =>{
                                                e.preventDefault();
                                                $.ajax({
                                                    headers: header,
                                                    url: baseURL + 'comments/' + element._id,
                                                    type: 'DELETE',
                                                    processData: false,
                                                    contentType: false
                                                })
                                                    .then(() =>{
                                                        $(`#comment${element._id}`).hide();
                                                    })

                                            });



                                            allComments.append(listComments);

                                        });


                            });
                //list += '</ul>';
                        div2.append(imgDiv, /*divName,*/ divText, '<br>', allComments);

                        modalContent.append(div2);
                        modalContent.append(modalFooter);
                        modalDialog.append(modalContent);
                        modalFade.append(modalDialog);



                       fullPost.modal('show');

                    });


            });

        }
    };

    let checkAuth = () =>{
        if(user!==null){
            header = {"Token":user.token};

            $( "#showLoginForm" ).hide();
            $( "#showRegistrationForm" ).hide();
            $( "#btnLogout" ).show();
            $('#addPhoto').show();

        }
        else{
            header= null;
            $('#addPhoto').hide();
            $( "#btnLogout" ).hide();
            $( "#showLoginForm" ).show();
            $( "#showRegistrationForm" ).show();
        }
    };

    checkAuth();

    $('#btnRegistration').on('click', (e) =>{
        e.preventDefault();

        const data = new FormData(document.getElementById('formRegistration'));

        $.ajax({
            url: 'http://localhost:8000/users',
            data: data,
            processData: false,
            contentType: false,
            type: 'POST'
        }).then(responce => {
            localStorage.setItem('user', JSON.stringify(responce));
            document.location.reload();
        });

    });


    $('#btnLogout').on('click', (e) => {
        e.preventDefault();

        if(user !== null){

            $.ajax({
                url: 'http://localhost:8000/users/sessions',
                headers: header,
                processData: false,
                contentType: false,
                type: 'DELETE'
            }).then(() =>{
                localStorage.removeItem('user');
                document.location.reload();

            })
        }

    });


    $('#btnLogin').on('click', (e) =>{
        e.preventDefault();

        const data = new FormData(document.getElementById('formLogin'));

        $.ajax({
            url: 'http://localhost:8000/users/sessions',
            data: data,
            headers: header,
            processData: false,
            contentType: false,
            type: 'POST'
        }).then(responce =>{
            localStorage.setItem('user', JSON.stringify(responce));
            document.location.reload();

        });

    });
    $('#btnAdd').on('click', (e) =>{
        e.preventDefault();

        const data = new FormData(document.getElementById('formAdd'));
        data.append('user', user.name);

        $.ajax({
            url: 'http://localhost:8000/photos/',
            data: data,
            headers: header,
            processData: false,
            contentType: false,
            type: 'POST'
        }).then(() =>{
            document.location.reload();
        });


    });





    const printPhotos = (data) =>{
        let container = msgList;
        container.empty();
        $('#wrapper').append(container);
        for(let i = 0; i < data.length; i++) {
            let div = $('<div id="mess" class="message-album">');

            let title = $(`<p  id="title${data[i]._id}">`).text("Title: " + data[i].title);
            let author = $(`<p  id="title${data[i]._id}">`).text("Author: " + data[i].user.username);

            let image = $(`<img id= "image${data[i]._id}" class="img-thumbnail" style="cursor:zoom-in;">`);
            if(data[i].photo) {
                image.attr("src", baseURL + "/uploads/" + data[i].photo);
            }
            else{
                image.attr("src", baseURL + "/uploads/noimage.jpeg");
            }


            div.append(image, title, author);

            if(user!==null && user.role==='admin') {
                let buttonDel = $(`<button id="btnDel${data[i]._id}" class="btn-link">Delete image</button>`);

                div.append(buttonDel);
            }
            container.append(div);


            $(`#btnDel${data[i]._id}`).on('click', () =>{
                $.ajax({
                    headers: header,
                    url: baseURL + 'photos/' + data[i]._id,
                    type: 'DELETE',
                    processData: false,
                    contentType: false
                })
                    .then(() => {
                        getQuery('photos').then(result => printPhotos(result));
                    });

            });



            $(`#image${data[i]._id}`).click(function(){
                let img = $(this);
                let src = img.attr('src');
                $("body").append("<div class='popup'>"+
                    "<div class='popup_bg'></div>"+
                    "<img src='"+src+"' class='popup_img' />"+
                    "</div>");
                $(".popup").fadeIn(50);
                $(".popup_bg").click(function(){
                    $(".popup").fadeOut(50);
                    setTimeout(function() {
                        $(".popup").remove();
                    }, 50);
                });
            });


        }
    };


});