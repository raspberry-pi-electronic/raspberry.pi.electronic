
async function invokeApi(api, callback=null, method="GET", data=null) {
    try {
        response = null
        if (data) {
            response = await fetch(url, {
                "method": method,
                "body": JSON.stringify(data)
            });
        }
        else {
            response = await fetch(url, {"method": method});
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

function sendNumber(num) {
    invokeApi("/showNumber", callback=showNumber_callback, method="POST", data={"num": num})
}

function showNumber_callback(data) {
    console.log("showNumber callback")
    console.log(JSON.stringify(data))
}
