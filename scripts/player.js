Player.random = document.getElementById('random').onclick = function () {
    if (Player.rand) {
        Player.rand = false;
        document.getElementById('random').src = 'img/notshuffle_icon.png';

    } else {
        Player.rand = true;
        document.getElementById('random').src = 'img/shuffle_icon.png';
    }
    var r = Player.rand ? 1 : 0;
    if (localStorage) {
        localStorage.setItem("mer_rand", r)
    }
}

Player.repeat = document.getElementById('repeat').onclick = function () {
    if (Player.rep) {
        Player.rep = false;
        document.getElementById('repeat').src = 'img/notrepeat_icon.png';
    } else {
        Player.rep = true;
        document.getElementById('repeat').src = 'img/repeat_icon.png';
    }
}


Player.div = document.getElementById('audio');
Player.uppod = document.getElementById('player1');

Player.toggle = document.getElementById('playButton').onclick = function () {
    if (App.radio) {
        if (uppodGet("player1", 'getstatus') == -1 || uppodGet("player1", 'getstatus') == 0) {
            uppodSend("player1", 'play');
            App.updatePHP();
            App.radioInt = setInterval(App.updatePHP, 20000);
            document.getElementById('playButton').src = 'img/pause.png';
            if (window.isPlay) {
                window.isPlay(true)
            }
        } else if (uppodGet("player1", 'getstatus') == 1) {
            uppodSend("player1", 'stop');
            clearInterval(App.radioInt);
            if (window.isPlay) {
                window.isPlay()
            }
            document.getElementById('playButton').src = 'img/play.png';; //
        }
    } else {
        uppodSend("player1", 'toggle');
        if (uppodGet("player1", 'getstatus') == 0 || uppodGet("player1", 'getstatus') == -1) {
            document.getElementById('playButton').src = 'img/play.png'; //
            if (window.isPlay) {
                window.isPlay()
            }
        }
        else {
            document.getElementById('playButton').src = 'img/pause.png';
            if (window.isPlay) {
                window.isPlay(true)
            }
        }
    }
}

Player.next = document.getElementById('nextButton').onclick = function () {
    if (Player.rep) {
        Player.play(Player.currentTrack.url);
        return 1;
    }
    if (!Player.rand) {
        if (parseInt(Player.currentNumber) + 1 < Player.playlist.length) {
            Player.currentNumber++;
        } else {
            Player.currentNumber = 0;
        }
        if (Player.playlist[Player.currentNumber]) {
            Player.currentTrack = Player.playlist[Player.currentNumber];
            Player.play(Player.currentTrack.url)
        } else {
            Player.next()
        }
    } else {
        var sl = Math.floor(Math.random() * Player.playlist.length - 1) + (new Date()).getTime() % 100;
        Player.currentNumber += sl;
        if (Player.currentNumber > Player.playlist.length) { Player.currentNumber = Player.currentNumber % Player.playlist.length }
        if (Player.playlist[Player.currentNumber]) {
            Player.currentTrack = Player.playlist[Player.currentNumber];
            Player.play(Player.currentTrack.url)
        } else {
            Player.next()
        }
    }

    /*uppodSend("player1", 'file\:' + Player.currentTrack.url);
    uppodSend("player1", 'play');*/
}

Player.prev = document.getElementById('prevButton').onclick = function () {
    if (Player.rep) {
        Player.play(Player.currentTrack.url);
        return 1;
    }

    if (!Player.rand) {
        if (parseInt(Player.currentNumber) - 1 >= 0) {
            Player.currentNumber--;
        } else {
            Player.currentNumber = 0;
        }
        Player.currentTrack = Player.playlist[Player.currentNumber];
        Player.play(Player.currentTrack.url)
    } else {
        var sl = Math.floor(Math.random() * Player.playlist.length - 1);
        Player.currentNumber += sl;
        if (Player.currentNumber > Player.playlist.length) { Player.currentNumber = Player.currentNumber % Player.playlist.length }
        if (Player.playlist[Player.currentNumber]) {
            Player.currentTrack = Player.playlist[Player.currentNumber];
            Player.play(Player.currentTrack.url)
        } else {
            Player.next()
        }
    }
    /*uppodSend("player1", 'file\:' + Player.currentTrack.url);
    uppodSend("player1", 'play');*/
}

