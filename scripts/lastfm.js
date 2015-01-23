

LastFM.responceAddTrack = function (data) {
    //findTag
    //  alert(JSON.stringify(data))
}

LastFM.findTag = function (q) {
    document.getElementById("preload").style.display = 'block';
    setTimeout(function () {
        var scr = document.createElement('script');
        scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=tag.getInfo&tag=' + q + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceTagInfo&lang=ru';
        document.body.appendChild(scr)
    }, 170)



    //setTimeout(function () {
    //    var scr = document.createElement('script');
    //    scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=' + LastFM.currentTag + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceTagTracks&lang=ru&limit=50';
    //    document.body.appendChild(scr)
    //}, 770)
}

LastFM.responceTagInfo = function (data) {
    if (!data.error && data.tag && data.tag.name) {
        LastFM.tagName = LastFM.currentTag = data.tag.name
        VK.callMethod("setLocation", "tag=" + encodeURIComponent(data.tag.name));
        if (window.addJump) {
            window.addJump("tag", data.tag.name, data.tag.name);
        }
        if (document.getElementById("search1")) {
            document.getElementById("search1").onclick();
        }
        document.getElementById("preload").style.display = 'none';
        App.state = 'tag';
        App.MT = false;
        App.radio = false;
        App.clearAkMenu(true);
        App.clearPopup(true);
        document.getElementById("finding").className = "aspanAk"
        if (Player.init) {
            uppodSend("player1", 'stop');
        }
        clearInterval(App.radioInt);
        var div = document.getElementById('info');
        App.util.addScroll(div);
        div.innerHTML = '';
        //div.style.left = '632px'
        //div.style.width = '175px'
        div.style.display = 'block';
        var bio = document.createElement('div');
        bio.id = "bio";

        if (data.tag && data.tag.wiki && data.tag.wiki.summary) {
            LastFM.bio = App.util.removeTrash(data.tag.wiki.summary);
        }

        var h5 = document.createElement("h5");
        h5.innerHTML = data.tag.name.toLowerCase();
        bio.appendChild(h5);
        //bio.appendChild(document.createTextNode(text))
        div.appendChild(bio);

        for (var k = 0; k < App.lastTags.length; k++) {
            if (LastFM.currentTag == App.lastTags[k]) {
                for (var k2 = k; k2 < App.lastTags.length - 1; k2++) {
                    App.lastTags[k2] = App.lastTags[k2 + 1];
                }
            }
            if (typeof (App.lastTags[k]) != "string") {
                App.lastTags[k] = "";
            }
        }
        App.lastTags.unshift(decodeURIComponent(LastFM.currentTag));
        App.lastTags.length = 25;

        if (localStorage) {
            localStorage.setItem("mer_lastTags", App.lastTags);
        }

        setTimeout(function () {
            var scr = document.createElement('script');
            scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=tag.getSimilar&tag=' + LastFM.currentTag + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceTagSim&lang=ru&limit=5';
            document.body.appendChild(scr)
        }, 170)

        setTimeout(function () {
            var scr = document.createElement('script');
            scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=tag.getTopAlbums&tag=' + LastFM.currentTag + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceTagAlbums&lang=ru&limit=50';
            document.body.appendChild(scr)
        }, 470)
        //

    }else {
        App.showPopup("Введите тэг")
    }
}

LastFM.responceTagArtist = function (data) {
    var div = document.getElementById("bio");
    var sim = document.createElement('div');
    sim.id = 'similar2'
    sim.style.display = 'block';
    if (data.topartists && data.topartists.artist) {
        var simArt = data.topartists.artist;

        for (var i = 0; i < simArt.length; i++) {
            var li = document.createElement('div');
            var img = document.createElement("img");
            img.src = simArt[i].image[3]["#text"];
            li.appendChild(img);
            li.artist = simArt[i].name;
            var span = document.createElement("span");
            span.appendChild(document.createTextNode(simArt[i].name));
            li.appendChild(span);
            li.onclick = function () {
                document.getElementById('find').value = this.artist;
                App.radio = false;
                App.ultra.currentTrack = '';
                App.suche(this.artist);
            }
            sim.appendChild(li)
        }

    }
    div.appendChild(sim);
}

LastFM.responceTagSim = function (data) {
    var div = document.getElementById("bio");
    if (data.similartags && data.similartags.tag) {
        var tags = document.createElement('div');
        var tag = data.similartags.tag;
        tags.id = "tags";
        tags.style.display = "block";
        for (var i = 0; i < 4; i++) {
            var li = document.createElement('span');
            li.innerHTML = tag[i].name + ", ";
            li.onclick = function () {
                /*document.getElementById('find').value = this.innerHTML;
                    App.radio = false;
                    App.ultra.currentTrack = '';
                    App.suche(this.innerHTML);*/
                App.radio = false;
                App.ultra.currentTrack = '';
                LastFM.findTag(this.innerHTML)
            }
            tags.appendChild(li)
        }
        div.appendChild(tags);
    }
    setTimeout(function () {
        var scr = document.createElement('script');
        scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=tag.getTopArtists&tag=' + LastFM.currentTag + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceTagArtist&lang=ru&limit=5';
        document.body.appendChild(scr)
    }, 70)
}

