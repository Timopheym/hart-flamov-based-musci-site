document.getElementById('title').innerHTML = 'Загрузка.';
var MB = {};
var Player = {};

var LastFM = {
    user : {}
};

function uppodInit(playerID) {
    uppodSend("player1", 'play');
    Player.init = true;
    setTimeout(function () {
        uppodSend('player1', 'v' + Player.volume.getValue())
        Player.volume.setValue(Player.volume.getValue());
        document.getElementById("levelVolume").innerHTML = Player.volume.getValue();
    }, 100)
    //Player.volume.setValue(uppodGet("player1", 'getv'));
    //valueVolume.style.height = volume.offsetHeight * (curVolume / 100) + 'px';
    if (!App.radio) { App.s = setInterval(Player.q, 300) }
};

function uppodTheEnd() {
    //alert(32);
    if (App.radio) {
        uppodSend("player1", 'stop');
        setTimeout(function () {
            uppodSend("player1", 'file\:' + App.currentRadio.url);
            uppodSend("player1", 'play');
            //alert(41);
        }, 1000)
    }else {
        setTimeout(Player.next, 300);

    }
    //
}

function uppodOnEnd(playerID) {
    //alert(42);
}

function uppodErrorReport() {
    if (!App.radio) {
        Player.next()
    }
}

document.getElementById("meridian").onclick = function () {
    if (!App.loaded){ return 1 }
    if (App.popupLastFM) {
        App.popupLastFM = false;
        document.getElementById("settingsScreen").style.display = "none";
        return 1
    }
    App.popupLastFM = true;
    var listEl = [];
    document.getElementById("settingsScreen").style.display = "block";
    document.getElementById("settingsScreen").style.left = '-15px';
    App.util.anim(document.getElementById("settingsScreen"), "left", 0, 100);
    //if (App.define.animation) {
    //    $(document.getElementById("settingsScreen")).slide("in", { direction: "left" })
    //}
    var div = document.getElementById("listSettings");
    div.innerHTML = '';
    function hideSettings() {
        document.getElementById("mainSettings").style.display = "none";
        document.getElementById("lastfmSettings").style.display = "none";
        document.getElementById("aboutApp").style.display = 'none'
    }
    function hideList() {
        for (var i = 0; i < listEl.length; i++) {
            listEl[i].className = "aspan";
        }
    }

    var item1 = document.createElement("div");
    item1.innerHTML = "общие";
    item1.onclick = function () {
        hideSettings();
        hideList();
        this.className = "aspanAk";
        document.getElementById("mainSettings").style.display = "block";
    }
    listEl.push(item1);
    item1.className = "aspan";
    div.appendChild(item1);
    item1.onclick();


    var item2 = document.createElement("div");
    item2.innerHTML = "last.fm";
    item2.onclick = function () {
        hideSettings();
        hideList();
        this.className = "aspanAk";
        document.getElementById("lastfmSettings").style.display = "block";
        setTimeout(function () {
            Player.scrobTimeSlider.setValue(App.scrobTime);
        }, 100)

    }
    listEl.push(item2)
    item2.className = "aspan";
    div.appendChild(item2);

    var item3 = document.createElement("div");
    item3.innerHTML = "о приложении";
    item3.onclick = function () {
        hideSettings();
        hideList();
        this.className = "aspanAk";
        document.getElementById("aboutApp").style.display = "block";
    }
    listEl.push(item3)
    item3.className = "aspan";
    div.appendChild(item3);

    document.getElementById("saveSettings").onclick = App.saveUser;
    document.getElementById("cancelSettings").onclick = function () {
        App.popupLastFM = false;
        document.getElementById("settingsScreen").style.display = "none";
    };
}


