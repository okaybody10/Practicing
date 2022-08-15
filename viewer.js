let url = "https://sugang.korea.ac.kr/sugang?attribute=viewClose&fake="
let tm = null;
let dt = new FormData();
let cnt = 0, timer = 0;
let guids = null;
dt.set("year", "2022");
dt.set("term", "2R");

let classes =
[
    ['MATH212','02']
]

function sugang(lists){
    for(let i=0;i<lists.length;i++){
    (function(i){
            let cours = lists[i][0]+"@"+lists[i][1];
            dt.set("cour_cd", lists[i][0]);
            dt.set("cour_cls", lists[i][1]);
            $.ajax({
                url : url + String(new Date().getTime()),
                type : 'post',
                async : false, 
                processData: false,
                data : (new URLSearchParams(dt)).toString(),
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                dataType : 'json'
            }).done(function(json){
                // console.log(cours);
                console.log(json);
                if(json.code=="200") cnt++;
                // console.log(cnt);	
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
    }, 1000*3);
    console.log(cnt);
}

function init() {
    ar =  document.cookie.split('; ').reduce((prev, current) => {
        const [name, ...value] = current.split('=');
        prev[name] = value.join('=');
        return prev;
    }, {});
    guids = JSON.parse(ar['my-application-browser-tab']).guid;
    // console.log(guids)
}
//res(classes);

/*let x = setInterval(()=>{
    $('#menu_basket').click();
    $('#menu_sugang').click();
    console.log(new Date());
    if((new Date())>(new Date(2022, 01, 17, 09, 59, 48))) {
        res(classes);
        clearInterval(x);
    }
}, 1000*2) // Set Data Please*/

init();