LastFM.responceTagAlbums = function (data) {
    //alert(JSON.stringify(data));

    document.getElementById("preload").style.display = 'none';
    App.clearPopup();
    var listEl = [];
    var list = document.getElementById("list");
    //list.style.width = "165px"
    //var myTracks = document.getElementById("myTracks");
    //var d = document.getElementById("playlists");
    if (App.define.animation) {
        $(list).slide('in', { direction: "top" });
    }
    list.innerHTML = '';
    list.style.display = 'block';
    App.util.addScroll(list);


    var album = document.createElement('div');
    album.innerHTML = '25 лучших песен';
    album.className = 'best';
    album.onclick = function () {
        for (var l = 0; l < listEl.length; l++) {
            if (l > 2) {
                listEl[l].className = 'album';
            }else {
                listEl[l].className = 'best';
            }
        }
        this.className = "currentBest"
        var scr = document.createElement('script');
        scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=' + LastFM.tagName + '&api_key=809dffc5f629c1d4871323f01379bc0d&limit=25&format=json&callback=LastFM.responceTagTracks&lang=ru';
        //scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=' + LastFM.artistName + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceAlbums&lang=ru';
        document.body.appendChild(scr)
    }
    list.appendChild(album);
    listEl.push(album);
    album.onclick();




    var album = document.createElement('div');
    album.innerHTML = '50 лучших песен';
    album.className = 'best';
    album.onclick = function () {
        for (var l = 0; l < listEl.length; l++) {
            if (l > 2) {
                listEl[l].className = 'album';
            }else {
                listEl[l].className = 'best';
            }
        }
        this.className = "currentBest"
        var scr = document.createElement('script');
        scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=' + LastFM.tagName + '&api_key=809dffc5f629c1d4871323f01379bc0d&limit=50&format=json&callback=LastFM.responceTagTracks&lang=ru';
        //scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=' + LastFM.artistName + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceAlbums&lang=ru';
        document.body.appendChild(scr)
    }
    list.appendChild(album);
    listEl.push(album);

    var album = document.createElement('div');
    album.innerHTML = '100 лучших песен';
    album.className = 'best';
    album.onclick = function () {
        for (var l = 0; l < listEl.length; l++) {
            if (l > 2) {
                listEl[l].className = 'album';
            }else {
                listEl[l].className = 'best';
            }
        }
        this.className = "currentBest"
        var scr = document.createElement('script');
        scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=' + LastFM.tagName + '&api_key=809dffc5f629c1d4871323f01379bc0d&limit=100&format=json&callback=LastFM.responceTagTracks&lang=ru';
        //scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=' + LastFM.artistName + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceAlbums&lang=ru';
        document.body.appendChild(scr)
    }
    list.appendChild(album);
    listEl.push(album);



    if (data.topalbums && data.topalbums.album) {
        for (var i = 0; i < data.topalbums.album.length; i++) {
            var div = document.createElement('div');
            var img = document.createElement('img');
            img.src = data.topalbums.album[i].image[2]['#text'];
            //h4.innerHTML =
            div.appendChild(img);
            var span = document.createElement('span');
            span.innerHTML = data.topalbums.album[i].name;
            div.appendChild(span);
            div.data = data.topalbums.album[i];
            div.className = 'album';

            div.onclick = function () {
                for (var l = 0; l < listEl.length; l++) {
                    if (l > 2) {
                        listEl[l].className = 'album';
                    }else {
                        listEl[l].className = 'best';
                    }
                }
                this.className = "currentAlbum"

                Player.changeAlbum(this, true);
            }
            list.appendChild(div)
            listEl.push(div);
        }
    }
    else {
        var album = document.createElement('div');
        album.innerHTML = 'Альбомов не найдено';
        div.appendChild(album)
    }
}