document.getElementById('scrob').onclick = function () {
    if (App.popupLastFM) { return 1 }
    App.popupLastFM = true;
    var shadow = document.getElementById('shadow');
    shadow.style.display = 'block';
    var div = document.createElement('div');
    div.className = 'formLastFM';
    shadow.appendChild(div);
    var field = document.createElement('fieldset');
    var legend = document.createElement('legend');
    legend.innerHTML = 'Авторизация Last.fm';
    field.appendChild(legend);
    div.appendChild(field);
    var chek = '<br/><input id="likeEQLove" check type="checkbox" ';
    if (App.define.likeEQLove) {
        chek += 'checked="checked"';
    }
    chek += '><span class="comment"> Помечать треки как “любимые” на Last.fm при добавлении к себе в аудиозаписи</span>'
    if (LastFM.scrob) {
        field.innerHTML += '<input type="text" id="username" value="' + LastFM.userName + '" /> Имя <br /><input type="password" id="password" value="' + LastFM.password + '" /> Пароль ' + chek + '<br /> <button id="saveButton"> Сохранить </button> <button id="cancelButton"> Отмена </button> <a class="reg" href="http:\/\/www.lastfm.ru/join" > Регистрация </a>';
    } else {
        field.innerHTML += '<input type="text" id="username" /> Имя <br /><input type="password" id="password" /> Пароль ' + chek + '<br /> <button id="saveButton"> Сохранить </button> <button id="cancelButton"> Отмена </button> <a class="reg" href="http:\/\/www.lastfm.ru/join" > Регистрация </a>';
    }
    shadow.style.display = 'block';
    document.getElementById('saveButton').onclick = App.saveUser;
    document.getElementById('cancelButton').onclick = function () {
        document.getElementById('shadow').style.display = 'none';
        document.getElementById('shadow').innerHTML = '';
        App.popupLastFM = false;
    }
}

document.getElementById("find").onfocus = function () {
    if (!App.loaded){ return 1 }
    this.value = '';
    this.style.color = 'black';
    if (App.searchState == "группа") {


        //
        var d = document.createElement("div");
        d.id = "tooltip";
        d.style.top = this.offsetTop + this.offsetHeight + 2 + 'px';
        d.style.left = this.offsetLeft + 'px';
        d.style.width = this.offsetWidth + 'px';

        for (var i = 0; i < 4; i++) {
            if (App.lastGrp && App.lastGrp[i]) {
                var div = document.createElement("div");
                div.innerHTML = App.lastGrp[i];
                div.dataText = App.lastGrp[i];
                div.onclick = function () {
                    document.getElementById("find").value = this.dataText.replace("&amp;", "&").replace("&#39;", "'");
                    App.suche(this.dataText.replace("&amp;", "&").replace("&#39;", "'"));
                    if (document.getElementById("tooltip")) {
                        document.getElementById("tooltip").parentNode.removeChild(document.getElementById("tooltip"));
                    }
                }
                d.appendChild(div);
            }
        }
    }else if (App.searchState == "тэг") {
        var d = document.createElement("div");
        d.id = "tooltip";
        d.style.top = this.offsetTop + this.offsetHeight + 2 + 'px';
        d.style.left = this.offsetLeft + 'px';
        d.style.width = this.offsetWidth + 'px';

        for (var i = 0; i < 4; i++) {
            if (App.lastTags && App.lastTags[i]) {
                var div = document.createElement("div");
                div.innerHTML = App.lastTags[i];
                div.dataText = App.lastTags[i];
                div.onclick = function () {
                    document.getElementById("find").value = this.dataText.replace("&amp;", "&").replace("&#39;", "'");
                    LastFM.findTag(this.dataText.replace("&amp;", "&").replace("&#39;", "'"));
                    if (document.getElementById("tooltip")) {
                        document.getElementById("tooltip").parentNode.removeChild(document.getElementById("tooltip"));
                    }
                }
                d.appendChild(div);
            }
        }
    }
    else {
        return 1;
    }
    d.currentDiv = 0;
    this.parentNode.appendChild(d);
}
document.getElementById("find").onblur = function () {
    if (!App.loaded){ return 1 }
    //alert();
    this.style.color = 'silver';
    if (this.value == '') {
        switch (document.getElementById("value").innerHTML) {
            case "группа":
                this.value = 'Искать группу';
                break;
            case "тэг":
                this.value = 'Искать тэг';
                break;
            case "vk.com":
                this.value = 'Искать вконтакте ';
                break;
            default: this.value = 'Искать ';
                break;

        }
    }
    setTimeout(function () {
        if (document.getElementById("tooltip")) {
            document.getElementById("tooltip").parentNode.removeChild(document.getElementById("tooltip"));
        }
    }, 200)

}