Player.seek = document.getElementById('progLoad').onclick = document.getElementById('progLive').onclick = function (e) {
    var element = document.getElementById('progLoad');
    var e = e || window.event;
    var x = e.clientX;
    var dx = 0;
    var el = element;
    var offset = e.offsetX || e.layerX;
    var cont = document.getElementById('prog');
    var len = cont.offsetWidth;
    //Player.currentTrack.duration
    var pr = offset / len;
    var seekTime = parseInt(Player.currentTrack.duration * pr)
    uppodSend("player1", 'seek\:' + seekTime)
}

Player.changeVolume = function () {
    if (Player.init) {
        uppodSend('player1', 'v' + Player.volume.getValue());
    }
    if (Player.volume.getValue() > 0) {
        document.getElementById("volumeButton").src = "img/volume_icon.png";
    }else {
        document.getElementById("volumeButton").src = "img/volume_off_icon.png";
    }
    if (Player.volume.getValue()) {
        document.getElementById("levelVolume").innerHTML = Player.volume.getValue();
    }else {
        document.getElementById("levelVolume").innerHTML = 0;
    }
    if (localStorage) {
        localStorage.setItem("mer_volume", Player.volume.getValue());
    }
}

Player.changeVolumeWheel = function (e) {
    e = e || window.event;
    if (e.wheelDelta) {
        var delta = e.wheelDelta / 120;
    }else if (e.detail) {
        var delta = -e.detail / 3;
    }
    if (delta > 0) {
        if (Player.volume.getValue() + delta * 5 < 100) {
            Player.volume.setValue(Player.volume.getValue() + delta * 5)
        }
        else {
            Player.volume.setValue(100);
        }
    } else {
        if (Player.volume.getValue() + delta * 5 > 0) {
            Player.volume.setValue(Player.volume.getValue() + delta * 5)
        }
        else {
            Player.volume.setValue(0);
        }
    }
    //uppodSend('player1', 'v' + Player.volume.getValue());
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.returnValue = false;

}