LastFM.responceTagTracks = function (data) {
    document.getElementById("preload").style.display = 'none';
    LastFM.tracks = data.toptracks.track;
    //LastFM.album = '';
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
            //track.innerHTML = (i + 1) + '. ' + LastFM.tracks[i].name;

            LastFM.tracks[i].div = track;
            LastFM.tracks[i].span = span;

        }
        App.clearVkFindStack();
        Player.findTrackByTag()

        //Player.findTrack()
    } else {
        var track = document.createElement('div')
        track.innerHTML = 'Аудиозаписей не найдено'
        div.appendChild(track)
    }


    /*if (data.error) {
        App.showPopup('Error')
    }
    LastFM.tracks = data.toptracks.track;
    var div = document.getElementById('playlist');
    div.innerHTML = '';
    Player.playlist = [];
    div.scrollTop = 0;
    div.style.display = 'block';
    var titleAlbum = document.createElement('h3');
    titleAlbum.className = 'titleAlbum';
    titleAlbum.innerHTML = 'Лучшие песни';
    div.appendChild(titleAlbum);

    LastFM.titleAlbum = 'best';
    if (LastFM.tracks && LastFM.tracks[0]) {
        for (var i = 0; i < LastFM.tracks.length; i++) {
            //LastFM.tracks[i].name = LastFM.tracks[i].artist.name;
            var track = document.createElement('div');
            var fullTime = LastFM.tracks[i].duration;
            var fullMin = Math.floor(fullTime / 60);
            var fullSec = Math.floor(fullTime - fullMin * 60);
            var time = fullMin + ':' + (fullSec.toString().length == 1 ? '0' + fullSec : fullSec);
            var span = document.createElement('span');
            span.innerHTML = time;
            span.className = 'duration';
            track.appendChild(span)
            div.appendChild(track);
            track.innerHTML = '<a id="' + 'aL' + (i + 1) + '" class="noA" onclick="return false">' + (i + 1) + '</a>. ' + LastFM.tracks[i].artist.name + ' - ' + LastFM.tracks[i].name;
            track.a = document.getElementById('aL' + (i + 1));

            LastFM.tracks[i].div = track;
            LastFM.tracks[i].span = span;

        }
        Player.findTrackByTag()
    } else {
        var track = document.createElement('div')
        track.innerHTML = 'Аудиозаписей не найдено'
        div.appendChild(track)
    };*/
}