document.getElementById("find").onkeyup = function (e) {
    if (!App.loaded){ return 1 }
    var event = e || window.event;
    //if (document.getElementById("find").backValue == document.getElementById("find").value) { return 1 }
    var d = document.getElementById("tooltip");
    document.getElementById("find").backValue = document.getElementById("find").value;
    switch (event.keyCode ? event.keyCode : event.which ? event.which : null) {
        case 0x26:
            //up
            return 1;
            break;
        case 0x28:
            return 1;
            //down
            break;
        case 13:
            if (App.searchState == "группа") {
                App.suche(document.getElementById("find").value)
            }else if (App.searchState == "тэг") {
                LastFM.findTag(document.getElementById("find").value)
            }else if (App.searchState == "vk.com") {
                App.searchVK(document.getElementById("find").value)
            }
            return 1;
            break
    }
    if (App.searchState == "группа") {
        d.innerHTML = '';
        d.style.display = 'block';
        var k = 0;
        if (App.lastGrp && App.lastGrp.length > 0) {
            for (var i = 0; i < App.lastGrp.length; i++) {
                if (App.lastGrp[i] && App.lastGrp[i].toLowerCase().indexOf(this.value.toLowerCase()) != -1) {
                    var div = document.createElement("div");

                    div.innerHTML = App.lastGrp[i];
                    div.dataText = App.lastGrp[i];
                    if (document.getElementById("find").value != '') {
                        var pos = div.innerHTML.toLowerCase().indexOf(document.getElementById("find").value.toLowerCase())
                        var str1 = div.firstChild.nodeValue.substring(0, pos);
                        var str2 = '<span class="colorText">' + div.firstChild.nodeValue.substring(pos, pos + document.getElementById("find").value.length) + '</span>';
                        var str3 = div.firstChild.nodeValue.substring(pos + document.getElementById("find").value.length);
                        div.innerHTML = str1 + str2 + str3;
                    }




                    div.onclick = function () {
                        document.getElementById("find").value = this.dataText.replace("&amp;", "&").replace("&#39;", "'");
                        App.suche(this.dataText.replace("&amp;", "&").replace("&#39;", "'"))
                        document.getElementById("tooltip").parentNode.removeChild(document.getElementById("tooltip"));
                    }
                    d.appendChild(div);
                    k++;
                    if (k > 2){ break }
                }
            }
        }
        App.tooltip = d;
        //App.suggest = document.getElementById("find").value.length;
        //d.appendChild(document.createElement("hr"));

        var s = document.createElement("script");
        s.src = 'http://developer.echonest.com/api/v4/artist/suggest?api%5Fkey=F21KT0VKI1NVX3CIF&name=' + encodeURIComponent(document.getElementById("find").value) + '&results=5&format=jsonp&callback=App.addTooltip'
        document.body.appendChild(s);

    }else if (App.searchState == "тэг") {
        d.innerHTML = '';
        d.style.display = 'block';
        var k = 0;
        if (App.lastTags && App.lastTags.length > 0) {
            for (var i = 0; i < App.lastTags.length; i++) {
                if (App.lastTags[i] && App.lastTags[i].toLowerCase().indexOf(this.value.toLowerCase()) != -1) {
                    var div = document.createElement("div");

                    div.innerHTML = App.lastTags[i];
                    div.dataText = App.lastTags[i];
                    if (document.getElementById("find").value != '') {
                        var pos = div.innerHTML.toLowerCase().indexOf(document.getElementById("find").value.toLowerCase())
                        var str1 = div.firstChild.nodeValue.substring(0, pos);
                        var str2 = '<span class="colorText">' + div.firstChild.nodeValue.substring(pos, pos + document.getElementById("find").value.length) + '</span>';
                        var str3 = div.firstChild.nodeValue.substring(pos + document.getElementById("find").value.length);
                        div.innerHTML = str1 + str2 + str3;
                    }




                    div.onclick = function () {
                        document.getElementById("find").value = this.dataText.replace("&amp;", "&").replace("&#39;", "'");
                        LastFM.findTag(this.dataText.replace("&amp;", "&").replace("&#39;", "'"));
                        document.getElementById("tooltip").parentNode.removeChild(document.getElementById("tooltip"));
                    }
                    d.appendChild(div);
                    k++;
                    if (k > 2){ break }
                }
            }
        }
        App.tooltip = d;

    }

    //if (k == 0)  d.style.display = 'none';
    //var ch = document.getElementById("tooltip").childNodes;
    //for (var i = 0; i < ch.length; i++) {
    //    ch[i].className = '';
    //}
    //ch[d.currentDiv - 1].className = "active";
    //this.value = ch[d.currentDiv - 1].innerHTML;
}