Player.play = function (url, notSrcoll) {
    //if (Player.rand && !Player.firstPlay) {
    //    Player.firstPlay = true;
    //    Player.next();
    //    return 1;
    //}
    Player.firstPlay = true;
    if (window.pinnedRadio) {
        window.pinnedRadio(false);
    }
    if (window.isPlay) {
        window.isPlay(true)
    }
    document.getElementById("preload").style.display = 'none';
    App.currentRadio = '';
    if (App.radio) {
        return 1;
    } else {
        if (Player.init && !App.s) {
            uppodSend("player1", 'stop');
            uppodSend("player1", 'time0');
            document.getElementById("wrapPlayer").innerHTML = '';
            var wrap = document.createElement("div");
            wrap.id = 'player';
            document.getElementById("wrapPlayer").appendChild(wrap);
            Player.init = false;
            clearInterval(App.radioInt);
        }
    };
    clearInterval(App.radioInt);
    clearTimeout(LastFM.scronTimout);
    if (!App.s) {
        App.s = setInterval(Player.q, 1000);
    }
    var url = url || Player.currentTrack.url;
    document.getElementById('audio').style.display = 'block';
    if (App.MT) {
        LastFM.artistName = Player.currentTrack.artist.replace("&#39;", "'");
        LastFM.trackName = Player.currentTrack.title.replace("&#39;", "'");

    }else {
        LastFM.trackName = LastFM.tracks[Player.currentNumber].name;
        LastFM.artistName = LastFM.tracks[Player.currentNumber].artist.name;
    }
    document.getElementById('titleTrack').innerHTML = LastFM.artistName + ' - ' + LastFM.trackName; //+ "<span id='eq'><img src='http:/\/vk.hart-flamov.ru/JS/VK/img/eq.gif'></span>";
    VK.callMethod('setTitle', LastFM.artistName + ' - ' + LastFM.trackName);
    document.getElementById("textTrack").enabled = false;
    document.getElementById('playButton').src = 'img/pause.png';

    /*    for (var i = 0; i < Player.playlist.length; i++) {
        if (Player.playlist[i]) {
            Player.playlist[i].div.style.color = 'black';
        }
    }
    Player.currentTrack.div.style.color = '#00A3EF';*/
    if (document.getElementById("trainge")) {
        document.getElementById("trainge").parentNode.removeChild(document.getElementById("trainge"));
    }

    var trainge = document.createElement("span");
    var a = document.createElement("a");
    // || App.uid == '6396349'
    if (App.uid == '3424338') {
        a.href = url;
    }
    trainge.id = "trainge";
    trainge.appendChild(a);
    Player.currentTrack.div.triangle = trainge;
    Player.currentTrack.div.appendChild(trainge);
    /*var scr = document.createElement('script');
    scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=library.addTrack&artist=' + LastFM.artistName + '&track=' + Player.currentTrack.title + '&api_key=809dffc5f629c1d4871323f01379bc0d&api_sig=' +api_sig + '&sk='+LastFM.user.sk+'&callback=LastFM.responceAddTrack&format=json';*/
    //document.body.appendChild(scr);

    var time = Math.round((new Date()).getTime() / 1000);
    var api_sig = hex_md5("api_key809dffc5f629c1d4871323f01379bc0d" + "artist" + LastFM.artistName + "methodtrack.updateNowPlaying" + "sk" + LastFM.user.sk + 'timestamp' + time + "track" + LastFM.trackName + "e69db535e502129eb7473f0052204099");
    var post = 'method=track.updateNowPlaying&artist=' + LastFM.artistName + '&timestamp=' + time + '&track=' + LastFM.trackName + '&api_key=809dffc5f629c1d4871323f01379bc0d&api_sig=' + api_sig + '&sk=' + LastFM.user.sk;

    var scr = document.createElement('script');
    scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=track.search&artist=' + LastFM.artistName + '&track=' + LastFM.trackName + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&limit=1&callback=LastFM.responceCoverTrack&lang=ru';
    document.body.appendChild(scr);


    if (Player.init) {
        uppodSend("player1", 'file\:' + url);
        uppodSend("player1", 'play');
        var volume = document.getElementById('volume');
        var valueVolume = document.getElementById('valueVolume');
        /*var curVolume = uppodGet("player1", 'getv');
        valueVolume.style.height = volume.offsetHeight * (curVolume / 100) + 'px';*/
        LastFM.currentTrack = Player.currentTrack;
        LastFM.scronTimout = setTimeout(LastFM.scrooble, App.scrobTime * 1000);

        var url = 'http:' + '//ws.audioscrobbler.com/2.0/';
        CROSS.XSS.post(url, post);
        document.getElementById("find").value = LastFM.artistName;
        //if (App.MT) {

        //}
        if (App.MT) {
            var scr = document.createElement('script');
            scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + LastFM.artistName + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceArtistMTv2&lang=ru';
            document.body.appendChild(scr);
        }
        if (notSrcoll){ return 1 }
        cont = document.getElementById('playlist');
        if (Player.currentNumber < 8) {
            var h = 0;
        } else {
            var h = Player.playlist[Player.currentNumber].div.offsetTop - 65;
        }
        //cont.scrollTop = h - 27;
        var anim = function () {
            cont.scrollTop += anim.step;
            anim.i++;
            if (anim.i == anim.steps) {
                clearInterval(anim.interval)
            }
        }
        anim.h = h - 45;
        anim.steps = 8;
        anim.i = 0;
        anim.step = (h - cont.scrollTop) / anim.steps;
        if (App.define.animation) {
            anim.interval = setInterval(anim, 50);
        }else {
            cont.scrollTop = h - 45;
        }
        if (document.getElementById("playlist").scrollValue) {
            document.getElementById("playlist").scrollValue = false;
        }
        return 1;
    }
    var flashvars = { st: "flash/audio53-1229.txt", file: url, uid: "player1" };
    var params = { bgcolor: "#ffffff", allowFullScreen: "true", allowScriptAccess: "always" };
    var attributes = { id: "player1", name: "player" };
    swfobject.embedSWF("flash/uppod.swf", "player", "0", "0", "10.0.0", false, flashvars, params, attributes);
    var url = 'http:' + '//ws.audioscrobbler.com/2.0/';
    LastFM.currentTrack = Player.currentTrack;
    LastFM.scronTimout = setTimeout(LastFM.scrooble, App.scrobTime * 1000);
    CROSS.XSS.post(url, post);
    if (App.MT) {
        var scr = document.createElement('script');
        scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + LastFM.artistName + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceArtistMTv2&lang=ru';
        document.body.appendChild(scr);
    }
    if (App.MT) {
        document.getElementById("find").value = LastFM.artistName;
    }
    if (notSrcoll){ return 1 }
    var cont = document.getElementById('playlist');
    if (Player.currentNumber < 10) {
        var h = 0;
    } else {
        var h = Player.playlist[Player.currentNumber].div.offsetTop - 65;
    }
    //cont.scrollTop = h - 27;
    var anim = function () {
        cont.scrollTop += anim.step;
        anim.i++;
        if (anim.i == anim.steps) {
            clearInterval(anim.interval)
        }
    }
    anim.h = h - 45;
    anim.steps = 8;
    anim.i = 0;
    anim.step = (h - cont.scrollTop) / anim.steps;
    if (App.define.animation) {
        anim.interval = setInterval(anim, 50);
    }else {
        cont.scrollTop = h - 45;
    }
    if (document.getElementById("playlist").scrollValue) {
        document.getElementById("playlist").scrollValue = false;
    }
    //document.getElementById("player1").style.display = 'none';
}

