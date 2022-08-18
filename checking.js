let url = "https://sugang.korea.ac.kr/sugang?attribute=sugangMode&fake=";
let empty_check = "https://sugang.korea.ac.kr/sugang?attribute=viewClose&fake=";
let tm = null;
let dt = new FormData();
let dt_check = new FormData();
let cnt = 0, timer = 0, grade = 2;
let year = "2022", term = "2R";
let exchange = true;
dt.set("mode", "insert");
dt_check.set("year", year);
dt_check.set("term", term);

let subjects =
[
    ['MATH212','02'], 
    ['MATH201','01'],
    ['MATH392','01'],
    ['STAT232','02'],
    ['BUSS244','01']
]

// mp2: If empty & in person
// if mp empty => insert request + mp2 insert
let mp = new Map(); // ["name" : "time"], if full => time : NULL / register => time : Date(2099, 11, 31, 23, 59, 59) / sell : setting
let mp2 = new Map();

function is_empty_checking() {
    let t= mp.size;
    let classes = Array.from(mp.keys()), boole = Array.from(mp.values());
    for(let j = 0; j < t; j++) {
        let clss = classes[j], booles = boole[j];
        console.log(clss + "check?: " + booles);
        if(booles == null) continue;
        if(booles == false) {
            dt_check.set("cour_cd", clss.split("@")[0]);
            dt_check.set("cour_cls", clss.split("@")[1]);
            $.ajax({
                url : empty_check + String(new Date().getTime()),
                type : 'post',
                async : false, 
                processData: false,
                data : (new URLSearchParams(dt_check)).toString(),
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                dataType : 'html'
            }).done(function(json){
                //console.log(json);
                let e = $(json).find('table tr')
                let every = 7;
                for(let i = 1; i<=4;i++)  if(parseInt($(e[i]).find('td')[1].innerText)>0 && exchange) every = grade;
                let nw = eval($(e[every]).find('td')[0].innerText);
                let en = eval($(e[every]).find('td')[1].innerText);
                if(exchange  && every != grade) nw -= parseInt($(e[5]).find('td')[0].innerText), en -= parseInt($(e[5]).find('td')[1].innerText)
                console.log(nw, en);
                if(nw < en){
                    // request part
                    dt.set("params",clss);
                    $.ajax({
                        url : url + String(new Date().getTime()),
                        type : 'post',
                        async : false, 
                        processData: false,
                        data : (new URLSearchParams(dt)).toString(),
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        dataType : 'json'
                    }).done(function(req){
                        console.log(clss);
                        console.log(req);
                        if(req.code=="200") mp.set(clss, true), cnt++;
                        else if(req.code=="501") mp.set(clss, false);
                        else if(req.code=="500") {
                            let mess = req.msg;
                            if(mess.includes("수강매매")) mp.set(clss, true), mp2.set(clss, new Date(mess.match(/(?<=\[).+?(?=\])/)[0]));
                        }
                    });
                }
            });       
        } 
    }
}
/* function checking() {
    let t = mp.size
    let classes = Array.from(mp.keys()), timers = Array.from(mp.values());
    for(let i=0;i<t;i++){
        console.log("checking!");
        (function(i){
            let clss = classes[i], times = timers[i];
            if(times == null || times <= new Date())
            { 
                dt.set("params",clss);
                $.ajax({
                    url : url + String(new Date().getTime()),
                    type : 'post',
                    async : false, 
                    processData: false,
                    data : (new URLSearchParams(dt)).toString(),
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    dataType : 'json'
                }).done(function(json){
                    console.log(clss);
                    console.log(json);
                    if(json.code=="200") mp.set(clss, new Date(2099, 11, 31, 23, 59, 59)), cnt++;
                    else if(json.code=="501") mp.set(clss, null);
                    else if(json.code=="500") {
                        let mess = json.msg;
                        if(mess.includes("수강매매")) mp.set(clss, new Date(2099, 11, 31, 23, 59, 59)), mp2.set(clss, new Date(mess.match(/(?<=\[).+?(?=\])/)[0]));
                    }
                });
            }
        })(i)
    }
} */

function selling() {
    let t = mp2.size
    let classes = Array.from(mp2.keys()), timers = Array.from(mp2.values());
    for(let i=0;i<t;i++){
        (function(i){
            let clss = classes[i], times = timers[i];
            if(Math.abs(times - new Date()) <= 5000)
            { 
                console.log("selling: " + clss + "!");
                dt.set("params",clss);
                $.ajax({
                    url : url + String(new Date().getTime()),
                    type : 'post',
                    async : false, 
                    processData: false,
                    data : (new URLSearchParams(dt)).toString(),
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    dataType : 'json'
                }).done(function(json){
                    console.log(clss);
                    console.log(json);
                    if(!json.msg.includes("수강매매")) {
                        mp2.delete(clss);
                        if(json.code != "200") mp.set(clss, false);
                        else cnt++;
                    }
                });
            }
        })(i)
    }
}

function res() {
    tm=setTimeout(()=>{
        selling();
        is_empty_checking();
        timer++;
        if(cnt==mp.size) {
            console.log("end!!!!"), tm=clearTimeout(tm);
            return;
        }
        if(timer==20) {
            $('#menu_basket').click();
            $('#menu_sugang').click();
            timer = 0;
        }
        res();
    }, 1000*1);
    console.log("cnt: "+ cnt + "timer: " + timer);
}

function register(lists){
    lists.forEach(element => {
        mp.set(element[0] + "@" + element[1], false);
    });
    res();
}

register(subjects);