document.getElementById("find").onkeydown = function (e) {
    if (!App.loaded){ return 1 }
    if (App.searchState != "группа"){ return 1 }
    var event = e || window.event;
    var d = document.getElementById("tooltip")
    switch (event.keyCode ? event.keyCode : event.which ? event.which : null) {
        case 0x26:
            //up
            d.currentDiv--;
            if (d.currentDiv < 1){ d.currentDiv = d.childNodes.length };
            break;
        case 0x28:
            d.currentDiv++;
            if (d.currentDiv > d.childNodes.length){ d.currentDiv = 1 };
            //down
            break;
        default:
            return 1;
            break;
    }

    var ch = document.getElementById("tooltip").childNodes;

    for (var i = 0; i < ch.length; i++) {
        ch[i].className = '';
    }
    if (ch[d.currentDiv - 1]) {
        ch[d.currentDiv - 1].innerHTML = ch[d.currentDiv - 1].dataText;
        ch[d.currentDiv - 1].className = "active";
        this.value = ch[d.currentDiv - 1].dataText;
    }
}
document.onunload = function () {
    alert('bye');
}

document.getElementById("leader").onclick = function () {
    App.suche(this.innerHTML);
}

document.getElementById('title').innerHTML = 'Загрузка..';

MB.requestAlbums = function (mbid, noCache) {
    MB.find = true;
    MB.mbid = mbid;
    var rnd = Math.round(Math.random() * MB.pipes_id.length);
    var pipe_id = MB.pipes_id[rnd];// 'f1ba0b64f66d54d6d36e8cd036fc7d3e';//bffe0119b6f1d70c57c4edd0679121e1//
    if (noCache) {
        var soul = '&' + Math.random();
    }
    else {
        var soul = "";
    }
    if (!window.opera) {
        var xhrObject = window.XDomainRequest || XMLHttpRequest;
        var xhr = new xhrObject();
        var art = encodeURIComponent(LastFM.artistName);//1f36a3a2-9687-4819-ac55-54d7ff0b8b88
        var url = 'http:' + '//pipes.yahoo.com/pipes/pipe.run?_id=' + pipe_id + '&_render=json&api_key=b25b959554ed76058ac220b7b2e0a026&artistmbid=' + mbid + '&artistname=' + art + soul;
        //var url = 'http://' + 'pipes.yahoo.com/pipes/pipe.run?_id=f1ba0b64f66d54d6d36e8cd036fc7d3e&_render=json&api_key=b25b959554ed76058ac220b7b2e0a026&artistmbid=f4a31f0a-51dd-4fa7-986d-3095c40c5ed9&artistname=Evanescence'
        xhr.open('GET', url, true);
        xhr.onload = MB.responceAlbums;
        MB.xhr = xhr;
        xhr.send();
        MB.find = true;

    }else {
        //     "http://pipes.yahoo.com/pipes/pipe.run?u="+ encodeURIComponent(url) + "&_id=332d9216d8910ba39e6c2577fd321a6a&_render=json&_callback=" + callback name
        MB.operaB = setInterval(function () {
            if (!MB.operaB){ return 1 };
            MB.mbid = mbid;
            var rnd = Math.round(Math.random() * MB.pipes_id.length);
            var pipe_id = MB.pipes_id[rnd];
            var url = 'http:' + '//pipes.yahoo.com/pipes/pipe.run?_id=' + pipe_id + '&_render=json&api_key=b25b959554ed76058ac220b7b2e0a026&artistmbid=' + mbid + '&artistname=' + LastFM.artistName;
            //var url = encodeURIComponent('http:' + '//pipes.yahoo.com/pipes/pipe.run?_id=' + pipe_id + '&_render=json&api_key=b25b959554ed76058ac220b7b2e0a026&artistmbid=' + mbid + '&artistname=' + LastFM.artistName);
            var s = document.createElement("script");
            s.src = url + '&_callback=MB.responceAlbums&' + Math.random();
            //s.src = "http://pipes.yahoo.com/pipes/pipe.run?u=" + url + "&_id=332d9216d8910ba39e6c2577fd321a6a&_render=json&_callback=MB.responceAlbums&" + Math.random();
            document.body.appendChild(s);
        }, 5000)

        MB.mbid = mbid;
        var rnd = Math.round(Math.random() * MB.pipes_id.length);
        var pipe_id = MB.pipes_id[rnd];
        var url = 'http:' + '//pipes.yahoo.com/pipes/pipe.run?_id=' + pipe_id + '&_render=json&api_key=b25b959554ed76058ac220b7b2e0a026&artistmbid=' + mbid + '&artistname=' + LastFM.artistName;
        var s = document.createElement("script");
        s.src = url + '&_callback=MB.responceAlbums&' + Math.random();
        //s.src = "http://pipes.yahoo.com/pipes/pipe.run?u=" + url + "&_id=332d9216d8910ba39e6c2577fd321a6a&_render=json&_callback=MB.responceAlbums&" + Math.random();
        document.body.appendChild(s);
    }
}