/*Player.stop = document.getElementById("stopButton").onclick = function () {
    uppodStopAll();
    clearTimeout(LastFM.scronTimout);
    clearInterval(App.s)
    clearInterval(App.radioInt);
    document.getElementById('playButton').style.backgroundImage = 'url(http://vk.hart-flamov.ru/JS/VK/img/play.png)';
    if (document.getElementById("eq")) {
        document.getElementById("eq").innerHTML = '';
        //document.getElementById("eq").innerHTML = "<img src='http:/\/vk.hart-flamov.ru/JS/VK/img/eq.gif'>";
    }
}*/


Player.q = function () {
    if (App.radio || !Player.init) { return 1 };
    var fullTime = fullTime || Player.currentTrack.duration || uppodGet("player1", "getimed");
    var currentTime = uppodGet("player1", "getime");
    var fullMin = Math.floor(fullTime / 60);
    var currentMin = Math.floor(currentTime / 60);
    var fullSec = Math.floor(fullTime - fullMin * 60);
    var currentSec = Math.floor(currentTime - currentMin * 60);
    //document.getElementById("currentTime").innerHTML = currentMin + ':' + (currentSec.toString().length == 1 ? '0' + currentSec : currentSec) + ' / ' + fullMin + ':' + (fullSec.toString().length == 1 ? '0' + fullSec : fullSec);
    document.getElementById("currentTime").innerHTML = currentMin + ':' + (currentSec.toString().length == 1 ? '0' + currentSec : currentSec);
    document.getElementById("totalTime").innerHTML = fullMin + ':' + (fullSec.toString().length == 1 ? '0' + fullSec : fullSec);
    //progress-bar with load and live %
    var cont = document.getElementById('prog');
    var len = cont.offsetWidth;
    var live = document.getElementById('progLive');
    var load = document.getElementById('progLoad');
    var curLoad = uppodGet("player1", 'getprocent') / 100;
    var curLive = currentTime / fullTime;
    if (curLive > 1) { curLive = 1 }
    load.style.width = len * curLoad + 'px';
    live.style.width = len * curLive + 'px';
    if (fullTime - currentTime < 1) { Player.next(); return 1; }
}


Player.findSong = function (div) {
    //Player.firstPlay = false;
    Player.findSong.div = div;
    for (var i = 0; i < Player.playlist.length; i++) {
        if (Player.playlist[i]) {
            Player.playlist[i].div.style.color = 'black';//color = '#00A3EF';
        }
    }
    VK.api('audio.search', { q: App.util.changeHTMLSymbols(LastFM.artistName + ' ' + LastFM.trackName), auto_complete: 1, sort: 2, count: 8, lyrics: 1 }, function (data) {
        //
        if (data.response && data.response[0] != 0) {
            var fullTime = data.response[1].duration;
            var fullMin = Math.floor(fullTime / 60);
            var fullSec = Math.floor(fullTime - fullMin * 60);
            var time = fullMin + ':' + (fullSec.toString().length == 1 ? '0' + fullSec : fullSec);
            var span = document.createElement('span');
            div.appendChild(span);
            div.span = span;
            span.className = 'duration';
            div.span.innerHTML = time;
            div.className = 'finded';
            div.data = data.response[1];
            //            div.a.href = data.response[1].url;
            data.response[1].div = div;
            Player.currentTrack = data.response[1];
            div.onclick = (function (track, i) {
                return function () {
                    App.radio = false;
                    Player.currentTrack = track;
                    Player.currentNumber = i;
                    App.MT = true;
                    setTimeout(function () {
                        Player.play(track.url, true);
                    }, 150)
                }
            })(data.response[1], App.ultra.i)
            //Player.playlist.push(data.response[1])
            Player.playlist[App.ultra.i] = data.response[1];

            if (document.getElementById("trainge")) {
                document.getElementById("trainge").parentNode.removeChild(document.getElementById("trainge"));
            }


            var trainge = document.createElement("span");
            trainge.id = "trainge";
            div.triangle = trainge;
            div.appendChild(trainge);

            //Player.currentTrack.div.style.color = '#00A3EF';
            var h = Player.currentTrack.div.offsetTop;
            cont = document.getElementById('playlist');
            //cont.scrollTop = h - 27;
            var anim = function () {
                cont.scrollTop += anim.step;
                anim.i++;
                if (anim.i == anim.steps) {
                    clearInterval(anim.interval)
                }
            }
            anim.h = h - 45;
            anim.steps = 8;
            anim.i = 0;
            anim.step = (h - cont.scrollTop) / anim.steps;
            if (App.define.animation) {
                anim.interval = setInterval(anim, 50);
            }else {
                cont.scrollTop = h - 45;
            }
        } else if (data.error) {
            //alert(JSON.stringify(data))
            setTimeout(function () { Player.findSong(Player.findSong.div) }, 500)
        } else if (data.response && data.response[0] == 0) {
            Player.findSongWithoutLyrics(div)
        }

    })
}

