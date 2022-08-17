let url = "https://sugang.korea.ac.kr/sugang?attribute=sugangMode&fake="
let tm = null;
let dt = new FormData();
let cnt = 0, timer = 0;
// let year = "2022", term = "2R"
dt.set("mode", "insert");

let subjects =
[
    ['MATH212','02'], 
    ['COSE382','01'],
    ['COSE474','02'],
    ['MATH201','01'],
    ['MATH392','01'],
    ['MATH222','02'],
    ['STAT232','02'],
    ['GECT001','00']
]

let mp = new Map(); // ["name" : "time"], if full => time : NULL / register => time : Date(2099, 11, 31, 23, 59, 59) / sell : setting
let mp2 = new Map();

function checking() {
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
}

function selling() {
    let t = mp2.size
    let classes = Array.from(mp2.keys()), timers = Array.from(mp2.values());
    for(let i=0;i<t;i++){
        (function(i){
            let clss = classes[i], times = timers[i];
            if(Math.abs(times - new Date()) <= 5)
            { 
                console.log("selling: " + clss + "!");
                dt.set("params",clss);
                mp2.delete(clss);
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
                    if(json.code != "200") mp.set(clss, null);
                    else cnt++;
                });
            }
        })(i)
    }
}

function res() {
    tm=setTimeout(()=>{
        selling();
        if(cnt==mp.size) {
            console.log("end!!!!"), tm=clearTimeout(tm);
            return;
        }
        if(timer==0) $('#menu_basket').click(), $('#menu_sugang').click(), checking();
        timer++, timer%=60;
        res();
    }, 1000*1);
    console.log(cnt);
}

function register(lists){
    lists.forEach(element => {
        mp.set(element[0] + "@" + element[1], null);
    });
    res();
}

register(subjects);