LastFM.responceTopTracks = function (data, a1, a2) {
    var a1 = a1 || 0;
    var a2 = a2 || 25;
    LastFM.a2 = a2;
    if (!MB.find) {
        document.getElementById("preload").style.display = 'none';
    }
    var div = document.getElementById('playlist');
    if (a2 == 25) {
        LastFM.tracks = data.toptracks.track;
        div.innerHTML = '';
        Player.playlist = [];
    }else {
        LastFM.tracks = data;
    }
    LastFM.album = "";
    //div.style.left = '165px';
    if (App.define.animation) {
        $(div).fade('in');
    }
    div.style.display = 'block';
    App.util.addScroll(div);


    if (LastFM.tracks && LastFM.tracks[0]) {
        for (var i = a1; i < a2; i++) {
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
            //track.innerHTML = (i + 1) + '. ' + LastFM.tracks[i].name;

            LastFM.tracks[i].div = track;
            LastFM.tracks[i].span = span;

        }
        App.clearVkFindStack();
        setTimeout(Player.firstFind, 100)

        //Player.findTrack()
    } else {
        var track = document.createElement('div')
        track.innerHTML = 'Аудиозаписей не найдено'
        div.appendChild(track)
    }
}
LastFM.responceArtistMTv2 = function (data) {

    if (App.define.showBio && LastFM.backArtist != data.artist.name) {
        if (!data.error && data.artist.name && data.artist.bio.summary != "") {

            //document.getElementById("title").innerHTML = data.artist.name + '<a title="Перейти на страницу исполнителя на Last.fm" target="_blank" href="' + data.artist.url + '"> >> </a>';
            if (data.artist.name) {
                LastFM.q = data.artist.name;
                LastFM.backArtist = LastFM.artistName = data.artist.name;

                LastFM.artistBio = App.util.removeTrash(data.artist.bio.content);
                LastFM.artistBioSummary = App.util.removeTrash(data.artist.bio.summary);
                //VK.callMethod("setLocation", "artist=" + encodeURIComponent(LastFM.artistName));
                document.getElementById("find").value = LastFM.artistName;
            }

            var div = document.getElementById('info');
            App.util.addScroll(div);
            div.innerHTML = '';
            //div.style.left = '632px';
            //div.style.width = '175px';
            if (App.define.animation) {
                $(div).slide('in', { direction: "right" });
            }
            div.style.display = 'block';
            var bio = document.createElement('div');
            bio.id = "bio";
            if (data.artist && data.artist.bio && data.artist.bio.summary) {
                LastFM.bio = App.util.removeTrash(data.artist.bio.summary);
            }

            if (data.artist && data.artist.image && data.artist.image[2]['#text']) {
                var a = document.createElement("a");
                a.href = data.artist.url;
                a.title = "Перейти на страницу исполнителя на Last.fm";
                a.setAttribute('target', '_blank');
                var img = document.createElement('img');
                img.src = data.artist.image[2]['#text'];
                a.appendChild(img)
                bio.appendChild(a);
            }

            var h5 = document.createElement("h5");
            h5.innerHTML = data.artist.name.toLowerCase();
            h5.onclick = function () {
                App.suche(this.innerHTML)
            }
            h5.style.cursor = 'pointer';
            bio.appendChild(h5);

            var h6 = document.createElement("h6");
            h6.innerHTML = "БИОГРАФИЯ";
            h6.onclick = function () {
                App.showAddBio();
            }
            bio.appendChild(h6);
            div.h6 = bio;
            //var h6 = document.createElement("h6");
            //h6.innerHTML = "ПОДЕЛИТЬСЯ С ДРУГОМ";
            //h6.onclick = function () {
            //    App.sendArtistToWall();
            //}
            //h5.appendChild(h6);



            if (data.artist && data.artist.bio && data.artist.bio.summary) {
                //bio.appendChild(document.createTextNode(text))
                //bio.innerHTML = data.artist.bio.summary;
            } else {
                bio.innerHTML = 'Информации об исполнителе или группе не найдено. Возможно некорректно указаны тэги'
            }

            div.appendChild(bio);

            var tags = document.createElement('div');
            tags.style.display = 'block';
            tags.id = 'tags'
            if (data.artist.tags && data.artist.tags.tag) {
                var tag = data.artist.tags.tag;
                for (var i = 0; i < tag.length; i++) {
                    var li = document.createElement('span');
                    li.innerHTML = tag[i].name + ', ';
                    li.art = tag[i].name;
                    li.onclick = function () {
                        /*document.getElementById('find').value = this.innerHTML;
                    App.radio = false;
                    App.ultra.currentTrack = '';
                    App.suche(this.innerHTML);*/
                        App.radio = false;
                        App.ultra.currentTrack = '';
                        LastFM.findTag(this.art)
                    }
                    tags.appendChild(li)
                }
            }

            div.appendChild(tags);

            var h3 = document.createElement('h3');
            h3.innerHTML = 'похожие'
            div.appendChild(h3);

            var sim = document.createElement("div");
            sim.id = 'similar2'
            sim.style.display = 'block';
            if (data.artist.similar && data.artist.similar.artist) {
                var simArt = data.artist.similar.artist;
                for (var i = 0; i < simArt.length; i++) {
                    var li = document.createElement('div');
                    li.title = simArt[i].name;
                    var img = document.createElement("img");
                    img.src = simArt[i].image[3]["#text"];
                    li.appendChild(img);
                    li.artist = simArt[i].name;
                    var span = document.createElement("span");
                    span.appendChild(document.createTextNode(simArt[i].name));
                    li.appendChild(span);
                    li.onclick = function () {
                        document.getElementById('find').value = this.artist;
                        App.radio = false;
                        App.ultra.currentTrack = '';
                        App.suche(this.artist);
                    }
                    sim.appendChild(li)
                }
            }

            div.appendChild(sim);

            /*setTimeout(function () {
            var scr = document.createElement('script');
            scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=' + LastFM.q + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceAlbums&lang=ru';
            document.body.appendChild(scr)
        }, 170)*/

        }else {
            document.getElementById('info').style.display = 'none';
        }
    }
}

