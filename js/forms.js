import * as $ from 'jquery';

import * as msgs from "./msgs.json" //only possible coz using webpack >v2;

export function ajaxPost(formElement, prepostData, doneFunc) {
    const zform = $(formElement);
    // grab form input field values and put them in a json obj
    const json = prepostData || {};
    json.redirect = document.referrer;
    //console.log ("json", json);
    zform.find("input[type='text'],input[type='email'],input[type='password']").each(function () {
        const elem = $(this);
        json[elem.attr("name")] = elem.prop("value");
    });

    $.ajax({
        type: zform.attr("method"),
        url: zform.attr("action"),
        data: json,
        dataType: "json",
        encode: true,
        success: function (data, status, xhr) {
            if (data.status === "success") {
                if (data.redirect) {    // redirect if login good
                    window.location.assign(data.redirect);
                } else if (data.msg) {
                    $("#msg").html(data.msg);//addClass("backToBlack");
                    var modal = $("#msgModal");
                    modal.trigger('openModal');
                    var ml = -1 * modal.width() / 2;
                    var mt = -1 * modal.height() / 2;
                    modal.css("margin-left", ml).css("margin-top", mt);// recentre
                }
            } else if (data.status !== "success") {    // say which field is wrong if login bad
                if (data.redirect) {    // redirect if login good
                    window.location.assign(data.redirect);
                } else if (data.field) {
                    $("#" + data.field).siblings(".error2").css("display", "inline");
                    if (data.msg) {
                        $("#" + data.field).siblings(".error2").text(data.msg);
                    }
                } else if (data.msg) {
                    $("#msg").text(data.msg);
                    var modal = $("#msgModal");
                    modal.trigger('openModal');
                    var ml = -1 * modal.width() / 2;
                    var mt = -1 * modal.height() / 2;
                    modal.css("margin-left", ml).css("margin-top", mt);// recentre
                }
                $(".revealOnFailure").css("display", "block");
                if (data.revalidate) {
                    //$('.BDC_ReloadIcon').trigger('click'); // botdetect reload
                }
            }
        },
        error: function (jqXhr, textStatus, errorThrown) {
            $("#msg").html("Server side error: " + jqXhr.responseText + ".<br>Please contact Xi Administrator.");
        },
        complete: function () {
            if (doneFunc) {
                doneFunc();
            }
        }
    });
}

export function simpleAjaxPost(ajaxSetup, prepostData, doneFunc) {
    // grab form input field values and put them in a json obj
    const json = prepostData || {};
    json.redirect = document.referrer;
    console.log("json", json);

    $.ajax({
        type: ajaxSetup.method || "GET",
        url: ajaxSetup.url,
        data: json,
        dataType: "json",
        encode: true,
        success: function (data, status, xhr) {
            if (doneFunc) {
                doneFunc();
            }
        },
        error: function (jqXhr, textStatus, errorThrown) {
            $("#msg").html("Server side error: " + jqXhr.responseText + ".<br>Please contact Xi Administrator.");
        },
        complete: function () {
        }
    });
}


export function getMsg(key) {
    // let language = window.navigator.userLanguage || window.navigator.language;
    // language = language.split("-")[0];
    // return (window.msgs[language] || window.msgs["en"])[key];
    return msgs["en"][key];
}

export function makeFooter() {
    console.log("MAKING FOOTER");

    $("body").append("<footer><hr class='wideDivider'><p><a href='' id='xiemail'></a></p><p></p></footer>");
    const ximail = getMsg("xiAdminEmail");
    $("#xiemail")
        .attr("href", "mailto:" + ximail)
        .text(ximail)
    ;
}

export function getSpinner() {
    return new Spinner({
        lines: 13, // The number of lines to draw
        length: 5, // The length of each line
        width: 2, // The line thickness
        radius: 7, // The radius of the inner circle
    });
}

export function makeHelpButton() {
    $("#helpButton").on("click", function () {
        window.open(getMsg("xiHelpURL"), "_blank");
    });
    // Make buttons - previously could do immediately, but loading in text from msgs.json means icons need to be added afterwards
    const buttonData = [
        {id: "#helpButton", type: "button", label: this.getMsg("xiHelp")},
    ];
    buttonData.forEach(function (buttonDatum) {
        const buttonID = buttonDatum.id;
        $(buttonID)
            .attr("type", buttonDatum.type)
            .attr("class", "btn")
            .text(buttonDatum.label)
        ;
    });
}
