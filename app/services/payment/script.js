const button = document.getElementById("pay-button")
button.addEventListener('click' , () => {
    fetch('/create-checkout-session' , { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        } , 
        body: JSON.stringify({
            reservation : [
                {id :  1 , date : new Date()}
            ]

        })
    }).then (res => {
        if(res.ok) return res.json 
        return res.json().then(json => Promise.reject(json))
    }).then (({url}) => {
        window.location = url 
    }).catch (e =>  {
        console.log(e)
    })
})