Player.findSongWithoutLyrics = function (div) {
    //Player.firstPlay = false;
    VK.api('audio.search', { q: App.util.changeHTMLSymbols(LastFM.artistName + ' ' + LastFM.trackName), auto_complete: 1, sort: 2, count: 8 }, function (data) {
        //
        if (data.response && data.response[0] != 0) {
            var fullTime = data.response[1].duration;
            var fullMin = Math.floor(fullTime / 60);
            var fullSec = Math.floor(fullTime - fullMin * 60);
            var time = fullMin + ':' + (fullSec.toString().length == 1 ? '0' + fullSec : fullSec);
            var span = document.createElement('span');
            div.appendChild(span);
            div.span = span;
            span.className = 'duration';
            div.span.innerHTML = time;
            div.className = 'finded';
            div.data = data.response[1];
            data.response[1].div = div;
            Player.currentTrack = data.response[1];
            //div.a.href = data.response[1].url;
            div.onclick = (function (track, i) {
                return function () {
                    App.radio = false;
                    Player.currentTrack = track;
                    Player.currentNumber = i;
                    Player.play(track.url, true);

                }
            })(data.response[1], App.ultra.i)
            //Player.playlist.push(data.response[1])
            Player.playlist[App.ultra.i] = data.response[1];

            if (document.getElementById("trainge")) {
                document.getElementById("trainge").parentNode.removeChild(document.getElementById("trainge"));
            }


            var trainge = document.createElement("span");
            trainge.id = "trainge";
            div.triangle = trainge;
            div.appendChild(trainge);


            var h = Player.currentTrack.div.offsetTop;
            cont = document.getElementById('playlist');
            //cont.scrollTop = h - 27;
            var anim = function () {
                cont.scrollTop += anim.step;
                anim.i++;
                if (anim.i == anim.steps) {
                    clearInterval(anim.interval)
                }
            }
            anim.h = h - 45;
            anim.steps = 8;
            anim.i = 0;
            anim.step = (h - cont.scrollTop) / anim.steps;
            if (App.define.animation) {
                anim.interval = setInterval(anim, 50);
            }else {
                cont.scrollTop = h - 45;
            }
        }else if (data.response && data.response[0] == 0) {
            if (document.getElementById("trainge")) {
                document.getElementById("trainge").parentNode.removeChild(document.getElementById("trainge"));
            }


            var trainge = document.createElement("span");
            trainge.id = "trainge";
            div.triangle = trainge;
            div.appendChild(trainge);
        } else if (data.error) {
            //alert(JSON.stringify(data))
            setTimeout(function () { Player.Player.findSongWithoutLyrics(div) }, 1500)
        }
    })
}