MB.resposeMBID = function (data) {
    //{"response": {"status": {"version": "4.2", "code": 0, "message": "Success"}, "artists": [{"foreign_ids": [{"catalog": "musicbrainz", "foreign_id": "musicbrainz:artist:1f36a3a2-9687-4819-ac55-54d7ff0b8b88"}], "name": "Ария", "id": "ARO1Z2S1187B9ADA71"}]}}
    if (data.response.status && data.response.status.code == 0) {
        var field = data.response.artists[0].foreign_ids[0].foreign_id;
        var mbid = field.substring(field.lastIndexOf(":") + 1);
        MB.requestAlbums(mbid);
    }
}

MB.responceAlbums = function (data) {
    if (MB.operaB && data && data.value && data.value.items[0]) {
        clearInterval(MB.operaB)
        MB.operaB = false;
        var albums = data;
    }else {
        if (MB.xhr.status = 999 && MB.xhr.responseText.cont == 0) {
            setTimeout(function () {
                MB.requestAlbums(MB.mbid, true)
            }, 1500)
            return 1;
        }
        var albums = JSON.parse(MB.xhr.responseText);
    }


    if (!albums || albums.count == 0) {
        setTimeout(function () {
            MB.requestAlbums(MB.mbid, true)
        }, 1500)
        return 1;
    }
    document.getElementById("preload").style.display = 'none';
    MB.find = true;
    var list = document.getElementById("list");

    var alb = [];
    var singl = [];

    function arSort(a, b) {
        if (parseInt(a["first-release-date"]) > parseInt(b["first-release-date"])) {
            return -1
        }
        else if (parseInt(a["first-release-date"]) < parseInt(b["first-release-date"])) {
            return 1
        }else {
            return 0;
        }
    }

    albums.value.items.sort(arSort);
    listEl = list.el;
    MB.find = false;
    function qq(russ, eng) {
        var h3 = document.createElement("h3");
        h3.innerHTML = russ;
        list.appendChild(h3);

        for (var i = 0; i < albums.count; i++) {
            if (albums.value.items[i].type != eng){ continue; }
            var div = document.createElement('div');
            var img = document.createElement('img');
            if (albums.value.items[i].image) {
                img.src = albums.value.items[i].image[2];
            }else {
                img.src = 'img/cover_default.png';
            }//['#text'];
            //h4.innerHTML =
            div.appendChild(img);
            var span = document.createElement('span');
            span.innerHTML = albums.value.items[i].title;
            if (parseInt(albums.value.items[i]["first-release-date"])) {
                span.innerHTML += ' (' + parseInt(albums.value.items[i]["first-release-date"]) + ')'
            }
            div.appendChild(span);
            div.data = albums.value.items[i];
            div.className = 'album';

            div.onclick = function () {
                for (var l = 0; l < listEl.length; l++) {
                    if (l > 0) {
                        listEl[l].className = 'album';
                    }else {
                        listEl[l].className = 'best';
                    }
                }
                this.className = "currentAlbum"
                document.getElementById("preload").style.display = 'block';
                MB.requestAlbum(this.data.id);
            }
            list.appendChild(div)
            listEl.push(div);
        }
    }
    if (albums.count && albums.count > 0) {
        qq("Альбомы", "Album");
        qq("Синглы", "Single");
        // qq("EP", "EP");
        //qq("Сборники", "Compilation");
    }

    list.removeScrollBar();
    App.util.addScroll(list);
}