LastFM.responceArtistv2 = function (data) {
    if (App.define.showBio && LastFM.backArtist != data.artist.name) {
        if (!data.error) {

            //document.getElementById("title").innerHTML = data.artist.name + '<a title="Перейти на страницу исполнителя на Last.fm" target="_blank" href="' + data.artist.url + '"> >> </a>';
            if (data.artist.name) {
                LastFM.q = data.artist.name;
                LastFM.backArtist = LastFM.artistName = data.artist.name;
                LastFM.artistBio = App.util.removeTrash(data.artist.bio.content);
                LastFM.artistBioSummary = App.util.removeTrash(data.artist.bio.summary);
                VK.callMethod("setLocation", "artist=" + encodeURIComponent(LastFM.artistName));
                if (window.addJump) {
                    window.addJump("artist", data.artist.name, data.artist.name)
                }
                document.getElementById("find").value = LastFM.artistName;
            }

            var div = document.getElementById('info');
            App.util.addScroll(div);
            div.innerHTML = '';
            //div.style.left = '632px';
            //div.style.width = '175px';
            if (App.define.animation) {
                $(div).slide('in', { direction: "right" });
            }
            div.style.display = 'block';
            var bio = document.createElement('div');
            bio.id = "bio";
            if (data.artist && data.artist.bio && data.artist.bio.summary) {
                LastFM.bio = App.util.removeTrash(data.artist.bio.summary);
            }

            if (data.artist && data.artist.image && data.artist.image[2]['#text']) {
                var a = document.createElement("a");
                a.href = data.artist.url;
                a.title = "Перейти на страницу исполнителя на Last.fm";
                a.setAttribute('target', '_blank');
                var img = document.createElement('img');
                img.src = data.artist.image[2]['#text'];
                a.appendChild(img)
                bio.appendChild(a);
            }


            var h5 = document.createElement("h5");
            h5.innerHTML = data.artist.name.toLowerCase();
            //h5.onclick = function () {
            //    App.suche(this.innerHTML)
            //}
            bio.appendChild(h5);

            var h6 = document.createElement("h6");
            h6.innerHTML = "БИОГРАФИЯ";
            h6.onclick = function () {
                App.showAddBio();
            }
            bio.appendChild(h6);

            var h6 = document.createElement("h6");
            h6.innerHTML = "ПОДЕЛИТЬСЯ С ДРУГОМ";
            h6.onclick = function () {
                App.sendArtistToWall();
            }
            bio.appendChild(h6);


            if (data.artist && data.artist.bio && data.artist.bio.summary) {
                //bio.appendChild(document.createTextNode(text))
                //bio.innerHTML = data.artist.bio.summary;
            } else {
                bio.innerHTML = 'Информации об исполнителе или группе не найдено. Возможно некорректно указаны тэги'
            }

            div.appendChild(bio);

            var tags = document.createElement('div');
            tags.style.display = 'block';
            tags.id = 'tags'
            if (data.artist.tags && data.artist.tags.tag) {
                var tag = data.artist.tags.tag;
                for (var i = 0; i < tag.length; i++) {
                    var li = document.createElement('span');
                    li.innerHTML = tag[i].name + ", ";
                    li.art = tag[i].name;
                    li.onclick = function () {
                        /*document.getElementById('find').value = this.innerHTML;
                    App.radio = false;
                    App.ultra.currentTrack = '';
                    App.suche(this.innerHTML);*/
                        App.radio = false;
                        App.ultra.currentTrack = '';
                        LastFM.findTag(this.art)
                    }
                    tags.appendChild(li)
                }
            }

            div.appendChild(tags);
            var h3 = document.createElement('h3');
            h3.innerHTML = 'похожие'
            div.appendChild(h3);

            var sim = document.createElement("div");
            sim.id = 'similar2'
            sim.style.display = 'block';
            if (data.artist.similar && data.artist.similar.artist) {
                var simArt = data.artist.similar.artist;
                for (var i = 0; i < simArt.length; i++) {
                    var li = document.createElement('div');
                    li.title = simArt[i].name;
                    var img = document.createElement("img");
                    img.src = simArt[i].image[3]["#text"];
                    li.appendChild(img);
                    li.artist = simArt[i].name;
                    var span = document.createElement("span");
                    span.appendChild(document.createTextNode(simArt[i].name));
                    li.appendChild(span);
                    li.onclick = function () {
                        document.getElementById('find').value = this.artist;
                        App.radio = false;
                        App.ultra.currentTrack = '';
                        App.suche(this.artist);
                    }
                    sim.appendChild(li)
                }
            }

            div.appendChild(sim);

            //setTimeout(function () {
            //    var scr = document.createElement('script');
            //    scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&artist=' + LastFM.q + '&api_key=809dffc5f629c1d4871323f01379bc0d&limit=25&format=json&callback=LastFM.responceTopTracks&lang=ru';
            //    //scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=' + LastFM.artistName + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceAlbums&lang=ru';
            //    document.body.appendChild(scr)
            //}, 500)



            setTimeout(function () {
                var scr = document.createElement('script');
                scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=' + encodeURIComponent(LastFM.q) + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceAlbums&lang=ru';
                document.body.appendChild(scr)
            }, 500)
            if (!App.lastGrp){ App.lastGrp = [] };

            LastFM.bestTracks(data)

            for (var k = 0; k < App.lastGrp.length; k++) {
                if (LastFM.artistName == App.lastGrp[k]) {
                    for (var k2 = k; k2 < App.lastGrp.length - 1; k2++) {
                        App.lastGrp[k2] = App.lastGrp[k2 + 1];
                    }
                }
                if (typeof (App.lastGrp[k]) != "string") {
                    App.lastGrp[k] = "";
                }
            }
            App.lastGrp.unshift(decodeURIComponent(LastFM.artistName));
            App.lastGrp.length = 25;

            if (localStorage) {
                localStorage.setItem("mer_lastGrp", App.lastGrp);
            }



        } else {
            App.showPopup('Такого исполнителя не найдено');
            document.getElementById("preload").style.display = 'none';
        }
    }else {
        VK.callMethod("setLocation", "artist=" + encodeURIComponent(LastFM.artistName));
        if (window.addJump) {
            window.addJump("artist", data.artist.name, data.artist.name)
        }

        var h6 = document.createElement("h6");
        h6.innerHTML = "ПОДЕЛИТЬСЯ С ДРУГОМ";
        h6.onclick = function () {
            App.sendArtistToWall();
        }
        if (document.getElementById('info').h6 && !document.getElementById('info').h6.yep) {
            document.getElementById('info').h6.appendChild(h6);
            document.getElementById('info').h6.yep = true;
        }

        setTimeout(function () {
            var scr = document.createElement('script');
            scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=' + encodeURIComponent(LastFM.q) + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceAlbums&lang=ru';
            document.body.appendChild(scr)
        }, 500)
        if (!App.lastGrp){ App.lastGrp = [] };

        LastFM.bestTracks(data)

        if (!App.lastGrp){ App.lastGrp = [] };

        for (var k = 0; k < App.lastGrp.length; k++) {
            if (LastFM.artistName == App.lastGrp[k]) {
                for (var k2 = k; k2 < App.lastGrp.length - 1; k2++) {
                    App.lastGrp[k2] = App.lastGrp[k2 + 1];
                }
            }
            if (typeof (App.lastGrp[k]) != "string") {
                App.lastGrp[k] = "";
            }
        }
        App.lastGrp.unshift(decodeURIComponent(LastFM.artistName));
        App.lastGrp.length = 25;

        if (localStorage) {
            localStorage.setItem("mer_lastGrp", App.lastGrp);
        }
        LastFM.q = data.artist.name;
        LastFM.artistName = data.artist.name;
    }
}

