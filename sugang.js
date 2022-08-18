let url = "https://sugang.korea.ac.kr/sugang?attribute=sugangMode&fake="
let tm = null;
let dt = new FormData();
let cnt = 0, timer = 0;
dt.set("mode", "insert");

let classes =
[
    ['GELI002','CA'], 
    ['IFLS012','C1'],
    ['NRSG250','01'],
    ['GEHI084','00']
]

function sugang(lists){
    for(let i=0;i<lists.length;i++){
    (function(i){
            let cours = lists[i][0]+"@"+lists[i][1];
            dt.set("params",cours);
            $.ajax({
                url : url + String(new Date().getTime()),
                type : 'post',
                async : false, 
                processData: false,
                data : (new URLSearchParams(dt)).toString(),
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                dataType : 'json'
            }).done(function(json){
                console.log(cours);
                console.log(json);
                if(json.code=="200") cnt++;
                console.log(cnt);	
            });
        })(i)
    }
}

function res(lists){
    tm=setTimeout(()=>{
        sugang(lists);
        if(cnt==lists.length || timer > 20) {
            console.log("end!!!!"), tm=clearTimeout(tm);
            return;
        }
        timer++;
        res(lists);
    }, 500*3);
    console.log(cnt);
}

//res(classes);

let x = setInterval(()=>{
    $('#menu_basket').click();
    $('#menu_sugang').click();
    console.log(new Date());
    if((new Date())>(new Date(2022, 07, 19, 09, 59, 55))) {
        res(classes);
        clearInterval(x);
    }
}, 1000*2) // Set Data Please

x;
