let mp = new Map();
let ss = "";
let year = '2022', term = '2R';

let classes = [];

function refresh() {
    mp.clear();
    ss = "";
}

function made() {
    for ([key,value] of mp) {
        ss += key + "=> " + value + "\n";
    }
    return ss;
}

function url(year, term, gradCd, colCd, deptCd, courCd, courCls, courNm) {
    var url = "http://infodepot.korea.ac.kr/lecture1/lecsubjectPlanView.jsp";
    url += "?year=" + year + "&term=" + term + "&grad_cd=" + gradCd + "&col_cd=" + colCd + "&dept_cd=" + deptCd + "&cour_cd=" + courCd + "&cour_cls=" + courCls + "&cour_nm=" + courNm + "&std_id=" + "&device=WW" + "";
    return url;
}

function ent(haksu) {
    refresh();
    let lens = classes.length;
    for (let i = 0; i < lens; i++) {
        (function(i) {
            if((i%100)==0) console.log(i);
            var id = haksu + (("000" + i).slice(-3));
            $.ajax({
                type: 'GET',
                url: url(year, term, '0136', '9999', '', id, '00', ''),
                async: false
            }).done(function(text) {
                var p = /([A-Z]{4})([0-9]{3})\ \( ([0-9]{2})\ \)/g;
                if (text.match(p) != null) {
                    let cour = text.match(p)[0].replaceAll(" ", "");
                    let res = $(text).find(".top_page h3")[0].innerText.match(/\[(.*?)\]/g)[0].replaceAll(" ", "");
                    //console.log(cour);
                    //console.log(res);
                    mp.set(cour, res);
                }
            });
            $.ajax({
                type: 'GET',
                url: url('2021', '2R', '0136', '9999', '', id, '01', ''),
                async: false
            }).done(function(text) {
                var p = /([A-Z]{4})([0-9]{3})\ \( ([0-9]{2})\ \)/g;
                if (text.match(p) != null) {
                    let cour = text.match(p)[0].replaceAll(" ", "");
                    let res = $(text).find(".top_page h3")[0].innerText.match(/\[(.*?)\]/g)[0].replaceAll(" ", "");
                    //console.log(cour);
                    //console.log(res);
                    mp.set(cour, res);
                }
            });
        }
        )(i);
    }
    console.log(made());
}