LastFM.bestTracks = function (data) {

    App.clearPopup();
    var listEl = [];
    var list = document.getElementById("list");
    list.el = listEl;
    //list.style.width = "165px"
    //var myTracks = document.getElementById("myTracks");
    //var d = document.getElementById("playlists");
    list.innerHTML = '';
    if (App.define.animation) {
        $(list).slide('in', { direction: "top" });
    }
    list.style.display = 'block';
    // App.util.addScroll(list);

    var album = document.createElement('div');
    album.innerHTML = 'лучшие треки';
    album.className = 'best';
    album.onclick = function () {
        for (var l = 0; l < listEl.length; l++) {
            if (l > 0) {
                listEl[l].className = 'album';
            }else {
                listEl[l].className = 'best';
            }
        }
        this.className = "currentBest"
        var scr = document.createElement('script');
        scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&artist=' + encodeURIComponent(LastFM.q) + '&api_key=809dffc5f629c1d4871323f01379bc0d&limit=100&format=json&callback=LastFM.responceTopTracks&lang=ru';
        //scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=' + LastFM.artistName + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceAlbums&lang=ru';
        document.body.appendChild(scr)
    }
    list.appendChild(album);
    listEl.push(album);
    album.onclick();

    if (data.artist.mbid) {
        MB.requestAlbums(data.artist.mbid);
    }else {
        var s = document.createElement("script");
        s.src = 'http:' + '//developer.echonest.com/api/v4/artist/search?bucket=id:musicbrainz&api%5Fkey=F21KT0VKI1NVX3CIF&name=' + encodeURIComponent(LastFM.artistName) + '&results=1&format=jsonp&callback=MB.resposeMBID'
        document.body.appendChild(s);
    }
}


