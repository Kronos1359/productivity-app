const dateElement = document.getElementById("date")
const clock = document.getElementById("clock")
const greeting = document.getElementById("greeting")

function updateClock(){

    const now = new Date()

    let hours = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()

    // Format time
    hours = hours % 12 || 12
    minutes = minutes.toString().padStart(2, '0')
    seconds = seconds.toString().padStart(2, '0')

    const ampm = now.getHours() >= 12 ? "PM" : "AM"

    clock.textContent = `${hours}:${minutes}:${seconds} ${ampm}`

    const date = now.toDateString()
    dateElement.textContent = date

}

function updateGreeting(){

    const hour = new Date().getHours()

    if(hour < 12){
        greeting.textContent = "Good morning, Saachi ☀️"
    }
    else if(hour < 18){
        greeting.textContent = "Good afternoon, Saachi 🌤️"
    }
    else{
        greeting.textContent = "Good evening, Saachi 🌙"
    }

}

// Run every second
setInterval(updateClock, 1000)

// Run once on load
updateClock()
updateGreeting()