Player.firstFind = function () {
    //Player.firstPlay = false;
    if (App.radio) {
        uppodSend("player1", 'stop');
        uppodSend("player1", 'time0');
        App.radio = false;
        clearInterval(App.radioInt);
        App.ultra.currentTrack = '';
        App.s = setInterval(Player.q, 1000);
    }
    App.clearVkFindStack();
    App.vkFindStack = [];
    App.vkFind = true;
    Player.currentNumber = 0;

    Player.preFind = true;
    VK.api('audio.search', { q: App.util.changeHTMLSymbols(LastFM.artistName), sort: 2, count: 200, lyrics: 1, sort: 2 }, function q(data) {
        //
        if (data.response && data.response[0] != 0 && App.vkFind == true) {
            var q = function (i) {
                var k = 0;
                for (var j = 0; j < data.response.length; j++) {
                    if (LastFM.artistName == data.response[j].artist && LastFM.tracks[i].name == data.response[j].title) {
                        var k = j;
                        break;
                    }
                }
                if (k == 0){ return false }
                var fullTime = data.response[k].duration;
                var fullMin = Math.floor(fullTime / 60);
                var fullSec = Math.floor(fullTime - fullMin * 60);
                var time = fullMin + ':' + (fullSec.toString().length == 1 ? '0' + fullSec : fullSec);
                var span = document.createElement('span');
                LastFM.tracks[i].span.innerHTML = time;
                LastFM.tracks[i].div.className = 'finded';
                //LastFM.tracks[i].div.a.href = data.response[k].url;
                LastFM.tracks[i].div.data = data.response[k];
                data.response[k].div = LastFM.tracks[i].div;
                LastFM.tracks[i].find = true;
                LastFM.tracks[i].div.onclick = (function (track, i) {
                    return function () {
                        Player.currentTrack = track;
                        Player.currentNumber = i;
                        Player.play(track.url, true);
                    }
                })(data.response[k], i)
                //Player.playlist.push(data.response[1])
                Player.playlist[i] = data.response[k];
                if (App.define.autoplay) {
                    if (i == 0) {
                        setTimeout((function (i, k) {
                            return function () {
                                Player.currentTrack = data.response[k];
                                Player.currentNumber = i;
                                Player.play(data.response[k].url)
                            }
                        })(i, k), 250)

                    };
                }

                return true;
            }
            for (var i = 0; i < LastFM.tracks.length; i++) {
                if (LastFM.tracks[i].div && !LastFM.tracks[i].find)
                    setTimeout((function (i) {
                        return function () {
                            q(i);
                        }
                    })(i), i * 5)
            }
            setTimeout(Player.findTrack, 1000);
        } else if (data.error) {
            //alert(JSON.stringify(data))
            //App.vkFindStack.push(setTimeout(function () { q(i) }, 500));
        } else if (data.response && data.response[0] == 0) {
            //Player.findTrackWithoutLyrics(i)
            setTimeout(Player.findTrack, 1000);
        }
    })

}

Player.findTrack = function () {
    if (App.radio) {
        uppodSend("player1", 'stop');
        uppodSend("player1", 'time0');
        App.radio = false;
        clearInterval(App.radioInt);
        App.ultra.currentTrack = '';
        App.s = setInterval(Player.q, 1000);
    }
    App.clearVkFindStack();
    App.vkFindStack = [];
    App.vkFind = true;
    Player.currentNumber = 0;
    if (!Player.preFind) {
        Player.playlist = [];
    }
    var l = 0;
    for (var i = 0; i < LastFM.tracks.length; i++) {
        if (LastFM.tracks[i].find || !LastFM.tracks[i].div) { continue };
        l++;
        App.vkFindStack.push(setTimeout((function (i) {
            return function q() {
                if (!LastFM.tracks[i] || !LastFM.tracks[i].name || App.vkFind == false) { return 1 }
                VK.api('audio.search', { q: App.util.changeHTMLSymbols(LastFM.artistName + ' ' + LastFM.tracks[i].name), sort: 2, count: 25, lyrics: 1 }, function (data) {
                    //
                    if (data.response && data.response[0] != 0 && App.vkFind == true) {
                        for (var j = 0; j < data.response.length; j++) {
                            if (LastFM.artistName == data.response[j].artist && LastFM.tracks[i].name == data.response[j].title) {
                                var k = j;
                                break;
                            }
                        }
                        var k = k || 1;
                        var fullTime = data.response[k].duration;
                        var fullMin = Math.floor(fullTime / 60);
                        var fullSec = Math.floor(fullTime - fullMin * 60);
                        var time = fullMin + ':' + (fullSec.toString().length == 1 ? '0' + fullSec : fullSec);
                        var span = document.createElement('span');
                        LastFM.tracks[i].span.innerHTML = time;
                        LastFM.tracks[i].div.className = 'finded';
                        LastFM.tracks[i].div.data = data.response[k];
                        LastFM.tracks[i].find = true;
                        //LastFM.tracks[i].div.a.href = data.response[k].url;
                        data.response[k].div = LastFM.tracks[i].div;

                        LastFM.tracks[i].div.onclick = (function (track, i) {
                            return function () {
                                Player.currentTrack = track;
                                Player.currentNumber = i;
                                Player.play(track.url, true);
                            }
                        })(data.response[k], i)
                        //Player.playlist.push(data.response[1])
                        Player.playlist[i] = data.response[k];
                        if (App.define.autoplay) {
                            if (i == 0) {
                                Player.currentTrack = data.response[k];
                                Player.currentNumber = i;
                                Player.play(data.response[k].url)
                            };

                        }
                    } else if (data.error) {
                        //alert(JSON.stringify(data))
                        App.vkFindStack.push(setTimeout(function () { q(i) }, 500));
                    } else if (data.response && data.response[0] == 0) {
                        Player.findTrackWithoutLyrics(i)
                    }
                })
            }
        })(i), 500 * l))
    }
}