LastFM.responceAlbums = function (data) {
    LastFM.albums = data;

    document.getElementById("preload").style.display = 'none';
    MB.find = true;
    var list = document.getElementById("list");
    App.util.addScroll(list);
    var listEl = list.el;



    if (data.topalbums && data.topalbums.album) {
        var h3 = document.createElement("h3");
        h3.innerHTML = 'Лучшие релизы';
        list.appendChild(h3);
        if (!data.topalbums.album.length) {
            var div = document.createElement('div');
            var img = document.createElement('img');
            if (data.topalbums.album.image) {
                img.src = data.topalbums.album.image[2]['#text'];
            }else {
                img.src = 'img/cover_default.png';
            }
            //h4.innerHTML =
            div.appendChild(img);
            var span = document.createElement('span');
            span.innerHTML = data.topalbums.album.name;
            div.appendChild(span);
            div.data = data.topalbums.album;
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

                Player.changeAlbum(this);
            }
            list.appendChild(div)
            listEl.push(div);
        }else {
            var l = data.topalbums.album.length < 10 ? data.topalbums.album.length : 10;
            for (var i = 0; i < l; i++) {
                var div = document.createElement('div');
                var img = document.createElement('img');
                if (data.topalbums.album[i].image) {
                    img.src = data.topalbums.album[i].image[2]['#text'];
                }else {
                    img.src = 'img/cover_default.png';
                }
                div.appendChild(img);
                var span = document.createElement('span');
                span.innerHTML = data.topalbums.album[i].name;
                div.appendChild(span);
                div.data = data.topalbums.album[i];
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

                    Player.changeAlbum(this);
                }
                list.appendChild(div)
                listEl.push(div);
            }

        }
    }

    /*document.getElementById("preload").style.display = 'none';
    App.clearPopup();
    var listEl = [];
    var list = document.getElementById("list");
    list.style.width = "165px"
    //var myTracks = document.getElementById("myTracks");
    //var d = document.getElementById("playlists");
    list.innerHTML = '';
    if (App.define.animation) {
        $(list).slide('in', { direction: "top" });
    }
    list.style.display = 'block';
    App.util.addScroll(list);

    var album = document.createElement('div');
    album.innerHTML = '25 лучших песен';
    album.className = 'best';
    album.onclick = function () {
        for (var l = 0; l < listEl.length; l++) {
            if (l > 2) {
                listEl[l].className = 'album';
            }else {
                listEl[l].className = 'best';
            }
        }
        this.className = "currentBest"
        var scr = document.createElement('script');
        scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&artist=' + LastFM.q + '&api_key=809dffc5f629c1d4871323f01379bc0d&limit=25&format=json&callback=LastFM.responceTopTracks&lang=ru';
        //scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=' + LastFM.artistName + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceAlbums&lang=ru';
        document.body.appendChild(scr)
    }
    list.appendChild(album);
    listEl.push(album);


    var album = document.createElement('div');
    album.innerHTML = '50 лучших песен';
    album.className = 'best';
    album.onclick = function () {
        for (var l = 0; l < listEl.length; l++) {
            if (l > 2) {
                listEl[l].className = 'album';
            }else {
                listEl[l].className = 'best';
            }
        }
        this.className = "currentBest"

        var scr = document.createElement('script');
        scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&artist=' + LastFM.q + '&api_key=809dffc5f629c1d4871323f01379bc0d&limit=50&format=json&callback=LastFM.responceTopTracks&lang=ru';
        //scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=' + LastFM.artistName + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceAlbums&lang=ru';
        document.body.appendChild(scr)
    }
    list.appendChild(album);
    listEl.push(album);
    album.onclick();


    var album = document.createElement('div');
    album.innerHTML = '100 лучших песен';
    album.className = 'best';
    album.onclick = function () {
        for (var l = 0; l < listEl.length; l++) {
            if (l > 2) {
                listEl[l].className = 'album';
            }else {
                listEl[l].className = 'best';
            }
        }
        this.className = "currentBest"

        var scr = document.createElement('script');
        scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&artist=' + LastFM.q + '&api_key=809dffc5f629c1d4871323f01379bc0d&limit=100&format=json&callback=LastFM.responceTopTracks&lang=ru';
        //scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getTopAlbums&artist=' + LastFM.artistName + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceAlbums&lang=ru';
        document.body.appendChild(scr)
    }
    list.appendChild(album);
    listEl.push(album);




    */
}

LastFM.responceTracks = function (data) {
    document.getElementById("preload").style.display = 'none';
    LastFM.tracks = data.album.tracks.track;
    //LastFM.album = '';
    var div = document.getElementById('playlist');
    //div.style.left = '165px';
    div.innerHTML = '';
    Player.playlist = [];
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

}

LastFM.responceCoverTrack = function (data) {
    if (data.results && data.results.trackmatches && data.results.trackmatches.track && data.results.trackmatches.track.image && data.results.trackmatches.track.image[0]["#text"]) {
        document.getElementById("cover").src = data.results.trackmatches.track.image[1]["#text"]
    }else {
        document.getElementById("cover").src = "img/cover_default.png";
    }
}

LastFM.responceUser = function (data) {
    if (data.session) {
        LastFM.user.sk = data.session.key;
        //document.getElementById('scrob').innerHTML = 'Скробблинг выполняется';
        LastFM.scrob = true;
        //document.getElementById("lastlogo").style.display = 'block';
    } else if (data.error) {
        App.showPopup('Ошибка авторизации');

    }
}

LastFM.responceUser2 = function (data) {
    if (data.session) {
        LastFM.user.sk = data.session.key;
        clearInterval(LastFM.interval);
        localStorage.setItem("mer_s_key", LastFM.user.sk);
        //document.getElementById('scrob').innerHTML = 'Скробблинг выполняется';
        LastFM.scrob = true;
    } else if (data.error) {
        App.showPopup('Ошибка авторизации');

    }
}

