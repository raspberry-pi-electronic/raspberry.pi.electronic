
/*
https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects
https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

*/

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

function showX(e) {
    let x = e.clientX;
    let y = e.clientY;
    console.log("mouse x: " + x)
    sendValue(x);
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
