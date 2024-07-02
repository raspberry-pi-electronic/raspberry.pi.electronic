
/*
https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects
https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

*/

enable_mouse_x_send = 0

async function invokeApi(api, callback=null, method="GET", data=null) {
    try {
        response = null
        if (data) {
            console.log("invokeApi '" + api + "' via method '" + method + "'")
            console.log("sending: " + JSON.stringify(data))
            response = await fetch(api, {
                method: method,
                headers: new Headers({'content-type': 'application/json'}),
                body: JSON.stringify(data)
            });
        }
        else {
            response = await fetch(api, {"method": method});
        }

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

        if( callback ) {
            callback(json)
        }

    } catch (error) {
        console.error(error.message);
    }
}

<!--
https://www.w3schools.com/jsref/event_onmousemove.asp
-->

function showX(e) {
    if (!enable_mouse_x_send) {
        return;
    }
    let x = e.clientX;
    let y = e.clientY;
    sendValue(x);
}

function moveElement(obj) {
    obj.style.position = "absolute"; // setting the HTML object to absolute positioning
    /*
    get the HTML object's height -- it contains a unit, such as 200 px
    'parseInt' is to parse (extract or read) the integer value
    */
    h = parseInt(obj.offsetHeight);
    w = parseInt(obj.offsetWidth);

    /*
        setting the 'mouse move' event handler
    */
    obj.onmousemove = function(evt) {
        /*
            the current mouse location:
            evt.clientX
            evt.clientY

            the x coordinate, subtract (move to the left) by half of the width length
            the y coordinate, subtract (move to the top) by half of the height length


        */
        x = evt.clientX - w / 2;
        y = evt.clientY - h / 2;

        /*
            setting the HTML object's location
        */
        obj.style.left = x;
        obj.style.top = y;
    };

    /*
       setting up the 'mouse up' event handler
    */
    obj.onmouseup = function() {
        obj.onmousemove = null;
    };

    /*
       setting up the 'mouse out' event handler
    */
    obj.onmouseout = obj.onmouseup;
}

function toggleMouseXSend() {
    enable_mouse_x_send = 1 - enable_mouse_x_send;
}

function sendValue(num) {
    invokeApi("/showNumber", showNumber_callback, "POST", {num: num})
}

function sendNumber(eleId) {
    ele = document.getElementById(eleId)
    num = ele.value
    invokeApi("/showNumber", showNumber_callback, "POST", {num: num})
}

function clearNumber(eleId) {
    document.getElementById(eleId).value = ""
    invokeApi("/clearNumber")
}

function showNumber_callback(data) {
    console.log("showNumber callback")
    console.log(JSON.stringify(data))
}
