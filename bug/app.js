'use strict';
if (location.hash.substr(1).length == Math.ceil(document.getElementsByClassName("checkbox").length / 5)) {
    if (!decode()) {
        alert("解析失敗");
    }
}
else if (location.hash != "") {
    alert("資料長度不正確，無法進行解析，請確認網址是否複製貼上完全");
}
let data = Array(document.getElementsByClassName("checkbox").length).fill(0);
document.getElementById("app").addEventListener("change", function (e) {
    if (e.target.classList.contains("checkbox")) {
        let checkboxs = document.getElementsByClassName("checkbox");
        for (let i = 0; i < data.length; i++) {
            data[i] = boolToInt(checkboxs[i].checked);
            if (document.getElementById("hidden-got").classList.contains("active")) {
                e.target.parentElement.parentElement.classList.add("hidden");
            }
        }
        encode();
    }
});

document.getElementById("hidden-got").addEventListener("click", function () {
    this.classList.toggle("active");
    let tr = document.getElementsByTagName("tr");
    for (let i = 0; i < tr.length; i++) {
        let cb = tr[i].getElementsByClassName("checkbox")[0];
        if (this.classList.contains("active")) {
            if (cb.checked) {
                tr[i].classList.add("hidden");
            } else {
                tr[i].classList.remove("hidden");
            }
        } else {
            tr[i].classList.remove("hidden");
        }
    }
});

function boolToInt(value) {
    return value ? 1 : 0;
}
function encode() {
    location.hash = encodeCore(data.join(""));
}

function decode() {
    let read = decodeCore(location.hash.substr(1)).split(""),
        checkboxs = document.getElementsByClassName("checkbox");
    if (checkboxs.length != read.length) {
        alert("儲存的資料不正確，無法進行讀取");
        return false;
    }
    for (let i = 0; i < read.length; i++) {
        checkboxs[i].checked = parseInt(read[i], 10);
    }
    return true;
}

// Based on: https://stackoverflow.com/questions/17204912/javascript-need-functions-to-convert-a-string-containing-binary-to-hex-then-co

function encodeCore(s) {
    let i, k, part, accum, ret = '';
    for (i = s.length - 1; i >= 4; i -= 5) {
        part = s.substr(i + 1 - 5, 5);
        accum = 0;
        for (k = 0; k < 5; k++) {
            if (part[k] !== '0' && part[k] !== '1') {
                return "";
            }
            accum = accum * 2 + parseInt(part[k], 10);
        }
        if (accum >= 10) {
            ret = String.fromCharCode(accum - 10 + 'A'.charCodeAt(0)) + ret;
        } else {
            ret = String(accum) + ret;
        }
    }
    if (i >= 0) {
        accum = 0;
        for (k = 0; k <= i; k++) {
            if (s[k] !== '0' && s[k] !== '1') {
                return "";
            }
            accum = accum * 2 + parseInt(s[k], 10);
        }
        if (accum >= 10) {
            ret = String.fromCharCode(accum - 10 + 'A'.charCodeAt(0)) + ret;
        } else {
            ret = String(accum) + ret;
        }
    }
    return ret;
}

function decodeCore(s) {
    let i, ret = '';
    for (i = 0; i < s.length; i++) {
        if ((s[i] <= '9' && s[i] >= 0) || (s[i] <= 'V' && s[i] >= 'A')) {
            ret += paddingLeft(parseInt(s[i], 32).toString(2), 5);
        } else {
            return "";
        }
    }
    ret = ret.substring(ret.length - document.getElementsByClassName("checkbox").length, ret.length);
    return ret;
}

//End

function paddingLeft(str, length) {
    if (str.length >= length)
        return str;
    else
        return paddingLeft("0" + str, length);
}