document.getElementById("Oauth").onmousedown = function () {
    LastFM.interval = setInterval(function () {
        var api_sig = hex_md5("api_key809dffc5f629c1d4871323f01379bc0dmethodauth.getSessiontoken" + LastFM.user.token + "e69db535e502129eb7473f0052204099");
        var scr = document.createElement('script');
        scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=auth.getSession&token=' + LastFM.user.token + '&api_key=809dffc5f629c1d4871323f01379bc0d&api_sig=' + api_sig + '&callback=LastFM.responceUser2&format=json';
        document.body.appendChild(scr);
    }, 20000);
    LastFM.user.token = LastFM.user.token2;
}


LastFM.getToken = function (data) {
    if (data.token) {
        //clearInterval(LastFM.interval);
        LastFM.user.token2 = data.token;
        document.getElementById("Oauth").href = 'http://www.last.fm/api/auth/?api_key=809dffc5f629c1d4871323f01379bc0d&token=' + data.token;
    }
}

function requestToken() {

    var api_sig = hex_md5("api_key809dffc5f629c1d4871323f01379bc0dmethodauth.getTokene69db535e502129eb7473f0052204099");
    var scr = document.createElement('script');
    scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=auth.getToken&api_key=809dffc5f629c1d4871323f01379bc0d&api_sig=' + api_sig + '&callback=LastFM.getToken&format=json&' + (new Date()).getTime();
    document.body.appendChild(scr);
}

setTimeout(requestToken, 4000);

LastFM.getKey = function (username, password) {
    LastFM.api_key = '809dffc5f629c1d4871323f01379bc0d';
    var authToken = hex_md5(username + hex_md5(password));
    LastFM.userName = username;
    LastFM.password = password;
    LastFM.authToken = authToken;
    //var api_sig = hex_md5("api_key809dffc5f629c1d4871323f01379bc0dauthToken" + authToken + "callbackLastFM.responceUser" + "formatjson" + "methodauth.getMobileSession" + "username" + username + "e69db535e502129eb7473f0052204099")
    //scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=auth.getMobileSession&username=' + username + '&authToken=' + authToken + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceUser&api_sig=' + api_sig;
    ////var api_sig = hex_md5("api_key809dffc5f629c1d4871323f01379bc0dauthToken" + authToken + "methodauth.getMobileSession"+ "username" + username +  "e69db535e502129eb7473f0052204099");
    ////scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=auth.getMobileSession&username=' + username + '&authToken=' + authToken + '&api_key=809dffc5f629c1d4871323f01379bc0d&api_sig=' + api_sig;
    var api_sig = hex_md5("api_key809dffc5f629c1d4871323f01379bc0dauthToken" + authToken + "methodauth.getMobileSession" + "username" + username + "e69db535e502129eb7473f0052204099");
    LastFM.user.api_sig = api_sig;
    var scr = document.createElement('script');
    scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=auth.getMobileSession&username=' + username + '&authToken=' + authToken + '&api_key=809dffc5f629c1d4871323f01379bc0d&api_sig=' + api_sig + '&callback=LastFM.responceUser&format=json';
    document.body.appendChild(scr);
}

LastFM.responceChart = function (data) {
    LastFM.chart = data.artists.artist;
    if (App.state == 'start') {
        App.showStartup();
    }
}

LastFM.scrooble = function () {
    //if (App.radio) {
    var track = LastFM.trackName
    //} else {
    //    var track = Player.currentTrack.title;
    //}
    var time = Math.round((new Date()).getTime() / 1000);
    //var track = LastFM.trackName || Player.currentTrack.title;
    /*if (LastFM.album) {
        var api_sig = hex_md5("api_key809dffc5f629c1d4871323f01379bc0dalbum" + LastFM.album + "artist" + LastFM.artistName + "methodtrack.scrobble" + "sk" + LastFM.user.sk + 'timestamp' + time + "track" + decodeURIComponent(track) + "e69db535e502129eb7473f0052204099");
        var post = 'method=track.scrobble&album='+LastFM.album+'&artist=' + LastFM.artistName + '&timestamp=' + time + '&track=' + track + '&api_key=809dffc5f629c1d4871323f01379bc0d&api_sig=' + api_sig + '&sk=' + LastFM.user.sk;
    } else {*/
    var api_sig = hex_md5("api_key809dffc5f629c1d4871323f01379bc0d" + "artist" + LastFM.artistName + "methodtrack.scrobble" + "sk" + LastFM.user.sk + 'timestamp' + time + "track" + decodeURIComponent(track) + "e69db535e502129eb7473f0052204099");
    var post = 'method=track.scrobble&artist=' + LastFM.artistName + '&timestamp=' + time + '&track=' + track + '&api_key=809dffc5f629c1d4871323f01379bc0d&api_sig=' + api_sig + '&sk=' + LastFM.user.sk;
    var url = 'http:' + '//ws.audioscrobbler.com/2.0/';
    CROSS.XSS.post(url, post);
    clearTimeout(LastFM.scronTimout);
}