Player.findTrackByTag = function () {
    Player.firstPlay = false;
    if (App.radio) {
        uppodSend("player1", 'stop');
        uppodSend("player1", 'time0');
        App.radio = false;
        clearInterval(App.radioInt);
        App.ultra.currentTrack = '';
        App.s = setInterval(Player.q, 1000);
    }
    App.clearVkFindStack()

    App.vkFindStack = [];
    App.vkFind = true;
    Player.currentNumber = 0;
    Player.playlist = [];
    for (var i = 0; i < LastFM.tracks.length; i++) {
        App.vkFindStack.push(setTimeout((function (i) {
            return function q() {
                if (!LastFM.tracks[i] || !LastFM.tracks[i].name || App.vkFind == false) { return 1 }
                VK.api('audio.search', { q: App.util.changeHTMLSymbols(LastFM.tracks[i].artist.name + ' ' + LastFM.tracks[i].name), sort: 2, count: 8, lyrics: 1 }, function (data) {
                    //
                    if (i > LastFM.tracks.length) { return 1 };
                    if (data.response && data.response[0] != 0 && App.vkFind == true) {
                        for (var j = 0; j < data.response.length; j++) {
                            if (LastFM.tracks[i].artist.name == data.response[j].artist && LastFM.tracks[i].name == data.response[j].title) {
                                var k = j;
                                break;
                            }
                        }
                        var k = k || 1;
                        var fullTime = data.response[k].duration;
                        var fullMin = Math.floor(fullTime / 60);
                        var fullSec = Math.floor(fullTime - fullMin * 60);
                        var time = fullMin + ':' + (fullSec.toString().length == 1 ? '0' + fullSec : fullSec);
                        var span = document.createElement('span');
                        LastFM.tracks[i].span.innerHTML = time;
                        LastFM.tracks[i].div.className = 'finded';
                        LastFM.tracks[i].div.data = data.response[k];
                        data.response[k].div = LastFM.tracks[i].div;
                        //LastFM.tracks[i].div.a.href = data.response[k].url;
                        LastFM.tracks[i].div.onclick = (function (track, i) {
                            return function () {
                                Player.currentTrack = track;
                                Player.currentNumber = i;
                                Player.play(track.url, true);
                            }
                        })(data.response[k], i)
                        //Player.playlist.push(data.response[1])
                        Player.playlist[i] = data.response[k];
                        if (App.define.autoplay) {
                            if (i == 0) {
                                Player.currentTrack = data.response[k];
                                Player.currentNumber = i;
                                Player.play(data.response[k].url)
                            };

                        }
                    } else if (data.error) {
                        //alert(JSON.stringify(data))
                        App.vkFindStack.push(setTimeout(function () { q(i) }, 2000));
                    } else if (data.response && data.response[0] == 0) {
                        Player.findTrackByTagWithoutLyrics(i)
                    }
                })
            }
        })(i), 800 * i))
    }

}