MB.requestAlbum = function (rid, noCache) {
    MB.rid = rid;
    MB.find_true = true;
    var rnd = Math.round(Math.random() * MB.pipes_id.length);
    var pipe_id = MB.pipes_id_albums[rnd]

    MB.pipes_id_albums
    if (noCache) {
        var soul = '&' + Math.random();
    }
    else {
        var soul = "";
    }
    if (!window.opera) {
        var xhrObject = window.XDomainRequest || XMLHttpRequest;
        var xhr = new xhrObject();
        //var art = encodeURIComponent(LastFM.artistName);//1f36a3a2-9687-4819-ac55-54d7ff0b8b88
        //var url = 'http:' + '//pipes.yahoo.com/pipes/pipe.run?_id=bffe0119b6f1d70c57c4edd0679121e1&_render=json&api_key=b25b959554ed76058ac220b7b2e0a026&artistmbid=' + mbid + '&artistname=' + art;
        var url = 'http://pipes.yahoo.com/pipes/pipe.run?_id=' + pipe_id + '&_render=json&albummbid=' + rid + soul;
        //var url = 'http://' + 'pipes.yahoo.com/pipes/pipe.run?_id=RrJubzf72xG4I4SW1fC6Jw&_render=json&artist='+art+'&type=Album+Official';
        xhr.open('GET', url, true);
        xhr.onload = MB.changeAlbum;
        MB.xhr = xhr;
        xhr.send();
    }else {
        MB.operaC = setInterval(function () {
            if (!MB.operaC){ return 1 };
            MB.rid = rid;
            MB.find_true = true;
            var rnd = Math.round(Math.random() * MB.pipes_id.length);
            var pipe_id = MB.pipes_id_albums[rnd];

            var url = 'http://pipes.yahoo.com/pipes/pipe.run?_id=' + pipe_id + '&_render=json&albummbid=' + rid;
            var s = document.createElement("script");
            url += "&_callback=MB.changeAlbum&" + Math.random();
            s.src = url;
            document.body.appendChild(s);
        }, 5000);

        var url = 'http://pipes.yahoo.com/pipes/pipe.run?_id=' + pipe_id + '&_render=json&albummbid=' + rid;
        var s = document.createElement("script");
        url += "&_callback=MB.changeAlbum&" + Math.random();
        s.src = url;
        document.body.appendChild(s);
    }
}

