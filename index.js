const express = require("express")
const port = process.env.PORT || 3000
const app = express()

app.set("view engine", "ejs")
app.set("views", "views")

app.use(express.static("public"))

app.get("/", function(req, res){
    res.render("home")
})

app.listen(port, function(){
    console.log(`Application started on port: ${port}`)
})