Player.findTrackByTagWithoutLyrics = function (i) {
    App.vkFindStack.push(setTimeout((function () {
        return function q2() {
            if (!arguments.callee.col) { arguments.callee.col = 0 }
            arguments.callee.col++;
            if (arguments.callee.col > 3) {
                $(LastFM.tracks[i].div).fade('out');
                return 1
            };
            if (!LastFM.tracks[i] || !LastFM.tracks[i].name || App.vkFind == false) { return 1 }
            VK.api('audio.search', { q: App.util.changeHTMLSymbols(LastFM.tracks[i].artist_name + ' ' + LastFM.tracks[i].name), sort: 2, count: 8 }, function (data) {
                //
                if (data.response && data.response[0] != 0) {
                    for (var j = 0; j < data.response.length; j++) {
                        if (LastFM.artistName == data.response[j].artist && LastFM.tracks[i].name == data.response[j].title) {
                            var k = j;
                            break;
                        }
                    }
                    var k = k || 1;
                    var fullTime = data.response[k].duration;
                    var fullMin = Math.floor(fullTime / 60);
                    var fullSec = Math.floor(fullTime - fullMin * 60);
                    var time = fullMin + ':' + (fullSec.toString().length == 1 ? '0' + fullSec : fullSec);
                    var span = document.createElement('span');
                    LastFM.tracks[i].span.innerHTML = time;
                    LastFM.tracks[i].div.className = 'finded';
                    LastFM.tracks[i].div.data = data.response[k];
                    //         LastFM.tracks[i].div.a.href = data.response[k].url;
                    data.response[k].div = LastFM.tracks[i].div;
                    LastFM.tracks[i].div.onclick = (function (track, i) {
                        return function () {
                            Player.currentTrack = track;
                            Player.currentNumber = i;
                            Player.play(track.url, true);
                        }
                    })(data.response[k], i)
                    //Player.playlist.push(data.response[1])
                    Player.playlist[i] = data.response[k];
                } else if (data.error) {
                    //alert(JSON.stringify(data))

                    App.vkFindStack.push(setTimeout(function () { q2(i) }, 500));
                    //setTimeout(function () { Player.findSong(Player.findSong.div) }, 500)
                }else if (data.response && data.response[0] == 0) {
                    App.vkFindStack.push(setTimeout(function () { q2(i) }, 500));
                }
            })
        }
    })(), 500)
    )
}


Player.findTrackWithoutLyrics = function (i) {
    App.vkFindStack.push(setTimeout((function () {
        return function q2() {
            if (!arguments.callee.col) { arguments.callee.col = 0 }
            arguments.callee.col++;
            if (arguments.callee.col > 3) { return 1 };
            if (!LastFM.tracks[i] || !LastFM.tracks[i].name || App.vkFind == false) { return 1 }
            VK.api('audio.search', { q: App.util.changeHTMLSymbols(LastFM.artistName + ' ' + LastFM.tracks[i].name), sort: 2, count: 8 }, function (data) {
                //
                if (data.response && data.response[0] != 0) {
                    for (var j = 0; j < data.response.length; j++) {
                        if (LastFM.artistName == data.response[j].artist && LastFM.tracks[i].name == data.response[j].title) {
                            var k = j;
                            break;
                        }
                    }
                    var k = k || 1;
                    var fullTime = data.response[k].duration;
                    var fullMin = Math.floor(fullTime / 60);
                    var fullSec = Math.floor(fullTime - fullMin * 60);
                    var time = fullMin + ':' + (fullSec.toString().length == 1 ? '0' + fullSec : fullSec);
                    var span = document.createElement('span');
                    LastFM.tracks[i].span.innerHTML = time;
                    LastFM.tracks[i].div.className = 'finded';
                    LastFM.tracks[i].div.data = data.response[k];
                    //                LastFM.tracks[i].div.a.href = data.response[k].url;
                    data.response[k].div = LastFM.tracks[i].div;
                    LastFM.tracks[i].div.onclick = (function (track, i) {
                        return function () {
                            Player.currentTrack = track;
                            Player.currentNumber = i;
                            Player.play(track.url, true);
                        }
                    })(data.response[k], i)
                    //Player.playlist.push(data.response[1])
                    Player.playlist[i] = data.response[k];
                } else if (data.error) {
                    //alert(JSON.stringify(data))

                    App.vkFindStack.push(setTimeout(function () { q2(i) }, 500));
                    //setTimeout(function () { Player.findSong(Player.findSong.div) }, 500)
                }
            })
        }
    })(), 500)
    )
}

Player.changeAlbum = function (album, tag) {
    //alert(album.data.name);
    LastFM.album = '42';
    setTimeout(function () {
        var scr = document.createElement('script');
        scr.src = 'http://' + 'ws.audioscrobbler.com/2.0/?method=album.getInfo&artist=' +  album.data.artist.name + '&album=' + album.data.name + '&api_key=809dffc5f629c1d4871323f01379bc0d&format=json&callback=LastFM.responceTracks&lang=ru';
        document.body.appendChild(scr)
    }, 100)
}