MB.changeAlbum = function (data) {
    if (data && data.value) {
        var res = data;
        clearInterval(MB.operaC)
        MB.operaC = false;
    }else {
        var res = JSON.parse(MB.xhr.responseText)
    }

    if (!res) {
        setTimeout(function () {
            MB.requestAlbum(MB.rid, true)
        }, 1000)
    }
    LastFM.album = '42';
    if (res.count > 0) {
        if (res.value.items && res.value.items.length) {
            var max = 0;
            var album = 0;
            for (var i = 0; i < res.value.items.length; i++) {
                if (res.value.items[i]["medium-list"].medium && res.value.items[i]["medium-list"].medium.length) {
                    var MBTracks = res.value.items[i]["medium-list"].medium[0]["track-list"].track;
                    MBTracks = MBTracks.concat(res.value.items[i]["medium-list"].medium[1]["track-list"].track)
                    if (MBTracks.length > max) {
                        var album = MBTracks;
                        max = MBTracks.length;
                    }
                    LastFM.album = res.value.items[i].title;
                }else {
                    if (res.value.items[i]["medium-list"].medium.length) {
                        var MBTracks = res.value.items[i]["medium-list"].medium[0]["track-list"].track;
                        MBTracks = MBTracks.concat(res.value.items[i]["medium-list"].medium[1]["track-list"].track)
                        LastFM.album = res.value.items[i].title;
                        if (MBTracks.length > max) {
                            var album = MBTracks;
                            max = MBTracks.length;
                        }
                    }else {
                        var MBTracks = res.value.items[i]["medium-list"].medium["track-list"].track;
                        LastFM.album = res.value.items[i].title;
                        if (MBTracks.length > max) {
                            var album = MBTracks;
                            max = MBTracks.length;
                        }
                    }
                }
            }
        }else {
            LastFM.album = res.value.items.title;
            var MBTracks = res.value.items["medium-list"].medium["track-list"].track;
            album = MBTracks;
        }

    } else {
        setTimeout(function () {
            MB.requestAlbum(MB.rid, true)
        }, 1000);
        return 1;
    }

    MBTracks = album;
    document.getElementById("preload").style.display = 'none';
    LastFM.tracks = [];
    for (var i = 0; i < MBTracks.length; i++) {
        var o = {};
        o.artist = {};
        o.artist.name = LastFM.artistName;
        o.duration = Math.round(MBTracks[i].recording.length / 1000);
        o.name = MBTracks[i].recording.title;
        LastFM.tracks.push(o);
    }


    document.getElementById("preload").style.display = 'none';
    //LastFM.tracks = data.album.tracks.track;

    var div = document.getElementById('playlist');
    //div.style.left = '165px';
    div.innerHTML = '';
    if (App.define.animation) {
        $(div).fade('in');
    }
    div.style.display = 'block';
    App.util.addScroll(div);



    if (LastFM.tracks && LastFM.tracks[0]) {
        for (var i = 0; i < LastFM.tracks.length; i++) {
            var track = document.createElement('div');
            var fullTime = LastFM.tracks[i].duration;
            var fullMin = Math.floor(fullTime / 60);
            var fullSec = Math.floor(fullTime - fullMin * 60);
            var time = fullMin + ':' + (fullSec.toString().length == 1 ? '0' + fullSec : fullSec);
            var span = document.createElement('span');
            span.innerHTML = time;
            span.className = 'duration';


            var song = document.createElement("h3");
            song.innerHTML = '<span class="numberTrack">' + (i + 1) + '</span>. ' + LastFM.tracks[i].name;

            var art = document.createElement("div");
            art.innerHTML = LastFM.tracks[i].artist.name;
            art.className = "art";
            track.art = art;
            track.className = "notFinded";

            track.appendChild(song);
            track.appendChild(art);
            track.appendChild(span);

            div.appendChild(track);

            //track.innerHTML = '<a id="' + 'aL' + (i + 1) + '" class="noA" onclick="return false">' + (i + 1) + '</a>. ' + LastFM.tracks[i].name;
            track.a = document.getElementById('aL' + (i + 1));


            track.appendChild(span)
            LastFM.tracks[i].div = track;
            LastFM.tracks[i].span = span;

        }
        if (App.state == 'tag') {
            Player.findTrackByTag();
        }else {
            Player.firstFind();
        }
        //Player.findTrack();
    } else {
        var track = document.createElement('div')
        track.innerHTML = 'Аудиозаписей не найдено'
        div.appendChild(track)
    }
};

if (document.getElementById("listSearch")) {
    var valueDiv = document.getElementById("value");
    var listDiv = document.getElementById("listBox");
    valueDiv.onclick = function () {
        listDiv.style.display = 'block';
        listDiv.onmouseover = function () {
            clearTimeout(listDiv.timeout);
        }
        listDiv.onmouseout = function () {
            listDiv.timeout = setTimeout(function myfunction() {
                listDiv.style.display = 'none';
            }, 800)
        }
        if (document.getElementById("tooltip")) {
            document.getElementById("tooltip").parentNode.removeChild(document.getElementById("tooltip"));
        }
        valueDiv.onmouseover = function () {
            clearTimeout(listDiv.timeout);
        }
        valueDiv.onmouseout = function () {
            listDiv.timeout = setTimeout(function myfunction() {
                listDiv.style.display = 'none';
            }, 800)
        }
    }
    var n = listDiv.childNodes;
    for (var i = 0; i < n.length; i++) {
        if (n[i].nodeType == 1) {
            n[i].onclick = function () {
                valueDiv.innerHTML = this.innerHTML;
                App.searchState = this.innerHTML;
                listDiv.style.display = 'none';
                switch (this.innerHTML) {
                    case "группа":
                        document.getElementById("find").value = 'Искать группу';
                        break;
                    case "тэг":
                        document.getElementById("find").value = 'Искать тэг';
                        break;
                    case "vk.com":
                        document.getElementById("find").value = 'Искать вконтакте ';
                        break;
                    default: this.value = 'Искать ';
                        break;
                }
            }
        }
    }
}
if (document.getElementById("addFrend")) {
    document.getElementById("addFrend").onclick = function () {
        VK.callMethod("showInviteBox");
    }
}
if (document.getElementById("AddToRightMenu")) {
    document.getElementById("AddToRightMenu").onclick = function () {
        VK.callMethod("showSettingsBox", 256);
    }
}
//